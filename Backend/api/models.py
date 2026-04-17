from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal


# Create your models here.

# Client
class Client(models.Model):
    first_name = models.CharField(max_length=256)
    last_name = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    phone_number = models.CharField(max_length=10)
    sign_in_date = models.DateField(auto_now_add=True)
    adress= models.CharField(max_length=256,blank=True )
    email = models.EmailField(max_length=256, blank=True, null=True)
    # fk
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="client_profile")

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
# Category
class Category(models.Model):
    name = models.CharField(max_length=256)
    
    def __str__(self):
        return f"{self.name}"
    
# Product
class Product(models.Model):
    name = models.CharField(max_length=256)
    description = models.TextField()
    adding_date = models.DateField(auto_now_add=True)
    stock = models.IntegerField()
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    promotion = models.DecimalField(max_digits=5, decimal_places=2, default=0.00) # Entier -> DecimalField pour pourcentage
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    # fk
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="products")

    def __str__(self):
        return f"{self.name}"
    @property
    def discounted_price(self):
        """
        Prix après promotion.
        Si promotion = 0 -> retourne current_price.
        Si promotion = 20 -> applique -20%.
        """
        if self.promotion and self.promotion > 0:
            discount_factor = (Decimal("100") - self.promotion) / Decimal("100")
            return (self.current_price * discount_factor).quantize(Decimal("0.01"))
        return self.current_price
    
# Comment
class Comment(models.Model):
    content = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    rating = models.PositiveSmallIntegerField(default=0)
    # fk
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="comments")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="comments")

    def __str__(self):
        return f"Comment by {self.client.user.username} on {self.product.name}"
    
# order status Choices 
ORDER_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('processing', 'Processing'),
    ('shipped', 'Shipped'),
    ('cancelled', 'Cancelled'),
    ('delivered', 'Delivered'), # Ajout d'un statut "delivered"
]

def get_default_planned_date():
    return timezone.now().date() + timedelta(days=7)
# Deliverer (Livreur)
class Deliverer(models.Model):
    name = models.CharField(max_length=256)
    phone_number = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.phone_number})"


# Order
class Order(models.Model):
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    order_date = models.DateField(auto_now_add=True)
    delivery_planned_date = models.DateField(default=get_default_planned_date)
    delivery_date = models.DateField(null=True, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    # nouveaux champs
    shipping_type = models.CharField(
        max_length=20,
        choices=[("store", "Retrait en magasin"), ("home", "Livraison à domicile")],
        default="store",
    )
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_type = models.CharField(
        max_length=20,
        choices=[
            ("cash", "Cash"),
            ("card", "Card"),
            ("paypal", "PayPal"),
            ("bank_transfer", "Bank Transfer"),
        ],
        default="cash",
    )

    # fk
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="orders")
    deliverer = models.ForeignKey(Deliverer, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders")

    def update_total(self):
        """
        Recalcule le montant total de la commande.
        """
        products_total = sum(op.oneself_price * op.quantity for op in self.order_products.all())
        self.total_amount = products_total + self.shipping_cost
        self.save()

    def __str__(self):
        return f"Order #{self.id} - {self.client.user.username}"

    
# Payment type choice
PAYMENT_TYPE_CHOICES = [
    ('card', 'Card'),
    ('paypal', 'PayPal'),
    ('cash', 'Cash'),
    ('bank_transfer', 'Bank Transfer'), # Ajout d'un type
]
# Payment status
PAYMENT_STATUS_CHOICES = [
    ('paid', 'Paid'),
    ('unpaid', 'Unpaid'),
    ('refunded', 'Refunded'),
]
# Payment
class Payment(models.Model):
    type = models.CharField(max_length=20, choices=PAYMENT_TYPE_CHOICES, default='cash')
    payment_date = models.DateField(auto_now_add=True)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
    invoice_pdf = models.FileField(upload_to="invoices/", null=True, blank=True)
    invoice_sent = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.value and self.order:
            self.value = self.order.total_amount
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payment for Order #{self.order.id}" #- {self.status}"


# Order_Product
class OrderProduct(models.Model):
    quantity = models.IntegerField()
    oneself_price = models.DecimalField(max_digits=10, decimal_places=2) 
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="order_products")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="order_products")
    shipping_type = models.CharField(max_length=20, blank=True, null=True)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_type = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        # Assure qu'un produit ne peut être ajouté qu'une seule fois par commande (la quantité est mise à jour)
        unique_together = ('order', 'product')

    def save(self, *args, **kwargs):
        if not self.oneself_price and self.product:
            self.oneself_price = self.product.current_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Order #{self.order.id}"


class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    date_subscribed = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email