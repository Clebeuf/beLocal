from celery.task.schedules import crontab  
from celery.decorators import periodic_task
from celery.utils.log import get_task_logger
from django.db.models import Q
from be_local_server.models import *
from datetime import datetime, timedelta

logger = get_task_logger(__name__)

  
# this will run every Saturday  
@periodic_task(run_every=crontab(day_of_week="*", hour=0, minute=0))  
def empty_trashcans(*args):  
    
    logger.info("Job has started to empty Trashcans.")
    given_date = datetime.now() - timedelta(hours=1) 
    
    # Product trashes
    count = Product.trash.count()
    logger.info("Total products in Trashcan: %d", count) 
      
    # Retrieve trashed products that are older than given_date 
    products = Product.trash.filter(trashed_at__lte=given_date)    
    logger.info("Total products to be deleted: %d", products.count())
    
    # Delete dangling products and product photos
    photo_count = 0
    for product in products:
        try:
            product_photo = product.photo
        except ValueError:
            product_photo = None
            
        product.delete()
        
        #check if there are other references pointing to the photo
        if product_photo is not None:
            try:
                photo_ref = Product.objects.get(Q(photo=product_photo.id), 
                                                 (Q(trashed_at__isnull=True) |
                                                  Q(trashed_at__gt=given_date)
                                                ))
            except Product.DoesNotExist:
                product_photo.delete()
                photo_count += 1     
                          
    logger.info("Total photos deleted: %d", photo_count)
    
    # SellerLocations trashes
    count = SellerLocation.trash.count()
    logger.info("Total SellerLocations in Trashcan: %d", count) 
      
    # Delete trashed items that are older than given_date  
    seller_locations = SellerLocation.trash.filter(trashed_at__lte=given_date)    
    logger.info("Total SellerLocations to be deleted: %d", seller_locations.count())
    
    # Delete sellerLocations and address
    address_count = 0
    for location in seller_locations:
        try:
            seller_address = location.addresss
        except ValueError:
            seller_address = None
       
        location.delete()
        
        # Check if there other references pointing to address
        if seller_address is not None:
            try: 
                address_ref = SellerLocation.objects.get(Q(address=seller_address.id), 
                                                          (Q(trashed_at__isnull=True) |
                                                           Q(trashed_at__gt=given_date)
                                                         ))
            except SellerLocation.DoesNotExist:
                seller_address.delete()
                address_count += 1
            
    logger.info("Total address deleted: %d", address_count)
    
# this will run every Saturday
@periodic_task(run_every=crontab(day_of_week="*", hour=0, minute=0))  
def delete_expired_seller_locations(*args): 

    logger.info("Job has started to remove expired SellerLocations.")
    given_date = datetime.now() - timedelta(hours=1) 
    
    # Expired Seller Locations
    seller_locations = SellerLocation.objects.filter(date__lte=given_date, trashed_at__isnull=True)
    logger.info("Total expired seller locations: %d", seller_locations.count())  
    
    # Delete dangling address to
    address_count = 0
    for location in seller_locations:
        try:
            seller_address = location.address
        except ValueError:
            seller_address = None
             
        location.delete()
        
        # Check if there other references pointing to address
        if seller_address is not None:
            try:
                address_ref = SellerLocation.objects.get(Q(address=seller_address.id), 
                                                          (Q(trashed_at__isnull=True) |
                                                           Q(trashed_at__gt=given_date)
                                                         ))
            except SellerLocation.DoesNotExist:
                seller_address.delete()  
                address_count += 1
                
    logger.info("Total address deleted: %d", address_count)

# this will run every Saturday
@periodic_task(run_every=crontab(day_of_week="*", hour=0, minute=0))  
def delete_unused_photos(*args):    

    logger.info("Job has started to remove unreferenced photos.")
    
    logger.info("Removing photos from products")
    photos = ProductPhoto.objects.all()    
    delete_count = 0
    for photo in photos:
        if photo.product_set.count() == 0:
            photo.delete()
            delete_count += 1
    logger.info("Total Product photos deleted: %d", delete_count)
            
    logger.info("Removing photos from vendor.")
    photos = VendorPhoto.objects.all()  
    delete_count = 0 
    for photo in photos:
        if photo.product_set.count() == 0:
            photo.delete()
            delete_count += 1
    logger.info("Total Vendor photos deleted: %d", delete_count)
            
    logger.info("Removing photos from markets.")
    photos = MarketPhoto.objects.all()  
    delete_count = 0  
    for photo in photos:
        if photo.product_set.count() == 0:
            photo.delete()
            delete_count += 1
    logger.info("Total Market photos deleted: %d", delete_count)
 
