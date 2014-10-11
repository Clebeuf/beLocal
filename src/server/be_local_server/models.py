from django.db import models
from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
from undelete.models import TrashableMixin

fs = FileSystemStorage(location=settings.MEDIA_ROOT)

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

    latitude = models.FloatField(null=True);
    longitude = models.FloatField(null=True);

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Vendor(models.Model):
    user = models.ForeignKey(User) 
    company_name = models.CharField(max_length=200)
    webpage = models.CharField(max_length=400)
    country_code = models.CharField(max_length=50)
    phone = models.CharField(max_length=25)
    extension = models.CharField(max_length=25)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    photo = models.ImageField(upload_to='vendor', null=True)
    address = models.ForeignKey(Address)

class ProductPhoto(models.Model):
    image = models.ImageField(storage = fs, upload_to='products', blank=True)
    
    def get_image_abs_path(self):
        return os.path.join(settings.MEDIA_URL, self.image.name)        
    image_url = property(get_image_abs_path)
    
class Product(TrashableMixin, models.Model):
    IN_STOCK = 'IS'
    LOW_STOCK = 'LS'
    OUT_OF_STOCK = 'OOS'
    STOCK_TYPES = (
        (IN_STOCK, 'In Stock'),
        (LOW_STOCK, 'Low Stock'),
        (OUT_OF_STOCK, 'Out of Stock'),
    )

    stock = models.CharField(max_length=3, choices=STOCK_TYPES, default=IN_STOCK)

    name = models.CharField(max_length=200)
    description = models.CharField(max_length=400)
    price = models.FloatField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    vendor = models.ForeignKey(Vendor)
    photo = models.ForeignKey(ProductPhoto, blank=True, null=True)
    #tag = models.ManyToManyField(Tag)

class Tag(models.Model):
    name = models.CharField(max_length=100)

class ProductTag(models.Model):
    product = models.ManyToManyField(Product)
    tag = models.ForeignKey(Tag)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class SellerLocation(TrashableMixin, models.Model):
    vendor = models.ForeignKey(Vendor)
    address = models.ForeignKey(Address)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    email = models.CharField(max_length=50)
    phone = models.CharField(max_length=25)
    description = models.CharField(max_length=400)    
