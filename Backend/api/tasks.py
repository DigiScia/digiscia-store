from celery import shared_task
from django.core.management import call_command
from .utils.emails import (
    send_order_confirmation as sync_send_order_confirmation,
    send_status_update as sync_send_status_update,
    send_payment_receipt as sync_send_payment_receipt
)

@shared_task
def async_send_order_confirmation(order_id):
    """
    Asynchronous task to send order confirmation email.
    """
    from .models import Order
    try:
        order = Order.objects.get(pk=order_id)
        sync_send_order_confirmation(order)
        return f"Order confirmation sent for Order #{order_id}"
    except Order.DoesNotExist:
        return f"Order #{order_id} not found"

@shared_task
def async_send_status_update(order_id):
    """
    Asynchronous task to send order status update email.
    """
    from .models import Order
    try:
        order = Order.objects.get(pk=order_id)
        sync_send_status_update(order)
        return f"Status update sent for Order #{order_id}"
    except Order.DoesNotExist:
        return f"Order #{order_id} not found"

@shared_task
def async_send_payment_receipt(payment_id):
    """
    Asynchronous task to generate PDF and send payment receipt email.
    """
    from .models import Payment
    try:
        payment = Payment.objects.get(pk=payment_id)
        sync_send_payment_receipt(payment)
        return f"Payment receipt sent for Payment #{payment_id}"
    except Payment.DoesNotExist:
        return f"Payment #{payment_id} not found"
