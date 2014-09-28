from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
	name = models.CharField(max_length=200)
	description = models.CharField(max_length=400)
	price = models.IntegerField()
	stock = models.CharField(max_length=300)
	image_path = models.CharField(max_length=300)
	created_at = models.DateField()
	updated_at = models.DateField()

class Tag(models.Model):
	name = models.CharField(max_length=100)

class ProdcutTag(models.Model):
	product = models.ManyToManyField(Product)
	tag = models.ForeignKey(Tag)
	created_at = models.DateField()
	updated_at = models.DateField()

class Address(models.Model):
	addr_line1 = models.CharField(max_length=400)
	addr_line2 = models.CharField(max_length=400)
	city = models.CharField(max_length=200)
	state = models.CharField(max_length=200)
	country = models.CharField(max_length=200)
	zipcode = models.CharField(max_length=10)
	addr_type = models.CharField(max_length=100)
	updated_at = models.DateField()

class GeoLocation(models.Model):
	latitude = models.IntegerField();
	longitude = models.IntegerField();

class Vendor(models.Model):
	company_name = models.CharField(max_length=200)
	webpage = models.CharField(max_length=400)
	image_path = models.CharField(max_length=300)
	is_approved = models.BooleanField(default=False)
	register_date = models.DateField()

class VendorContact(models.Model):
	vendor = models.ForeignKey(Vendor)
	first_name = models.CharField(max_length=200)
	last_name = models.CharField(max_length=200)
	country_code = models.CharField(max_length=50)
	phone = models.CharField(max_length=25)
	extension = models.CharField(max_length=25)
	email = models.CharField(max_length=200)
	contact_type = models.CharField(max_length=200)
	created_at = models.DateField()
	updated_at = models.DateField()

class SellerLocation(models.Model):
	vendor = models.ForeignKey(Vendor)
	geo_location = models.ForeignKey(GeoLocation)
	address = models.ForeignKey(Address)
	start_time = models.DateField()
	end_time = models.DateField()
	name = models.CharField(max_length=200)
	image_path = models.CharField(max_length=300)
	created_at = models.DateField()
	updated_at = models.DateField()

class SellerProductAtLocation(models.Model):
	sellerLocation = models.ForeignKey(SellerLocation)
	product = models.ForeignKey(Product)
	is_visible = models.BooleanField(default=False)
	created_at = models.DateField()
	updated_at = models.DateField()
	stock = models.CharField(max_length=200)