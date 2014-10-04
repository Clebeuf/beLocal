from rest_framework import serializers
from django.core.exceptions import ValidationError
import be_local_server.models
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id', 'first_name')

class VendorSerializer(serializers.ModelSerializer):
	class Meta:
		model = be_local_server.models.Vendor
		fields = ( 	'id',	
					'user',
					'company_name',
					'webpage',
					'country_code',
					'phone',
					'extension'
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

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = be_local_server.models.Product
        fields = ('id', 
                  'name',
                  'description', 
                  'price', 
                  #'image', 
                  'vendor'
                 )

class ProductDisplaySerializer(serializers.ModelSerializer):
    vendor = BusinessVendorSerializer() 
    class Meta:
        model = be_local_server.models.Product
        fields = ('id', 
                  'name',
                  'description', 
                  'price', 
                  #'image', 
                  'vendor'
                 )           

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = be_local_server.models.Address
        fields = ( 'id', 'addr_type', 'addr_line1', 'city', 'zipcode', 'state', 'latitude', 'longitude')

class AddSellerLocationSerializer(serializers.ModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = be_local_server.models.SellerLocation
        fields = ('id', 'address', 'name', 'image_path','start_time', 'end_time', 'vendor')


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

# class SellerProductAtLocationSerializer(serializers.ModelSerializer):
# 	sellerLocation = SellerLocationSerializer()
# 	product = ProductSerializer()

# 	class Meta:
# 		model = be_local_server.SellerProductAtLocation
# 		fields = ('id', 'sellerLocation', 'product', 'is_visible', 'stock') #created_at', 'updated_at', 'stock')
