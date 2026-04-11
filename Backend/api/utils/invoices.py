# api/utils/invoices.py
import os
from django.conf import settings
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from django.core.files import File
from django.core.mail import EmailMessage
import os
# api/utils/invoices.py
# api/utils/invoices.py
import os
from django.template.loader import render_to_string
from django.conf import settings
from django.core.files import File
from xhtml2pdf import pisa


def build_invoice_context(payment):
    order = payment.order
    client = order.client
    user = client.user

    order_products_qs = order.order_products.all()

    products = []
    subtotal = 0

    for op in order_products_qs:
        price = op.oneself_price or 0
        quantity = op.quantity or 0
        line_total = price * quantity
        subtotal += line_total

        products.append({
            "product_name": op.product,
            "quantity": quantity,
            "price": price,
            "line_total": line_total,
        })

    return {
        "order": order,
        "payment": payment,
        "order_products": products,
        "subtotal": subtotal,
        "client_full_name": f"{user.first_name} {user.last_name}".strip(),
        "client_username": user.username,
        "delivery_info": order.shipping_cost,
    }


def generate_invoice_for_payment(payment):
    context = build_invoice_context(payment)

    html = render_to_string("invoices/invoice.html", context)

    invoices_root = os.path.join(settings.MEDIA_ROOT, "invoices")
    os.makedirs(invoices_root, exist_ok=True)

    filename = f"invoice_order_{payment.order.id}.pdf"
    filepath = os.path.join(invoices_root, filename)

    with open(filepath, "wb") as pdf_file:
        pisa.CreatePDF(
            src=html,
            dest=pdf_file,
            encoding="UTF-8"
        )

    with open(filepath, "rb") as f:
        payment.invoice_pdf.save(filename, File(f), save=True)

    return payment.invoice_pdf.url




from django.core.mail import EmailMultiAlternatives

def send_invoice_email(payment):
    if not payment.invoice_pdf:
        generate_invoice_for_payment(payment)

    context = build_invoice_context(payment)

    subject = f"Facture – Commande #{payment.order.id}"

    user = payment.order.client.user
    client_name = f"{user.first_name} {user.last_name}".strip() or user.username

    text_body = (
        f"Bonjour {client_name},\n\n"
        "Veuillez trouver votre facture en pièce jointe.\n"
        "Cordialement,\nDigiScia"
    )
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[payment.order.client.user.email],
    )
    payment.invoice_pdf.open("rb")
    email.attach(
        f"facture_commande_{payment.order.id}.pdf",
        payment.invoice_pdf.read(),
        "application/pdf",
    )
    payment.invoice_pdf.close()

    email.send()

