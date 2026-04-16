from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Client, Category, Product, Comment, Order, Payment, OrderProduct, Subscriber

# Sign in
class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    first_name = serializers.CharField(write_only=True, required=True)
    last_name = serializers.CharField(write_only=True, required=True)
    city = serializers.CharField(write_only=True, required=True)
    adress = serializers.CharField(write_only=True, required=False)
    phone_number = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'city', 'adress', 'phone_number')
        extra_kwargs = {'email': {'required': True}}

    def create(self, validated_data):
        # Client data extraction
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        city = validated_data.pop('city')
        adress = validated_data.pop('adress')
        phone_number = validated_data.pop('phone_number')

        # User creation
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        # Client creation
        Client.objects.create(
            first_name=first_name,
            last_name=last_name,
            city=city,
            adress=adress,
            phone_number=phone_number,
            # fk
            user=user
        )
        return user

# User serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

# Client serializer
class ClientSerializer(serializers.ModelSerializer):
    # fk
    user = UserSerializer(read_only=True)

    class Meta:
        model = Client
        fields = '__all__'
    

# Category serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

# Product serializer
class ProductSerializer(serializers.ModelSerializer):
    # fk 
    category = CategorySerializer(read_only=True)

    image = serializers.ImageField(read_only=True) # absolute path to the image by default, so I can miss it

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'adding_date',
            'stock',
            'current_price',
            "discounted_price",
            'promotion',
            'image',
            'category',
        ]
        read_only_fields = ['adding_date']
    
    def get_image_url(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            # Fallback si la requête n'est pas disponible (ex: en tests ou context vide)
            return obj.image.url
        return None
        
    
# Comment serializer
class CommentSerializer(serializers.ModelSerializer):
    # fk
    client_username = serializers.CharField(source='client.user.username', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('client', 'created_date')

    


# Order_Product serializer
class OrderProductSerializer(serializers.ModelSerializer):
    # fk
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.current_price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderProduct
        fields = ('id', 'product', 'product_name', 'product_price', 'quantity', 'oneself_price')
        read_only_fields = ('oneself_price',)


# Order Serializer
class OrderSerializer(serializers.ModelSerializer):
    order_products = OrderProductSerializer(many=True, read_only=True) # Liste des produits dans la commande
    client_username = serializers.CharField(source='client.user.username', read_only=True)
    payment_status = serializers.CharField(source='payment.status', read_only=True) # Affiche le statut du paiement

    class Meta:
        model = Order
        fields = ('id', 'status', 'order_date', 'client', 'client_username', 'total_amount', 'order_products', 'payment_status','delivery_planned_date','delivery_date')
        read_only_fields = ('client', 'total_amount', 'order_date')

# Payment serializer
class PaymentSerializer(serializers.ModelSerializer):
    # fk
    order_id = serializers.IntegerField(source='order.id', read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('order', 'payment_date')


class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = '__all__'