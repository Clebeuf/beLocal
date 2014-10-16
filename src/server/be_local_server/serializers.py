from rest_framework import serializers
from django.core.exceptions import ValidationError
import be_local_server.models
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id', 'first_name')

class AddressSerializer(serializers.ModelSerializer):
  class Meta:
    model = be_local_server.models.Address
    fields = ( 'id', 'addr_type', 'addr_line1', 'city', 'zipcode', 'state', 'country', 'latitude', 'longitude')

class VendorPhotoPathSerializer(serializers.ModelSerializer):
    image_url = serializers.Field(source="image_url")  
    class Meta: 
        model = be_local_server.models.VendorPhoto
        fields = ('image_url',)

class VendorPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = be_local_server.models.VendorPhoto
        fields = ('id', 'image')

class VendorSerializer(serializers.ModelSerializer):
    photo = VendorPhotoPathSerializer()
    address = AddressSerializer()
    class Meta:
    		model = be_local_server.models.Vendor
    		fields = ( 	'id',	
    					'user',
    					'company_name',
    					'webpage',
    					'country_code',
    					'phone',
    					'extension',
              'photo',
              'address'
    		)

class BusinessVendorSerializer(serializers.ModelSerializer):
    photo = VendorPhotoPathSerializer()
    class Meta:
        model = be_local_server.models.Vendor
        fields = (  'id',   
                    'company_name',
                    'webpage',
                    'country_code',
                    'phone',
                    'extension',
                    'photo'
        ) 

class PhotoPathSerializer(serializers.ModelSerializer):
    image_url = serializers.Field(source="image_url")  
    class Meta:
        model = be_local_server.models.ProductPhoto
        fields = ('id', 'image_url',)

class ProductPhotoSerializer(serializers.ModelSerializer):
	class Meta:
		model = be_local_server.models.ProductPhoto
        fields = ('id', 'image')

class AddSellerLocationSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    class Meta:
        model = be_local_server.models.SellerLocation
        fields = ('id', 'address', 'name','start_time', 'end_time', 'vendor', 'email', 'phone', 'description')

class AddProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = be_local_server.models.Product
        fields = ('id', 
                  'name',
                  'description', 
                  #'price',  
                  'vendor',
                  'photo',
                  'stock'
                 )
        
class ProductSerializer(serializers.ModelSerializer):
    photo = PhotoPathSerializer()    
    class Meta:
        model = be_local_server.models.Product
        fields = ('id', 
                  'name',
                  'description',   
                  'vendor',
                  'photo',
                  'stock'
                 )

class ProductDisplaySerializer(serializers.ModelSerializer):
    vendor = BusinessVendorSerializer() 
    photo = PhotoPathSerializer()
    class Meta:
        model = be_local_server.models.Product
        fields = ('id', 
                  'name',
                  'description', 
                  #'price', 
                  'vendor',
                  'photo',
                  'stock'
                 )           

class CustomerVendorSerializer(serializers.ModelSerializer):
  products = ProductSerializer()
  class Meta:
      model = be_local_server.models.Vendor
      fields = (  'id',   
                  'company_name',
                  'webpage',
                  'country_code',
                  'phone',
                  'extension',
                  'products'
      ) 






# class TagSerializer(serializers.ModelSerializer):
# 	class Meta:
# 		model = be_local_server.models.Tag
# 		fields = ('id', 'name')

# class ProductTagSerializer(serializers.ModelSerializer):
# 	product = ProductSerializer(many = True)
# 	tag = TagSerializer()

# 	class Meta:
# 		model = be_local_server.models.ProductTag
# 		fields = ('id', 'product', 'tag') #'created_at', 'updated_at')