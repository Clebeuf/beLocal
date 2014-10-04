from django.db import models
from django.contrib.auth.models import User

class Vendor(models.Model):
    user = models.ForeignKey(User) 
    company_name = models.CharField(max_length=200)
    webpage = models.CharField(max_length=400)
    country_code = models.CharField(max_length=50)
    phone = models.CharField(max_length=25)
    extension = models.CharField(max_length=25)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    photo = models.ImageField(upload_to='vendor')
    
class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=400)
    price = models.FloatField()
    photo = models.ImageField(upload_to='product')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    vendor = models.ForeignKey(Vendor)
    #tag = models.ManyToManyField(Tag)

class Tag(models.Model):
    name = models.CharField(max_length=100)

class ProductTag(models.Model):
    product = models.ManyToManyField(Product)
    tag = models.ForeignKey(Tag)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Address(models.Model):
    MARKET = 'MAR'
    FARM = 'FAR'
    ADDR_TYPES = (
        (MARKET, 'Market'),
        (FARM, 'Farm'),
    )

    addr_type = models.CharField(max_length=3, choices=ADDR_TYPES, default=FARM)

    addr_line1 = models.CharField(max_length=400)
    city = models.CharField(max_length=200)
    state = models.CharField(max_length=200)
    country = models.CharField(max_length=200)
    zipcode = models.CharField(max_length=10)

    latitude = models.FloatField();
    longitude = models.FloatField();

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class SellerLocation(models.Model):
    vendor = models.ForeignKey(Vendor)
    address = models.ForeignKey(Address)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    name = models.CharField(max_length=200)
    photo = models.ImageField(upload_to='seller-location')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class SellerProductAtLocation(models.Model):
    IN_STOCK = 'IS'
    LOW_STOCK = 'LS'
    OUT_OF_STOCK = 'OOS'
    STOCK_TYPES = (
        (IN_STOCK, 'In Stock'),
        (LOW_STOCK, 'Low Stock'),
        (OUT_OF_STOCK, 'Out of Stock'),
    )

    sellerLocation = models.ForeignKey(SellerLocation)
    product = models.ForeignKey(Product)
    is_visible = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    stock = models.CharField(max_length=3, choices=STOCK_TYPES, default=IN_STOCK)
