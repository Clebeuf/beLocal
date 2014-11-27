from celery.task.schedules import crontab  
from celery.decorators import periodic_task
from celery.utils.log import get_task_logger
from django.db.models import Q
from be_local_server.models import *
from datetime import datetime, timedelta

logger = get_task_logger(__name__)

  
# this will run every Saturday  
@periodic_task(run_every=crontab(day_of_week="6"))  
def empty_trashcans(*args):  
    
    logger.info("Job has started to empty Trashcans.")
    given_date = datetime.now() - timedelta(weeks=1) 
    
    # Product trashes
    count = Product.trash.count()
    logger.info("Total products in Trashcan: %d", count)   
    # Delete trashed items that are older than given_date 
    products = Product.trash.filter(tashed_at__lte=given_date)    
    logger.info("Count of products to be deleted: %d", products.Count())
    
    # Delete dangling photos too
    for product in products:
        photo_id = product.photo
        product.delete()
        
        #check if there are other references pointing to the photo
        if photo_id is not None:
            photo_ref = Product.objects.get(Q(photo=photo_id), 
                                             (Q(trashed_at__isnull=True) |
                                              Q(trashed_at__gt=given_date)
                                            ))
    
    # SellerLocations trashes
    count = SellerLocation.trash.count()
    logger.info("Total SellerLocations in Trashcan: %d", count)   
    # Delete trashed items that are older than given_date  
    seller_locations = SellerLocation.trash.filter(tashed_at__lte=given_date)    
    logger.info("Count of SellerLocations to be deleted: %d", seller_locations.Count())
    
    # Delete dangling address too
    for location in seller_locations:
        address_id = location.addresss
        location.delete()
        
        # Check if there other references pointing to address
        address_ref = SellerLocation.objects.get(Q(address=address_id), 
                                                  (Q(trashed_at__isnull=True) |
                                                   Q(trashed_at__gt=given_date)
                                                 ))
        if address_ref is None:
            address.delete()
    
# this will run every Saturday
@periodic_task(run_every=crontab(day_of_week="6"))  
def delete_expired_seller_locations(*args): 

    logger.info("Job has started to remove expired SellerLocations.")
    given_date = datetime.now() - timedelta(weeks=1) 
    
    # Expired Seller Locations
    seller_locations = SellerLocation.filter(date__lte=given_date, trashed_at__isnull=True)
    logger.info("Total expired seller locations: %d", seller_locations.Count())  
    
    # Delete dangling address to
    for location in seller_locations:
        address_id = location.address 
        location.delete()
        
        # Check if there other references pointing to address
        address_ref = SellerLocation.objects.get(Q(address=address_id), 
                                                  (Q(trashed_at__isnull=True) |
                                                   Q(trashed_at__gt=given_date)
                                                 ))
        if address_ref is None:
            address.delete()  

# this will run every Saturday
@periodic_task(run_every=crontab(day_of_week="6"))  
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
 
