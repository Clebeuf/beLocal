# -*- coding: utf-8 -*-

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory, APIClient, APITestCase
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.authtoken.models import Token
from be_local_server.models import *
from be_local_server.views import *

# Create your tests here.

# Product test cases
class ProductTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.client = APIClient()
        
        # Load some data in database 
        user1 = User.objects.create_user(username='admin', email="admin@…", password='admin')
        user2 = User.objects.create_user(username='john', email="john@…", password='john')
        
        address1 = Address.objects.create(
                                          addr_line1='456 Country Road',
                                          city='Victoria',
                                          state='BC',
                                          country='Canada',
                                          zipcode='V8M3E3'
        )
        
        vendor1 = Vendor.objects.create(
                                        user=user1, 
                                        company_name="etsy",
                                        webpage="www.etsy.com",
                                        country_code="1",
                                        phone="7777777777",
                                        extension="123",
                                        description="This is a short description.",
                                        photo=None,
                                        address=address1
        )
        
        vendor2 = Vendor.objects.create(
                                        user=user2, 
                                        company_name="amazon",
                                        webpage="www.amazon.com",
                                        country_code="1",
                                        phone="7777777777",
                                        extension="123",
                                        description="This is a short description.",
                                        photo=None,
                                        address=address1,
                                        is_active=True,
        )
        
        Product.objects.create(
                               vendor=vendor1,
                               name="carrots",
                               description="test product",
                               photo=None,
                               stock="IS"
        )
        
        product = Product.objects.create(
                               vendor=vendor2,
                               name="tomato",
                               description="test product",
                               photo=None,
                               stock="IS"
        )
        
        product.tags.add("one");
        
        # Token Authentication
        token = Token.objects.create(user=user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key) 
    
    def tearDown(self):
        self.client.credentials()
    
    # product lists
    def test_list_vendor_products(self):            
        url = reverse('vendor-products-list') 
        response = self.client.get(url)
        #print "\nVendor products list: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content,"[{\"id\": 2, \"name\": \"tomato\", \"description\": \"test product\", \"vendor\": {\"id\": 2, \"company_name\": \"amazon\", \"webpage\": \"www.amazon.com\", \"country_code\": \"1\", \"phone\": \"7777777777\", \"extension\": \"123\", \"photo\": null}, \"photo\": null, \"stock\": \"IS\", \"total_likes\": 0, \"is_liked\": null, \"tags\": [\"one\"]}]") 
    
    # product details
    def test_add_product(self):  
        url = reverse('vendor-products-add')  
        data = {
                'vendor':"2",
                'name':"carrots",
                'description':"test product",
                'photo': "",
                'stock': "IS",
                'tags' : ['new','old'],
                } 
        response = self.client.post(url, data)
        #print "Add Vendor's product : \n", response
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        url = reverse('vendor-products-details', kwargs={'product_id': '3'})
        response = self.client.get(url)
        #print "Vendor's product details: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content,"{\"id\": 3, \"name\": \"carrots\", \"description\": \"test product\", \"vendor\": {\"id\": 2, \"company_name\": \"amazon\", \"webpage\": \"www.amazon.com\", \"country_code\": \"1\", \"phone\": \"7777777777\", \"extension\": \"123\", \"photo\": null}, \"photo\": null, \"stock\": \"IS\", \"total_likes\": 0, \"is_liked\": null, \"tags\": [\"new\", \"old\"]}") 
    
    def test_read_product(self):             
        url = reverse('vendor-products-details', kwargs={'product_id': '2'})
        response = self.client.get(url)
        #print "Vendor's product details: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
        self.assertEqual(response.content,"{\"id\": 2, \"name\": \"tomato\", \"description\": \"test product\", \"vendor\": {\"id\": 2, \"company_name\": \"amazon\", \"webpage\": \"www.amazon.com\", \"country_code\": \"1\", \"phone\": \"7777777777\", \"extension\": \"123\", \"photo\": null}, \"photo\": null, \"stock\": \"IS\", \"total_likes\": 0, \"is_liked\": null, \"tags\": [\"one\"]}") 
    
        # Test likes
        url = reverse('like', kwargs={'content_type':'be_local_server-product', 'id':'2'})
        response = self.client.post(url)
        url = reverse('vendor-products-details', kwargs={'product_id': '2'})
        response = self.client.get(url)
        #print "Vendor's product details: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
        self.assertEqual(response.content,"{\"id\": 2, \"name\": \"tomato\", \"description\": \"test product\", \"vendor\": {\"id\": 2, \"company_name\": \"amazon\", \"webpage\": \"www.amazon.com\", \"country_code\": \"1\", \"phone\": \"7777777777\", \"extension\": \"123\", \"photo\": null}, \"photo\": null, \"stock\": \"IS\", \"total_likes\": 1, \"is_liked\": 1, \"tags\": [\"one\"]}")   
    
    def test_edit_product(self): 
        url = reverse('vendor-products-details', kwargs={'product_id': '2'})
        data = {'stock':"OOS"}
        response = self.client.patch(url, data)
        #print "Edit Vendor's product: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)  
        
    def test_delete_product(self):
        url = reverse('vendor-products-details', kwargs={'product_id': '2'})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT) 
        
    def test_like_product(self):
        url = reverse('like', kwargs={'content_type':'be_local_server-product', 'id':'1'})
        response = self.client.post(url)
        #print "After liking a product: ", response
        self.assertEqual(response.content, '{"num_votes":1}')
         
    def test_unlike_product(self):
        url = reverse('like', kwargs={'content_type':'be_local_server-product', 'id':'1'})
        response = self.client.post(url)
        
        url = reverse('like', kwargs={'content_type':'be_local_server-product', 'id':'1'})
        response = self.client.delete(url)
        #print "After deleting like of product : ", response
        self.assertEqual(response.content, '{"num_votes":0}')
    
    def test_get_product_likes(self):
        url = reverse('like', kwargs={'content_type':'be_local_server-product', 'id':'1'})
        response = self.client.post(url)
        
        url = reverse('like', kwargs={'content_type':'be_local_server-product', 'id':'1'})
        response = self.client.get(url)
        #print "Get product like status: ", response.content
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, '{"is_liked": true}')
        
        url = reverse('like', kwargs={'content_type':'be_local_server-product', 'id':'1'})
        response = self.client.delete(url)
        url = reverse('like', kwargs={'content_type':'be_local_server-product', 'id':'1'})
        response = self.client.get(url)
        #print "Get product like status: ", response.content
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.content, '{"is_liked": false}')
        
    def test_trending_products(self):
        url = reverse('product-trending-list')
        response = self.client.post(url)
        #print "\nTrending products: ", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, "[{\"id\": 2, \"name\": \"tomato\", \"description\": \"test product\", \"vendor\": {\"id\": 2, \"company_name\": \"amazon\", \"webpage\": \"www.amazon.com\", \"country_code\": \"1\", \"phone\": \"7777777777\", \"extension\": \"123\", \"photo\": null}, \"photo\": null, \"stock\": \"IS\", \"total_likes\": 0, \"is_liked\": null, \"tags\": [\"one\"]}]")
        
        # Test likes
        url = reverse('like', kwargs={'content_type':'be_local_server-product', 'id':'2'})
        response = self.client.post(url)
        url = reverse('product-trending-list')
        response = self.client.post(url)
        #print "Trending products: ", response
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
        self.assertEqual(response.content, "[{\"id\": 2, \"name\": \"tomato\", \"description\": \"test product\", \"vendor\": {\"id\": 2, \"company_name\": \"amazon\", \"webpage\": \"www.amazon.com\", \"country_code\": \"1\", \"phone\": \"7777777777\", \"extension\": \"123\", \"photo\": null}, \"photo\": null, \"stock\": \"IS\", \"total_likes\": 1, \"is_liked\": 1, \"tags\": [\"one\"]}]")  
        
    # product details
    def test_edit_tag_product(self):                 
        url = reverse('vendor-products-details', kwargs={'product_id': '2'})  
        data = {
                'description':"product with tags",
                'tags' : ['green','dark'],
                } 
        response = self.client.patch(url, data)
        #print "Patch Vendor's product : \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, "{\"id\": 2, \"name\": \"tomato\", \"description\": \"product with tags\", \"vendor\": 2, \"photo\": null, \"stock\": \"IS\", \"tags\": [\"green\", \"dark\"]}")
        
        url = reverse('vendor-products-details', kwargs={'product_id': '2'})
        response = self.client.get(url)
        #print "Vendor's product details: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, "{\"id\": 2, \"name\": \"tomato\", \"description\": \"product with tags\", \"vendor\": {\"id\": 2, \"company_name\": \"amazon\", \"webpage\": \"www.amazon.com\", \"country_code\": \"1\", \"phone\": \"7777777777\", \"extension\": \"123\", \"photo\": null}, \"photo\": null, \"stock\": \"IS\", \"total_likes\": 0, \"is_liked\": null, \"tags\": [\"green\", \"dark\"]}")
        
    def test_product_tag_list(self):
        url = reverse('product-tag-list')
        response = self.client.get(url)
        #print "\nGet tags list: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, "[{\"id\": 1, \"name\": \"one\"}]")
    
    def test_tagged_products_list(self):
        url = reverse('tagged-products-list', kwargs={'tag_slug': 'one'})
        response = self.client.get(url)
        #print "\nGet tagged products list: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, "[{\"id\": 2, \"name\": \"tomato\", \"description\": \"test product\", \"vendor\": {\"id\": 2, \"company_name\": \"amazon\", \"webpage\": \"www.amazon.com\", \"country_code\": \"1\", \"phone\": \"7777777777\", \"extension\": \"123\", \"photo\": null}, \"photo\": null, \"stock\": \"IS\", \"total_likes\": 0, \"is_liked\": null, \"tags\": [\"one\"]}]")
        
        url = reverse('tagged-products-list', kwargs={'tag_slug': 'amen'})
        response = self.client.get(url)
        self.assertEqual(response.content, "[]")
        
