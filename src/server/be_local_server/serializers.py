from rest_framework import serializers
from django.core.exceptions import ValidationError
import be_local_server.models
from django.contrib.auth.models import User
from secretballot.models import Vote
from taggit.models import Tag

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id', 'first_name')

class OpeningHoursSerializer(serializers.ModelSerializer):
  class Meta:
      model = be_local_server.models.OpeningHours
      fields = (  'address',
                  'weekday',
                  'from_hour',
                  'to_hour',
      )

class DisplayOpeningHoursSerializer(serializers.ModelSerializer):
  weekday = serializers.CharField(source='get_day_display')  
  class Meta:
      model = be_local_server.models.OpeningHours
      fields = (  'weekday',
                  'from_hour',
                  'to_hour',
      ) 

class AddOpeningHoursSerializer(serializers.ModelSerializer): 
  class Meta:
      model = be_local_server.models.OpeningHours
      fields = (  'weekday',
                  'from_hour',
                  'to_hour',
      )               

class AddressSerializer(serializers.ModelSerializer):
  hours = DisplayOpeningHoursSerializer(many=True)
  class Meta:
    model = be_local_server.models.Address
    fields = ( 'id', 'addr_line1', 'city', 'zipcode', 'state', 'country', 'latitude', 'longitude', 'hours')

class AddAddressSerializer(serializers.ModelSerializer):
  hours = AddOpeningHoursSerializer(many=True, allow_add_remove=True, read_only=False)  
  class Meta:
    model = be_local_server.models.Address
    fields = ( 'id', 'addr_line1', 'city', 'zipcode', 'state', 'country', 'latitude', 'longitude', 'hours')    

class VendorPhotoPathSerializer(serializers.ModelSerializer):
    image_url = serializers.Field(source="image_url")  
    class Meta: 
        model = be_local_server.models.VendorPhoto
        fields = ('id', 'image_url',)    

class VendorPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = be_local_server.models.VendorPhoto
        fields = ('id', 'image')

class MarketPhotoPathSerializer(serializers.ModelSerializer):
    image_url = serializers.Field(source="image_url")  
    class Meta: 
        model = be_local_server.models.MarketPhoto
        fields = ('id', 'image_url',)            

class VendorSerializer(serializers.ModelSerializer):
    photo = VendorPhotoPathSerializer()
    address = AddressSerializer()
    total_likes = serializers.IntegerField(source='vote_total') 
    is_liked = serializers.IntegerField()
  
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
              'address',
              'description',
              'total_likes',
              'is_liked',
              'facebook_url',
              'twitter_url',
    		)

class EditVendorSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    class Meta:
        model = be_local_server.models.Vendor
        fields = (  
              'id', 
              'user',
              'company_name',
              'webpage',
              'country_code',
              'phone',
              'extension',
              'photo',
              'address',
              'description'
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
                    'photo',
        ) 

