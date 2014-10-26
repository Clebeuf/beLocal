# -*- coding: utf-8 -*-

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory, APIClient, APITestCase
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.authtoken.models import Token
from be_local_server.models import Vendor, Product, Address
from be_local_server.views import *

# Create your tests here.

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
                                        address=address1
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
    
    # product lists
    def test_list_vendor_products(self):            
        url = reverse('vendor-products-list') 
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
    
    # product details
    def test_add_product(self):  
        url = reverse('vendor-products-add')  
        data = {
                'vendor':"2",
                'name':"carrots",
                'description':"test product",
                'photo': "",
                'stock': "IS",
                } 
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    def test_read_product(self):             
        url = reverse('vendor-products-details', kwargs={'product_id': '2'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)   
    
    def test_edit_product(self): 
        url = reverse('vendor-products-details', kwargs={'product_id': '2'})
        data = {'stock':"OOS"}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)  
        
    def test_delete_product(self):
        url = reverse('vendor-products-details', kwargs={'product_id': '2'})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)  
        
    def test_add_like(self):
        url = reverse('like', kwargs={'content_type':'be_local_server-product', 'id':'1'})
        response = self.client.post(url)
        #print "After adding like: ", response
        self.assertEqual(response.content, "{'num_votes':1}")
         
    def test_delete_like(self):
        url = reverse('like', kwargs={'content_type':'be_local_server-product', 'id':'1'})
        response = self.client.delete(url)
        #print "After deleting like: ", response
        self.assertEqual(response.content, "{'num_votes':0}")
    
    def test_get_user_like(self):
        url = reverse('like', kwargs={'content_type':'be_local_server-product', 'id':'1'})
        response = self.client.get(url)
        #print "Get like status: ", response.content
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, "{'like': 'True'}")
        
        
