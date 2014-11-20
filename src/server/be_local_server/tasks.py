from celery.task.schedules import crontab  
from celery.decorators import periodic_task
from be_local_server.models import *
import datetime
  
# this will run every Saturday  
@periodic_task(run_every=crontab(day_of_week="6"))  
def empty_trashcans(*args):  
    
    print "Job has started to empty Trashcans."
    given_date = datetime.now() - datetime.timedelta(weeks=1) 
    
    # Product trashes
    count = Product.trash.count()
    print "Total products in Trashcan: ", count    
    # Delete trashed items that are older than given_date 
    old_products = Product.trash.filter(tashed_at__lte=given_date)    
    print "Count of products to be deleted: ", old_products.Count()
    old_products.delete()
    
    # SellerLocations trashes
    count = SellerLocation.trash.count()
    print "Total SellerLocations in Trashcan: ", count   
    # Delete trashed items that are older than given_date  
    old_sellerLocations = SellerLocation.trash.filter(tashed_at__lte=given_date)    
    print "Count of SellerLocations to be deleted: ", old_sellerLocations.Count()
    old_sellerLocations.delete()
    
# this will run every Saturday
@periodic_task(run_every=crontab(day_of_week="6"))  
def delete_expired_seller_locations(*args): 

    print "Job has started to remove expired SellerLocations."
    given_date = datetime.now() - datetime.timedelta(weeks=1) 
    
    # Expired Seller Locations
    expired_locations = SellerLocation.filter(date__lte=given_date)
    print "Total expired seller locations: ", expired_locations.Count()    
    expired_locations.delete()
    
    
    
 
