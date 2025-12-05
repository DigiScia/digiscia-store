from django.contrib import admin
from .models import Client, Category, Product, Comment, Order, Payment, OrderProduct
from .utils.invoices import generate_invoice_for_payment, send_invoice_email
from django.contrib import  messages
from django.utils.html import format_html

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'city', 'phone_number', 'sign_in_date', 'adress', 'user')
    search_fields = ('first_name', 'last_name', 'city', 'user__username')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'stock', 'current_price', 'promotion', 'adding_date')
    list_filter = ('category', 'adding_date')
    search_fields = ('name',)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('client', 'product', 'created_date')
    search_fields = ('client__user__username', 'product__name')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'status', 'order_date', 'total_amount')
    list_filter = ('status', 'order_date')
    search_fields = ('client__user__username',)

@admin.register(OrderProduct)
class OrderProductAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'oneself_price')


# api/admin.py

from django.urls import path
from django.shortcuts import redirect, get_object_or_404
from django.contrib import messages

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "value",
        "type",
        "payment_date",
        "invoice_pdf_actions",
    )

    readonly_fields = ("invoice_pdf",)

    actions = (
        "generate_invoice",
        "send_invoice_with_pdf",
    )

    # -----------------------------
    # Boutons dans la liste
    # -----------------------------
    def invoice_pdf_actions(self, obj):
        if obj.invoice_pdf:
            return format_html(
                '<a href="{}" target="_blank" style="margin-right: 10px;">Afficher</a>'
                '<a class="button" href="{}">Envoyer par email</a>',
                obj.invoice_pdf.url,
                f"{obj.id}/send-invoice/"
            )
        else:
            return format_html(
                '<a class="button" href="{}">Générer la facture</a>',
                f"{obj.id}/generate-invoice/"
            )
    invoice_pdf_actions.short_description = "Facture / Email"

    # -----------------------------
    # URLs custom pour les boutons
    # -----------------------------
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('<int:payment_id>/send-invoice/', self.admin_site.admin_view(self.send_invoice_view), name='send-invoice'),
            path('<int:payment_id>/generate-invoice/', self.admin_site.admin_view(self.generate_invoice_view), name='generate-invoice'),
        ]
        return custom_urls + urls

    def send_invoice_view(self, request, payment_id):
        payment = get_object_or_404(Payment, id=payment_id)
        send_invoice_email(payment)
        messages.success(request, f"Facture de la commande #{payment.order.id} envoyée par email.")
        return redirect(request.META.get('HTTP_REFERER'))

    def generate_invoice_view(self, request, payment_id):
        payment = get_object_or_404(Payment, id=payment_id)
        generate_invoice_for_payment(payment)
        messages.success(request, f"Facture de la commande #{payment.order.id} générée.")
        return redirect(request.META.get('HTTP_REFERER'))


    # -----------------------------
    # Actions classiques
    # ----------------------------
    @admin.action(description="Générer la facture PDF")
    def generate_invoice(self, request, queryset):
        generated = 0
        for payment in queryset:
            try:
                generate_invoice_for_payment(payment)
                generated += 1
            except Exception as e:
                self.message_user(
                    request,
                    f"Erreur facture paiement #{payment.id} : {e}",
                    level=messages.ERROR
                )

        self.message_user(
            request,
            f"{generated} facture(s) générée(s).",
            level=messages.SUCCESS
        )

    @admin.action(description="Envoyer la facture par email")
    def send_invoice_with_pdf(self, request, queryset):
        sent = 0
        skipped = 0

        for payment in queryset:
            try:
                user = payment.order.client.user

                if not user.email:
                    skipped += 1
                    continue

                send_invoice_email(payment)
                sent += 1

            except Exception as e:
                self.message_user(
                    request,
                    f"Erreur envoi paiement #{payment.id} : {e}",
                    level=messages.ERROR
                )

        if sent:
            self.message_user(
                request,
                f"{sent} facture(s) envoyée(s) par email.",
                level=messages.SUCCESS
            )

        if skipped:
            self.message_user(
                request,
                f"{skipped} paiement(s) sans email client.",
                level=messages.WARNING
            )