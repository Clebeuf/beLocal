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

class VendorSerializer(serializers.ModelSerializer):
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
          'address'
    )

class BusinessVendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = be_local_server.models.Vendor
        fields = (  'id',   
                    'company_name',
                    'webpage',
                    'country_code',
                    'phone',
                    'extension'
        ) 

class PhotoPathSerializer(serializers.ModelSerializer):
    image_url = serializers.Field(source="image_url")  
    class Meta:
        model = be_local_server.models.ProductPhoto
        fields = ('image_url',)

class ProductPhotoSerializer(serializers.ModelSerializer):
	class Meta:
		model = be_local_server.models.ProductPhoto
        fields = ('id', 'image')

class AddSellerLocationSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    class Meta:
        model = be_local_server.models.SellerLocation
        fields = ('id', 'address', 'name','start_time', 'end_time', 'vendor', 'email', 'phone', 'description')


class SellerProductAtLocationSerializer(serializers.ModelSerializer): 
    sellerLocation = AddSellerLocationSerializer()
    #product = ProductSerializer()
    class Meta:
        model = be_local_server.models.SellerProductAtLocation
        fields = ('id', 'sellerLocation', 'product', 'is_visible', 'stock')

class AddProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = be_local_server.models.Product
        fields = ('id', 
                  'name',
                  'description', 
                  #'price',  
                  'vendor',
                  'photo',
                 )
        
class ProductSerializer(serializers.ModelSerializer):
    inventories = SellerProductAtLocationSerializer(many=True)
    photo = PhotoPathSerializer()    
    class Meta:
        model = be_local_server.models.Product
        fields = ('id', 
                  'name',
                  'description', 
                  #'price',  
                  'vendor',
                  'photo',
                  'inventories'
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
                  'photo'
                 )           
