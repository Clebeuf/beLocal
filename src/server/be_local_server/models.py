from django.db import models
from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
from undelete.models import TrashableMixin
from taggit.managers import TaggableManager
import secretballot

fs = FileSystemStorage(location=settings.MEDIA_ROOT)

WEEKDAYS = [
  (1, ("Monday")),
  (2, ("Tuesday")),
  (3, ("Wednesday")),
  (4, ("Thursday")),
  (5, ("Friday")),
  (6, ("Saturday")),
  (7, ("Sunday")),
  (8, ("One Time Event")),
]

class VendorPhoto(models.Model):
    image = models.ImageField(storage = fs, upload_to='vendors', blank=True)
    
    def get_image_abs_path(self):
        return os.path.join(settings.MEDIA_URL, self.image.name)        
    image_url = property(get_image_abs_path)

class Address(models.Model):
    addr_line1 = models.CharField(max_length=400)
    city = models.CharField(max_length=200)
    state = models.CharField(max_length=200)
    country = models.CharField(max_length=200)
    zipcode = models.CharField(max_length=10)

    latitude = models.FloatField(null=True, blank=True);
    longitude = models.FloatField(null=True, blank=True);

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
    photo = models.ForeignKey(VendorPhoto, blank=True, null=True)
    address = models.ForeignKey(Address)
    description = models.CharField(max_length=800)


class ProductPhoto(models.Model):
    image = models.ImageField(storage = fs, upload_to='products', blank=True)
    
    def get_image_abs_path(self):
        return os.path.join(settings.MEDIA_URL, self.image.name)        
    image_url = property(get_image_abs_path)   
    
class Product(TrashableMixin, models.Model):
    IN_STOCK = 'IS'
    OUT_OF_STOCK = 'OOS'
    STOCK_TYPES = (
        (IN_STOCK, 'In Stock'),
        (OUT_OF_STOCK, 'Out of Stock'),
    )

    stock = models.CharField(max_length=3, choices=STOCK_TYPES, default=IN_STOCK)

    name = models.CharField(max_length=200)
    description = models.CharField(max_length=400)
    price = models.FloatField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    vendor = models.ForeignKey(Vendor, related_name='products')
    photo = models.ForeignKey(ProductPhoto, blank=True, null=True)
    tags = TaggableManager()
    
secretballot.enable_voting_on(Product)

class SellerLocation(TrashableMixin, models.Model):
    vendor = models.ForeignKey(Vendor)
    address = models.ForeignKey(Address)
    date = models.DateField(null=True, blank=True)
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    email = models.CharField(max_length=50)
    phone = models.CharField(max_length=25)
    description = models.CharField(max_length=400)

class Market(models.Model):
    name = models.CharField(max_length=100)
    address = models.ForeignKey(Address)
    description = models.CharField(max_length=400)
    vendors = models.ManyToManyField(Vendor)

class OpeningHours(models.Model):
    address = models.ForeignKey(Address, related_name="hours", null=True)
    weekday = models.IntegerField(
        choices=WEEKDAYS
    )
    from_hour = models.TimeField()
    to_hour = models.TimeField()
    unique_together=(weekday, address)

    def get_day_display(self):
        for day in WEEKDAYS:
            if day[0] == self.weekday:
                return day[1]    

