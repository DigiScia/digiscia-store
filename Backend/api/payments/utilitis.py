import io
from django.core.files.base import ContentFile
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4

def generate_invoice_pdf(payment):
    """
    Génère un PDF simple de facture pour un Payment et le retourne
    sous forme de bytes.
    """
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)

    text = p.beginText(50, 800)
    text.textLine(f"Facture pour la commande #{payment.order.id}")
    text.textLine(f"Client : {payment.order.client.first_name} {payment.order.client.last_name}")
    text.textLine(f"Montant : {payment.value} FCFA")
    text.textLine(f"Type de paiement : {payment.type}")
    text.textLine(f"Date : {payment.payment_date}")
    # Ajoute d’autres infos si besoin

    p.drawText(text)
    p.showPage()
    p.save()

    pdf = buffer.getvalue()
    buffer.close()
    return pdf
