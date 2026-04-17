import logging
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

logger = logging.getLogger(__name__)

def get_recipient_email(obj):
    # obj can be Order or Payment
    client = getattr(obj, 'client', None) or getattr(obj.order, 'client', None)
    if not client:
        return None
    return client.email

def send_custom_email(subject, template_name, context, to_email, attachment=None):
    print(f"DEBUG: Attempting to send email: {subject} to {to_email}")
    if not to_email:
        print("DEBUG: No to_email provided, aborting.")
        return False
    """
    Sends a branded HTML email with a text fallback.
    """
    try:
        html_content = render_to_string(template_name, context)
        text_content = strip_tags(html_content)
        
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL or "noreply@digiscia.com",
            to=[to_email]
        )
        email.attach_alternative(html_content, "text/html")
        
        if attachment:
            # attachment is (filename, content, mimetype)
            email.attach(*attachment)
            
        email.send()
        print(f"DEBUG: Email sent successfully to {to_email}")
        logger.info(f"Email sent successfully: {subject} to {to_email}")
        return True
    except Exception as e:
        print(f"DEBUG: Failed to send email: {e}")
        logger.error(f"Failed to send email: {e}")
        return False

def send_order_confirmation(order):
    context = {
        'order': order,
        'client': order.client,
        'products': order.order_products.all(),
        'title': "Confirmation de commande",
    }
    return send_custom_email(
        f"Merci pour votre commande DigiScia #{order.id}",
        "emails/order_confirmation.html",
        context,
        get_recipient_email(order)
    )

def send_status_update(order):
    context = {
        'order': order,
        'client': order.client,
        'status_display': order.get_status_display(),
        'title': "Suivi de votre commande",
    }
    return send_custom_email(
        f"Mise à jour DigiScia : Votre commande #{order.id} est désormais {order.get_status_display()}",
        "emails/status_update.html",
        context,
        get_recipient_email(order)
    )

def send_payment_receipt(payment):
    print(f"DEBUG: send_payment_receipt triggered for Payment #{payment.id}")
    from .invoices import generate_invoice_for_payment
    
    if not payment.invoice_pdf:
        generate_invoice_for_payment(payment)
        
    context = {
        'payment': payment,
        'order': payment.order,
        'client': payment.order.client,
        'title': "Confirmation de paiement",
    }
    
    # Attachment logic
    payment.invoice_pdf.open("rb")
    attachment = (
        f"recu_digiscia_{payment.order.id}.pdf",
        payment.invoice_pdf.read(),
        "application/pdf",
    )
    payment.invoice_pdf.close()
    
    return send_custom_email(
        f"Paiement reçu DigiScia : Reçu pour la commande #{payment.order.id}",
        "emails/payment_confirmation.html",
        context,
        get_recipient_email(payment),
        attachment=attachment
    )
