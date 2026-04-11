from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Payment
from .utils import generate_invoice_pdf
from django.core.files.base import ContentFile

@receiver(post_save, sender=Payment)
def create_invoice_on_payment(sender, instance, created, **kwargs):
    # On ne génère la facture que à la création, pas à chaque update
    if not created:
        return

    pdf_bytes = generate_invoice_pdf(instance)
    filename = f"invoice_payment_{instance.id}.pdf"

    # Sauvegarde dans le FileField
    instance.invoice_pdf.save(filename, ContentFile(pdf_bytes), save=True)
