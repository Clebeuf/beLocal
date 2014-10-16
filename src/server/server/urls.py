from django.conf.urls import patterns, include, url
from be_local_server import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'server.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^admin/', include(admin.site.urls), name='admin'),
    url(r'^login/(?P<backend>.+)/$', views.ObtainAuthToken.as_view(), name='login'),
    
    url(r'^vendor/add/$', views.AddVendorView.as_view(), name='vendor-add'),    
    url(r'^vendor/?$', views.RWDVendorView.as_view(), name='vendor'), 
    url(r'^vendor/details/?$', views.VendorDetailsView.as_view(), name='vendor-details'),    

    url(r'^vendor/location/add/$', views.AddSellerLocationView.as_view(), name='vendor-location-add'),
    url(r'^vendor/location/list/$', views.ListVendorLocations.as_view(), name='vendor-location-list'), 
    url(r'^vendor/location/(?P<location_id>[0-9-]+)/$', views.RWDSellerLocationView.as_view(), name='vendor-location-details'),
    url(r'^vendor/location/delete/$', views.DeleteSellerLocationView.as_view(), name='vendors-location-delete'),    
       
    url(r'^vendor/products/add/$', views.AddProductView.as_view(), name='vendor-products-add'),
    url(r'^vendor/products/photo/add/$', views.AddProductPhotoView.as_view(), name='vendor-products-photo-add'),
    url(r'^vendor/products/photo/(?P<pk>[0-9-]+)/$', views.RWDProductPhotoView.as_view(), name='vendor-products-photo-details'),
    url(r'^vendor/products/(?P<product_id>[0-9-]+)/$', views.RWDProductView.as_view(), name='vendor-products-details'),
    url(r'^vendor/products/list/$', views.VendorProductView.as_view(), name='vendor-products-list'),
    url(r'^vendor/products/stock/$', views.UpdateStockView.as_view(), name='vendors-products-stock'),
    url(r'^vendor/products/delete/$', views.DeleteProductView.as_view(), name='vendors-product-delete'),

    
    url(r'^products/trending/$', views.TrendingProductView.as_view(), name='product-trending-list'),
    url(r'^vendors/$', views.VendorsView.as_view(), name='vendors-list'),
    url(r'^vendor/photo/add/$',views.AddVendorPhotoView.as_view(), name='vendor-photo-add'),
    url(r'^vendors/$', views.VendorsView.as_view(), name='vendors-list'),    
) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
