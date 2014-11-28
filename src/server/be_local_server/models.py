from django.db import models
from django.db.models.signals import post_delete
from django.dispatch.dispatcher import receiver
from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
from undelete.models import TrashableMixin
from taggit.managers import TaggableManager
from taggit.models import GenericTaggedItemBase, TagBase
import secretballot
from PIL import Image, ImageOps

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
    company_name = models.CharField(max_length=200, null=True, blank=True)
    webpage = models.CharField(max_length=400, null=True, blank=True)
    country_code = models.CharField(max_length=50, null=True, blank=True)
    phone = models.CharField(max_length=25, null=True, blank=True)
    extension = models.CharField(max_length=25, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    photo = models.ForeignKey(VendorPhoto, blank=True, null=True, on_delete=models.SET_NULL)
    address = models.ForeignKey(Address, null=True, blank=True)
    description = models.CharField(max_length=900)
    is_active = models.BooleanField(default=False)
    facebook_url = models.CharField(max_length=400, null=True, blank=True)   
    twitter_url = models.CharField(max_length=400, null=True, blank=True)
    preferred_email = models.CharField(max_length=400, null=True, blank=True)

secretballot.enable_voting_on(Vendor)

class Category(models.Model):
    name = models.CharField(max_length=100, db_index=True)
    slug = models.SlugField(max_length=100, db_index=True)

    def __unicode__(self):
        return '%s' % self.name
  
class ProductPhoto(models.Model):
    image = models.ImageField(storage = fs, upload_to='products', blank=True)

    def save(self, force_insert=True, force_update=False, using=None):
        super(ProductPhoto, self).save() 

        path = str(self.image.path)
        img = Image.open(path)
        img.thumbnail((600, 400), Image.ANTIALIAS)
        img.save(path)

    
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
    photo = models.ForeignKey(ProductPhoto, blank=True, null=True, on_delete=models.SET_NULL)
    tags = TaggableManager(blank=True)
    category = models.ForeignKey(Category, blank=True, null=True)
    
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
    description = models.CharField(max_length=800)

class MarketPhoto(models.Model):
    image = models.ImageField(storage = fs, upload_to='markets', blank=True)
    
    def get_image_abs_path(self):
        return os.path.join(settings.MEDIA_URL, self.image.name)        
    image_url = property(get_image_abs_path)    

class Market(models.Model):
    photo = models.ForeignKey(MarketPhoto, blank=True, null=True, on_delete=models.SET_NULL)    
    name = models.CharField(max_length=100)
    address = models.ForeignKey(Address)
    description = models.CharField(max_length=400)
    vendors = models.ManyToManyField(Vendor, related_name='vendors', blank=True)
    webpage = models.CharField(max_length=400, null=True, blank=True)
    facebook_url = models.CharField(max_length=400, null=True, blank=True)   
    twitter_url = models.CharField(max_length=400, null=True, blank=True)
    
secretballot.enable_voting_on(Market)

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

# Auto-delete image files when not needed
@receiver(models.signals.post_delete)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """Deletes image file from filesystem
    when corresponding `MediaFile` object is deleted.
    """
    if sender not in [ProductPhoto, VendorPhoto, MarketPhoto]:
        return
    
    if instance.image:
        if os.path.isfile(instance.image.path):
            print "removing image file"
            os.remove(instance.image.path)

@receiver(models.signals.pre_save)
def auto_delete_file_on_change(sender, instance,**kwargs):
    """Deletes photo from table    
    when corresponding `Product/Vendor/Market` object is changed.    
    """
    if sender not in [Product, Vendor, Market]:
        return
    
    if not instance.pk:
        return False
    
    try:        
        old_photo = sender.objects.get(pk=instance.pk).photo    
    except sender.DoesNotExist:
        return False    
    
    if old_photo is not None:
        new_photo = instance.photo    
        if not old_photo.pk == new_photo.pk:
            print "deleting photo too."
            old_photo.delete()