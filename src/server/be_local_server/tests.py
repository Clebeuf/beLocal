# -*- coding: utf-8 -*-

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory, APIClient, APITestCase
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.authtoken.models import Token
from be_local_server.models import *
from be_local_server.views import *
import StringIO, json

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
        
        category1 = Category.objects.create(
                                           name="new vendor",
                                           slug="new-vendor")
        category2 = Category.objects.create(
                                           name="old vendor",
                                           slug="old-vendor")
        
        product1 = Product.objects.create(
                               vendor=vendor1,
                               name="carrots",
                               description="test product",
                               photo=None,
                               stock="IS",
                               category=category1
        )
        
        product2 = Product.objects.create(
                               vendor=vendor2,
                               name="tomato",
                               description="test product",
                               photo=None,
                               stock="IS",
                               category=category1
        )
        
        product1.tags.add("one");
        product2.tags.add("one");
        product2.tags.add("two");
        
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
        self.assertEqual(response.content,'[{"id": 2, "name": "tomato", "description": "test product", "vendor": {"id": 2, "company_name": "amazon", "webpage": "www.amazon.com", "country_code": "1", "phone": "7777777777", "extension": "123", "photo": null}, "photo": null, "stock": "IS", "total_likes": 0, "is_liked": null, "tags": ["one", "two"], "category": {"id": 1, "name": "new vendor", "slug": "new-vendor"}}]') 
    
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
                'category' : 1,
                } 
        response = self.client.post(url, data)
        #print "Add Vendor's product : \n", response
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        url = reverse('vendor-products-details', kwargs={'product_id': '3'})
        response = self.client.get(url)
        #print "Vendor's product details: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        #self.assertEqual(response.content,'{"id": 3, "name": "carrots", "description": "test product", "vendor": {"id": 2, "company_name": "amazon", "webpage": "www.amazon.com", "country_code": "1", "phone": "7777777777", "extension": "123", "photo": null}, "photo": null, "stock": "IS", "total_likes": 0, "is_liked": null, "tags": ["new", "old"], "category": {"id": 1, "name": "new vendor", "slug": "new-vendor"}}') 
    
    def test_read_product(self):             
        url = reverse('vendor-products-details', kwargs={'product_id': '2'})
        response = self.client.get(url)
        #print "Vendor's product details: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
        self.assertEqual(response.content,'{"id": 2, "name": "tomato", "description": "test product", "vendor": {"id": 2, "company_name": "amazon", "webpage": "www.amazon.com", "country_code": "1", "phone": "7777777777", "extension": "123", "photo": null}, "photo": null, "stock": "IS", "total_likes": 0, "is_liked": null, "tags": ["one", "two"], "category": {"id": 1, "name": "new vendor", "slug": "new-vendor"}}') 
    
        # Test likes
        url = reverse('like', kwargs={'content_type':'be_local_server-product', 'id':'2'})
        response = self.client.post(url)
        url = reverse('vendor-products-details', kwargs={'product_id': '2'})
        response = self.client.get(url)
        #print "Vendor's product details: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
        self.assertEqual(response.content,'{"id": 2, "name": "tomato", "description": "test product", "vendor": {"id": 2, "company_name": "amazon", "webpage": "www.amazon.com", "country_code": "1", "phone": "7777777777", "extension": "123", "photo": null}, "photo": null, "stock": "IS", "total_likes": 1, "is_liked": 1, "tags": ["one", "two"], "category": {"id": 1, "name": "new vendor", "slug": "new-vendor"}}')   
    
    def test_edit_product(self): 
        url = reverse('vendor-products-details', kwargs={'product_id': '2'})
        data = {'description': "changed it",
                'category': 2}
        response = self.client.patch(url, data)
        #print "Edit Vendor's product: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)  
        self.assertEqual(response.content, '{"id": 2, "name": "tomato", "description": "changed it", "vendor": 2, "photo": null, "stock": "IS", "tags": ["one", "two"], "category": 2}')
        
    def test_delete_product(self):
        url = reverse('vendor-products-details', kwargs={'product_id': '2'})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT) 
    
    # product photo
    def test_add_photo(self):
        url = reverse('vendor-products-photo-add')       
        imgfile = StringIO.StringIO('GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
        imgfile.name = 'test_img_file.gif'
        data = {'image': imgfile}
        
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['id'], 1)
        self.assertTrue(response.data.has_key('image'))
         
    def test_change_product_photo(self):
        # create dummy image and upload image      
        imgfile = StringIO.StringIO('GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
        imgfile.name = 'test_img_file.gif'
        data = {'image': imgfile} 
        url = reverse('vendor-products-photo-add')       
        photo_response = self.client.post(url, data, format='multipart')
        self.assertEqual(photo_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(photo_response.data['id'], 1)    
        
        # add image to product
        url =  reverse('vendor-products-details', kwargs={'product_id': '2'})
        data = {'photo': photo_response.data['id']}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)  
        #print "updated product: ", response.content
        self.assertEqual(response.content, '{"id": 2, "name": "tomato", "description": "test product", "vendor": 2, "photo": 1, "stock": "IS", "tags": ["one", "two"], "category": 1}')
        
        # upload new image 
        new_imgfile = StringIO.StringIO('GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
        new_imgfile.name = 'new_img_file.gif'
        data = {'image': new_imgfile} 
        url = reverse('vendor-products-photo-add')       
        new_photo_response = self.client.post(url, data, format='multipart')
        self.assertEqual(new_photo_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(new_photo_response.data['id'], 2)  
        
        # change image of the product
        url =  reverse('vendor-products-details', kwargs={'product_id': '2'})
        data = {'photo': new_photo_response.data['id']}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)  
        #print "updated product: ", response.content
        self.assertEqual(response.content, '{"id": 2, "name": "tomato", "description": "test product", "vendor": 2, "photo": 2, "stock": "IS", "tags": ["one", "two"], "category": 1}')       
      
    def test_like_product(self):
        url = reverse('like', kwargs={'content_type':'be_local_server-product', 'id':'2'})
        response = self.client.post(url)
        #print "After liking a product: ", response
        self.assertEqual(response.content, '{"num_votes":1}')
        
        url = reverse('vendor-products-list') 
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content,'[{"id": 2, "name": "tomato", "description": "test product", "vendor": {"id": 2, "company_name": "amazon", "webpage": "www.amazon.com", "country_code": "1", "phone": "7777777777", "extension": "123", "photo": null}, "photo": null, "stock": "IS", "total_likes": 1, "is_liked": 1, "tags": ["one", "two"], "category": {"id": 1, "name": "new vendor", "slug": "new-vendor"}}]') 
         
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
        self.assertEqual(response.content, '[{"id": 2, "name": "tomato", "description": "test product", "vendor": {"id": 2, "company_name": "amazon", "webpage": "www.amazon.com", "country_code": "1", "phone": "7777777777", "extension": "123", "photo": null}, "photo": null, "stock": "IS", "total_likes": 0, "is_liked": null, "tags": ["one", "two"], "category": {"id": 1, "name": "new vendor", "slug": "new-vendor"}}]')
        
        # Test likes
        url = reverse('like', kwargs={'content_type':'be_local_server-product', 'id':'2'})
        response = self.client.post(url)
        url = reverse('product-trending-list')
        response = self.client.post(url)
        #print "Trending products: ", response
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
        self.assertEqual(response.content, '[{"id": 2, "name": "tomato", "description": "test product", "vendor": {"id": 2, "company_name": "amazon", "webpage": "www.amazon.com", "country_code": "1", "phone": "7777777777", "extension": "123", "photo": null}, "photo": null, "stock": "IS", "total_likes": 1, "is_liked": 1, "tags": ["one", "two"], "category": {"id": 1, "name": "new vendor", "slug": "new-vendor"}}]')  
        
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
        self.assertEqual(response.content, '{"id": 2, "name": "tomato", "description": "product with tags", "vendor": 2, "photo": null, "stock": "IS", "tags": ["green", "dark"], "category": 1}')
        
        url = reverse('vendor-products-details', kwargs={'product_id': '2'})
        response = self.client.get(url)
        #print "Vendor's product details: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, '{"id": 2, "name": "tomato", "description": "product with tags", "vendor": {"id": 2, "company_name": "amazon", "webpage": "www.amazon.com", "country_code": "1", "phone": "7777777777", "extension": "123", "photo": null}, "photo": null, "stock": "IS", "total_likes": 0, "is_liked": null, "tags": ["green", "dark"], "category": {"id": 1, "name": "new vendor", "slug": "new-vendor"}}')
        
    def test_product_tag_list(self):
        url = reverse('tag-list')
        response = self.client.get(url)
        #print "\nGet tags list: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, '[{"id": 1, "name": "one", "slug": "one"}, {"id": 2, "name": "two", "slug": "two"}]')
    
    def test_tagged_products_list(self):
        url = reverse('tagged-products-list', kwargs={'tag_slug': 'one'})
        response = self.client.get(url)
        #print "\nGet tagged products list: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, '[{"id": 2, "name": "tomato", "description": "test product", "vendor": {"id": 2, "company_name": "amazon", "webpage": "www.amazon.com", "country_code": "1", "phone": "7777777777", "extension": "123", "photo": null}, "photo": null, "stock": "IS", "total_likes": 0, "is_liked": null, "tags": ["one", "two"], "category": {"id": 1, "name": "new vendor", "slug": "new-vendor"}}]')
        
        url = reverse('tagged-products-list', kwargs={'tag_slug': 'amen'})
        response = self.client.get(url)
        self.assertEqual(response.content, "[]")
    
    def test_product_category_list(self):
        url = reverse('category-list')
        response = self.client.get(url)
        #print "\nGet tags list: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, '[{"id": 1, "name": "new vendor", "slug": "new-vendor"}, {"id": 2, "name": "old vendor", "slug": "old-vendor"}]')
    
    def test_categorized_products_list(self):
        url = reverse('categorized-products-list', kwargs={'category_slug': 'new-vendor'})
        response = self.client.get(url)
        #print "\nGet tagged products list: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, '[{"id": 2, "name": "tomato", "description": "test product", "vendor": {"id": 2, "company_name": "amazon", "webpage": "www.amazon.com", "country_code": "1", "phone": "7777777777", "extension": "123", "photo": null}, "photo": null, "stock": "IS", "total_likes": 0, "is_liked": null, "tags": ["one", "two"], "category": {"id": 1, "name": "new vendor", "slug": "new-vendor"}}]')
        
        url = reverse('categorized-products-list', kwargs={'category_slug': 'amen'})
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
    
    # vendor photo
    def test_add_photo(self):
        url = reverse('vendor-photo-add')       
        imgfile = StringIO.StringIO('GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
        imgfile.name = 'test_img_file.gif'
        data = {'image': imgfile}
        
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['id'], 1)
        self.assertTrue(response.data.has_key('image'))
         
    def test_change_vendor_photo(self):
        # create dummy image and upload image      
        imgfile = StringIO.StringIO('GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
        imgfile.name = 'test_img_file.gif'
        data = {'image': imgfile} 
        url = reverse('vendor-photo-add')       
        photo_response = self.client.post(url, data, format='multipart')
        self.assertEqual(photo_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(photo_response.data['id'], 1)    
        
        # add image to product
        url =  reverse('vendor')
        data = {'id': 2, 'photo': photo_response.data['id']}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)  
        print "updated vendor: ", response.content
        self.assertEqual(response.data['photo']['id'], 1)
        
        # upload new image 
        new_imgfile = StringIO.StringIO('GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
        new_imgfile.name = 'new_img_file.gif'
        data = {'image': new_imgfile} 
        url = reverse('vendor-photo-add')       
        new_photo_response = self.client.post(url, data, format='multipart')
        self.assertEqual(new_photo_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(new_photo_response.data['id'], 2)  
        
        # change image of the product
        url =  reverse('vendor')
        data = {'id': 2, 'photo': new_photo_response.data['id']}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)  
        print "updated vendor: ", response.content
        self.assertEqual(response.data['photo']['id'], 2)   
 
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
        #print "\nMarkets list: \n", response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        #self.assertEqual(response.data, '[{"id": 1, "vendors": [{"id": 1, "company_name": "etsy", "webpage": "www.etsy.com", "country_code": "1", "phone": "7777777777", "extension": "123", "photo": null}, {"id": 2, "company_name": "amazon", "webpage": "www.amazon.com", "country_code": "1", "phone": "7777777777", "extension": "123", "photo": null}], "address": {"id": 1, "addr_line1": "456 Country Road", "city": "Victoria", "zipcode": "V8M3E3", "state": "BC", "country": "Canada", "latitude": null, "longitude": null, "hours": []}, "name": "Hudson Market", "description": "Open only in summer!", "total_likes": 0, "is_liked": null, "photo": null, "webpage": null}, {"id": 2, "vendors": [], "address": {"id": 1, "addr_line1": "456 Country Road", "city": "Victoria", "zipcode": "V8M3E3", "state": "BC", "country": "Canada", "latitude": null, "longitude": null, "hours": []}, "name": "Fairway Market", "description": "Open in all seasons!", "total_likes": 0, "is_liked": null, "photo": null, "webpage": null}]') 
         
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