# Vendor test cases
class VendorTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.client = APIClient()
        
        # Load some data in database 
        user1 = User.objects.create_user(username='admin', email="admin@…", password='admin')
        user2 = User.objects.create_user(username='john', email="john@…", password='john')
        
        address1 = Address.objects.create(
                                          addr_line1='456 Country Road',
                                          city='Victoria',
                                          state='BC',
                                          country='Canada',
                                          zipcode='V8M3E3'
        )
        
        vendor1 = Vendor.objects.create(
                                        user=user1, 
                                        company_name="etsy",
                                        webpage="www.etsy.com",
                                        country_code="1",
                                        phone="7777777777",
                                        extension="123",
                                        description="This is a short description.",
                                        photo=None,
                                        address=address1
        )
        vendor2 = Vendor.objects.create(
                                        user=user2, 
                                        company_name="amazon",
                                        webpage="www.amazon.com",
                                        country_code="1",
                                        phone="7777777777",
                                        extension="123",
                                        description="This is a short description.",
                                        photo=None,
                                        address=address1,
                                        is_active=True,
        )
        
        Product.objects.create(
                               vendor=vendor1,
                               name="carrots",
                               description="test product",
                               photo=None,
                               stock="IS"
        )
        Product.objects.create(
                               vendor=vendor2,
                               name="tomato",
                               description="test product",
                               photo=None,
                               stock="IS"
        )
        
        # Token Authentication
        token = Token.objects.create(user=user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key) 
    
    def tearDown(self):
        self.client.credentials()
    
    # vendor lists
    def test_list_vendors(self):            
        url = reverse('vendors-list') 
        response = self.client.get(url)
        #print "\nVendors list: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, "[{\"id\": 2, \"company_name\": \"amazon\", \"webpage\": \"www.amazon.com\", \"country_code\": \"1\", \"phone\": \"7777777777\", \"extension\": \"123\", \"products\": [{\"id\": 2, \"name\": \"tomato\", \"description\": \"test product\", \"vendor\": 2, \"photo\": null, \"stock\": \"IS\", \"tags\": []}], \"address\": 1, \"total_likes\": 0, \"is_liked\": null}]")
    
    # read vendor    
    def test_read_vendor(self):             
        url = reverse('vendor')
        response = self.client.get(url)
        #print "Vendor details: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
        
    # vendor details    
    def test_vendor_details(self):             
        url = reverse('vendor-details')
        data = {'id': 2}
        response = self.client.post(url, data)
        #print "Vendor details: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        #inactive vendor
        url = reverse('vendor-details')
        data = {'id': 1}
        response = self.client.post(url, data)
        #print "Vendor details: \n", response
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
         
    def test_like_vendor(self):
        url = reverse('like', kwargs={'content_type':'be_local_server-vendor', 'id':'2'})
        response = self.client.post(url)
        #print "After liking a vendor: ", response
        self.assertEqual(response.content, '{"num_votes":1}')
         
    def test_unlike_vendor(self):
        url = reverse('like', kwargs={'content_type':'be_local_server-vendor', 'id':'2'})
        response = self.client.post(url)
        
        url = reverse('like', kwargs={'content_type':'be_local_server-vendor', 'id':'2'})
        response = self.client.delete(url)
        #print "After unliking vendor: ", response
        self.assertEqual(response.content, '{"num_votes":0}')
    
    def test_get_vendor_like(self):
        url = reverse('like', kwargs={'content_type':'be_local_server-vendor', 'id':'2'})
        response = self.client.post(url)
        
        url = reverse('like', kwargs={'content_type':'be_local_server-vendor', 'id':'2'})
        response = self.client.get(url)
        #print "Get vendor like status: ", response.content
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, '{"is_liked": true}')
        
        url = reverse('like', kwargs={'content_type':'be_local_server-vendor', 'id':'2'})
        response = self.client.delete(url)
        url = reverse('like', kwargs={'content_type':'be_local_server-vendor', 'id':'2'})
        response = self.client.get(url)
        #print "Get vendor like status: ", response.content
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.content, '{"is_liked": false}')         
 
 # Market test cases
class MarketTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.client = APIClient()
        
        # Load some data in database 
        user1 = User.objects.create_user(username='admin', email="admin@…", password='admin')
        user2 = User.objects.create_user(username='john', email="john@…", password='john')
        address1 = Address.objects.create(
                                          addr_line1='456 Country Road',
                                          city='Victoria',
                                          state='BC',
                                          country='Canada',
                                          zipcode='V8M3E3'
        )
        
        vendor1 = Vendor.objects.create(
                                        user=user1, 
                                        company_name="etsy",
                                        webpage="www.etsy.com",
                                        country_code="1",
                                        phone="7777777777",
                                        extension="123",
                                        description="This is a short description.",
                                        photo=None,
                                        address=address1
        )
        vendor2 = Vendor.objects.create(
                                        user=user2, 
                                        company_name="amazon",
                                        webpage="www.amazon.com",
                                        country_code="1",
                                        phone="7777777777",
                                        extension="123",
                                        description="This is a short description.",
                                        photo=None,
                                        address=address1,
                                        is_active=True,
        )
        
        Product.objects.create(
                               vendor=vendor2,
                               name="carrots",
                               description="test product",
                               photo=None,
                               stock="IS"
        )
        
        market1 = Market.objects.create(
                              name="Hudson Market",
                              address=address1,
                              description="Open only in summer!",
                              
        )
        Market.objects.create(
                              name="Fairway Market",
                              address=address1,
                              description="Open in all seasons!",
                              
        )
        
        market1.vendors.add(vendor1, vendor2)      
        
        # Token Authentication
        token = Token.objects.create(user=user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key) 
    
    def tearDown(self):
        self.client.credentials()
    
    # market lists
    def test_list_markets(self):            
        url = reverse('market-list') 
        response = self.client.get(url)
        print "\nMarkets list: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
         
    def test_like_market(self):
        url = reverse('like', kwargs={'content_type':'be_local_server-market', 'id':'1'})
        response = self.client.post(url)
        #print "After liking a market: ", response
        self.assertEqual(response.content, '{"num_votes":1}')
         
    def test_unlike_market(self):
        url = reverse('like', kwargs={'content_type':'be_local_server-market', 'id':'1'})
        response = self.client.post(url)
        
        url = reverse('like', kwargs={'content_type':'be_local_server-market', 'id':'1'})
        response = self.client.delete(url)
        #print "After unliking market: ", response
        self.assertEqual(response.content, '{"num_votes":0}')
    
    def test_get_market_like(self):
        url = reverse('like', kwargs={'content_type':'be_local_server-market', 'id':'1'})
        response = self.client.post(url)
        
        url = reverse('like', kwargs={'content_type':'be_local_server-market', 'id':'1'})
        response = self.client.get(url)
        #print "Get market like status: ", response.content
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, '{"is_liked": true}')
        
        url = reverse('like', kwargs={'content_type':'be_local_server-market', 'id':'1'})
        response = self.client.delete(url)
        url = reverse('like', kwargs={'content_type':'be_local_server-market', 'id':'1'})
        response = self.client.get(url)
        #print "Get market like status: ", response.content
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.content, '{"is_liked": false}')   
