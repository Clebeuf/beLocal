# -*- coding: utf-8 -*-

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory, APIClient, APITestCase
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.authtoken.models import Token
from be_local_server.models import Vendor, Product
from be_local_server.views import *

# Create your tests here.

class ProductTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.client = APIClient()
        
        # Load some data in database 
        user1 = User.objects.create_user(username='admin', email="admin@…", password='admin')
        user2 = User.objects.create_user(username='john', email="john@…", password='john')
        vendor1 = Vendor.objects.create(
                                        user=user1, 
                                        company_name="etsy",
                                        webpage="www.etsy.com",
                                        country_code="1",
                                        phone="7777777777",
                                        extension="123"
                                        )
        vendor2 = Vendor.objects.create(
                                        user=user2, 
                                        company_name="amazon",
                                        webpage="www.amazon.com",
                                        country_code="1",
                                        phone="7777777777",
                                        extension="123"
                                        )
        Product.objects.create(
                               vendor=vendor1,
                               name="carrots",
                               description="test product",
                               price="10"
                               )
        Product.objects.create(
                               vendor=vendor2,
                               name="tomato",
                               description="test product",
                               price="5"
                               )
        
        # Token Authentication
        token = Token.objects.create(user=user2)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key) 
    
    def tearDown(self):
        self.client.credentials()
    
    # product lists
    def test_list_vendor_products(self):            
        url = reverse('vendor-products-list', kwargs={'vendor_id': '2'}) 
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
    
    # product details
    def test_add_product(self):  
        url = reverse('vendor-products-add')  
        data = {
                'vendor':"2",
                'name':"carrots",
                'description':"test product",
                'price':"15",
                } 
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    def test_read_product(self):             
        url = reverse('vendor-products-details', kwargs={'product_id': '2'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)   
    
    def test_edit_product(self): 
        url = reverse('vendor-products-details', kwargs={'product_id': '2'})
        data = {'price':"20"}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)  
        
    def test_delete_product(self):
        url = reverse('vendor-products-details', kwargs={'product_id': '2'})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)      
