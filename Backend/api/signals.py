from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from .models import Order, Payment, OrderProduct
from .tasks import async_send_order_confirmation, async_send_status_update, async_send_payment_receipt


@receiver(pre_save, sender=Order)
def order_pre_save(sender, instance, **kwargs):
    print(f"DEBUG: pre_save triggered for Order #{instance.pk}")
    """
    Detect status changes and capture them for post_save.
    """
    if not instance.pk:
        return
        
    try:
        old_instance = Order.objects.get(pk=instance.pk)
        if old_instance.status != instance.status:
            instance._status_changed = True
        
        # Confirmation order logic: if total was 0 and now > 0, and it's pending
        if old_instance.total_amount == 0 and instance.total_amount > 0:
            instance._should_send_confirmation = True
    except Order.DoesNotExist:
        pass

@receiver(post_save, sender=Order)
def order_post_save_notifications(sender, instance, created, **kwargs):
    print(f"DEBUG: post_save triggered for Order #{instance.pk}, created={created}")
    """
    Handles both initial confirmation and status updates.
    """
    # 1. Order Confirmation (first time products are added)
    if getattr(instance, '_should_send_confirmation', False):
        async_send_order_confirmation.delay(instance.pk)
        instance._should_send_confirmation = False
    
    # 2. Status Update
    if not created and getattr(instance, '_status_changed', False):
        async_send_status_update.delay(instance.pk)
        instance._status_changed = False

@receiver(post_save, sender=Payment)
def payment_post_save(sender, instance, created, **kwargs):
    """
    Triggers payment confirmation and receipt email.
    """
    if created:
        # Generate and send receipt asynchronously
        async_send_payment_receipt.delay(instance.pk)


@receiver(post_save, sender=OrderProduct)
@receiver(post_delete, sender=OrderProduct)
def update_order_total_signal(sender, instance, **kwargs):
    """
    Recalculate order total whenever products are added, updated, or removed.
    """
    if instance.order:
        instance.order.update_total()