class ManageVendorSerializer(serializers.ModelSerializer):
    photo = VendorPhotoPathSerializer()
    address = AddressSerializer()
    class Meta:
        model = be_local_server.models.Vendor
        fields = (  'id',   
                    'company_name',
                    'webpage',
                    'country_code',
                    'phone',
                    'extension',
                    'photo',
                    'is_active',
                    'address',
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
    address = OpeningHoursSerializer() 
    class Meta:
        model = be_local_server.models.SellerLocation
        fields = ('id', 'address', 'name', 'date', 'vendor', 'email', 'phone', 'description')

class SellerLocationSerializer(serializers.ModelSerializer):
    address = AddAddressSerializer() 
    class Meta:
        model = be_local_server.models.SellerLocation
        fields = ('id', 'address', 'name', 'date', 'vendor', 'email', 'phone', 'description')        

class TagListSerializer(serializers.WritableField):

    def from_native(self, data):
        if type(data) is not list:
            data = data.split(',')
            if type(data) is not list:
                raise ParseError("expected a list of data")     
        return data
    
    def to_native(self, obj):
        if type(obj) is not list:
            return [tag.name for tag in obj.all()]
            return tags
        return obj

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name', 'slug')
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = be_local_server.models.Category
        fields = ('id', 'name', 'slug')
            
class AddProductSerializer(serializers.ModelSerializer):
    tags = TagListSerializer(blank=True)
    
    class Meta:
        model = be_local_server.models.Product
        fields = ('id', 
                  'name',
                  'description', 
                  #'price',  
                  'vendor',
                  'photo',
                  'stock',
                  'tags',
                  'category'
        )
        
class ProductSerializer(serializers.ModelSerializer):
    photo = PhotoPathSerializer()    
    tags = TagListSerializer(blank=True)
    vendor = BusinessVendorSerializer()
    
    class Meta:
        model = be_local_server.models.Product
        fields = ('id', 
                  'name',
                  'description',   
                  'vendor',
                  'photo',
                  'stock',
                  'tags',
                  'category'
        )

class MarketDetailsProductSerializer(serializers.ModelSerializer):
    photo = PhotoPathSerializer()    
    tags = TagListSerializer(blank=True)
    vendor = BusinessVendorSerializer()
    
    class Meta:
        model = be_local_server.models.Product
        fields = ('id', 
                  'name',
                  'description',   
                  'vendor',
                  'photo',
                  'stock',
                  'tags',
                  'category'
        )        

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ('id',
                  'token',
                  'vote',
                  'content_type',
                  'object_id',
        )
        
class ProductDisplaySerializer(serializers.ModelSerializer):
    vendor = BusinessVendorSerializer() 
    photo = PhotoPathSerializer()
    total_likes = serializers.IntegerField(source='vote_total') 
    is_liked = serializers.IntegerField()
    tags = TagListSerializer(blank=True)
    category = CategorySerializer(blank=True)
    
    class Meta:
        model = be_local_server.models.Product
        fields = ('id', 
                  'name',
                  'description', 
                  #'price', 
                  'vendor',
                  'photo',
                  'stock',
                  'total_likes',
                  'is_liked',
                  'tags',
                  'category'
        )           

class CustomerVendorSerializer(serializers.ModelSerializer):
  products = serializers.SerializerMethodField('get_in_stock_products')
  photo = VendorPhotoPathSerializer()
  address = AddressSerializer()
  total_likes = serializers.IntegerField(source='vote_total') 
  is_liked = serializers.IntegerField()

  def get_in_stock_products(self, obj):
    products = be_local_server.models.Product.objects.filter(vendor=obj, stock="IS")
    serializer = ProductSerializer(products, many=True)
    return serializer.data

  class Meta:
      model = be_local_server.models.Vendor
      fields = (  'id',   
                  'company_name',
                  'webpage',
                  'country_code',
                  'phone',
                  'extension',
                  'products',
                  'photo',
                  'address',
                  'total_likes',
                  'is_liked',
      )

class VendorTabSerializer(serializers.ModelSerializer):
  products = serializers.SerializerMethodField('get_in_stock_products')
  selling_locations = serializers.SerializerMethodField('get_selling_locations')  
  photo = VendorPhotoPathSerializer()
  address = AddressSerializer()
  total_likes = serializers.IntegerField(source='vote_total') 
  is_liked = serializers.IntegerField()

  def get_in_stock_products(self, obj):
    products = be_local_server.models.Product.objects.filter(vendor=obj, stock="IS")
    serializer = ProductSerializer(products, many=True)
    return serializer.data

  def get_selling_locations(self, obj):
    locations = be_local_server.models.SellerLocation.objects.filter(vendor=obj)
    serializer = SellerLocationSerializer(locations, many=True)
    return serializer.data    

  class Meta:
      model = be_local_server.models.Vendor
      fields = (  'id',   
                  'company_name',
                  'webpage',
                  'country_code',
                  'phone',
                  'extension',
                  'products',
                  'photo',
                  'address',
                  'total_likes',
                  'is_liked',
                  'selling_locations'
      )       

class MarketDetailsVendorSerializer(serializers.ModelSerializer):
  products = serializers.SerializerMethodField('get_in_stock_products')
  photo = VendorPhotoPathSerializer()
  address = AddressSerializer()

  def get_in_stock_products(self, obj):
    products = be_local_server.models.Product.objects.filter(vendor=obj, stock="IS")
    serializer = MarketDetailsProductSerializer(products, many=True)
    return serializer.data

  class Meta:
      model = be_local_server.models.Vendor
      fields = (  'id',   
                  'company_name',
                  'webpage',
                  'country_code',
                  'phone',
                  'extension',
                  'products',
                  'photo',
                  'address',
      )           

class MarketDisplaySerializer(serializers.ModelSerializer):
    vendors = BusinessVendorSerializer(many=True)
    address = AddAddressSerializer()
    total_likes = serializers.IntegerField(source='vote_total') 
    is_liked = serializers.IntegerField()
    photo = MarketPhotoPathSerializer()
  
    class Meta:
        model = be_local_server.models.Market
        fields = (  'id',
                    'vendors',
                    'address',
                    'name',
                    'description',
                    'total_likes',
                    'is_liked',
                    'photo',
                    'webpage',
        )

class MarketDetailsSerializer(serializers.ModelSerializer):
    vendors = MarketDetailsVendorSerializer(many=True)
    address = AddAddressSerializer()
    total_likes = serializers.IntegerField(source='vote_total') 
    is_liked = serializers.IntegerField()
    photo = MarketPhotoPathSerializer()
  
    class Meta:
        model = be_local_server.models.Market
        fields = (  'id',
                    'vendors',
                    'address',
                    'name',
                    'description',
                    'total_likes',
                    'is_liked',
                    'photo',
                    'webpage'
        )
        
class MarketSearchSerializer(serializers.ModelSerializer):
    vendors = MarketDetailsVendorSerializer(many=True)
    address = AddAddressSerializer()
    photo = MarketPhotoPathSerializer()
  
    class Meta:
        model = be_local_server.models.Market
        fields = (  'id',
                    'vendors',
                    'address',
                    'name',
                    'description',
                    'photo',
                    'webpage'
        )         

class VendorMarketDisplaySerializer(serializers.ModelSerializer):
    vendors = BusinessVendorSerializer(many=True)
    address = AddAddressSerializer()
  
    class Meta:
        model = be_local_server.models.Market
        fields = (  'id',
                    'vendors',
                    'address',
                    'name',
                    'description',
        )        

