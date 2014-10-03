from rest_framework import generics, status, viewsets, mixins
from social.apps.django_app.utils import psa
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework import parsers
from rest_framework import renderers
from rest_framework.authentication import get_authorization_header
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.generics import GenericAPIView
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import HttpResponse, HttpResponseServerError, Http404
from be_local_server import serializers
from rest_framework import generics
from be_local_server.models import Product, Vendor
from rest_framework.authentication import TokenAuthentication

class ObtainAuthToken(APIView):
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser,)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = AuthTokenSerializer
    model = Token
 
    def post(self, request, backend):
        serializer = self.serializer_class(data=request.DATA)
        if backend == 'auth':
            if serializer.is_valid():
                token, created = Token.objects.get_or_create(user=serializer.object['user'])
                return Response({'token': token.key})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
        else:
            user = register_by_access_token(request, backend)
 
            if user and user.is_active:
                token, created = Token.objects.get_or_create(user=user)
                response = {}
                if user.is_staff:
                    vendor = Vendor.objects.get(user=user)
                    response = {'id': user.id, 'name': user.username, 'firstname': user.first_name, 'userType': 'VEN', 'vendor' : {'company_name' : vendor.company_name}, 'token': token.key}
                else:
                    response = {'id': user.id, 'name': user.username, 'firstname': user.first_name, 'userType': 'CUS', 'token': token.key}
                return Response(response)

@psa()
def register_by_access_token(request, backend):
    backend = request.backend
    # Split by spaces and get the array
    auth = get_authorization_header(request).split()
 
    if not auth or auth[0].lower() != 'token':
        msg = 'No token header provided.'
        return msg
 
    if len(auth) == 1:
        msg = 'Invalid token header. No credentials provided.'
        return msg
 
    access_token = auth[1]
 
    user = backend.do_auth(access_token)
 
    return user

class AddVendorView(generics.CreateAPIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):

        serializer = serializers.AddVendorSerializer(data=request.DATA)

        if serializer.is_valid():
            user = User.objects.get(id=serializer.init_data['user'])
            user.is_staff = 1 # make the user a vendor
            user.save()

            serializer.save()
            return HttpResponse("success")   
        else:
            return Response("Failed to create vendor.",
                            status=status.HTTP_400_BAD_REQUEST)

class RWDVendorView(generics.RetrieveUpdateDestroyAPIView):
    """
    This view  provides an endpoint for Sellers to view and
    modify their information
    """
    
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.VendorSerializer

    def get(self, request):
        vendor = Vendor.objects.get(user=request.user)
        serializer = serializers.VendorSerializer(vendor)

        if vendor is not None:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    #Do we want to have a vendor delete here?
    def delete(self, request):
        vendor = Vendor.objects.get(user=request.user)

        if vendor is not None:
            user = User.objects.get(id=serializer.init_data['user'])
            user.is_staff = 0
            user.save()
            vendor.delete()
            return HttpResponse("success")
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def get_object(self):
        vendor = Vendor.objects.get(user=self.request.user)
        return vendor

class AddProductView(generics.CreateAPIView):
    """
    This view provides an endpoint for sellers to
    add a product to their products list.
    """   
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)     

    def post(self, request, *args, **kwargs):
        serializer = serializers.ProductSerializer(data=request.DATA)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

#TODO: Currenty this view simply returns all products rather
# than trending ones
class TrendingProductView(generics.ListAPIView):
    """
    This view provides an endpoint for customers to
    view currently trending products.
    """   
    permission_classes = (AllowAny,)

    serializer_class = serializers.ProductDisplaySerializer

    def get_queryset(self):
        return Product.objects.all()

class RWDProductView(generics.RetrieveUpdateDestroyAPIView):
    """
    This view provides an endpoint for sellers to
    read-write-delete a product from their products list.
    """ 
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, product_id):
        product = Product.objects.get(pk=product_id)
        serializer = serializers.ProductSerializer(product)        
        
        if product is not None:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)  
    
    def delete(self, request, product_id):        
        product = Product.objects.get(pk=product_id)
        
        if product is not None:
            product.delete() 
            return HttpResponse("success") 
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)          
        
    
    def patch(self, request, product_id):
        product = Product.objects.get(pk=product_id) 
            
        if product is not None:
            serializer = serializers.ProductSerializer(product, data=request.DATA, many=False)
           
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        

class AddSellerLocationView(generics.CreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):

        vendor = Vendor.objects.get(user=request.user)

        serializer = serializers.AddSellerLocationSerializer(data = request.DATA)

        if serializer.is_valid(): 
            serializer.save()
            return HttpResponse("success");

        else:
            return Response("Failed to create SellerLocation.",
                            status=status.HTTP_400_BAD_REQUEST)

