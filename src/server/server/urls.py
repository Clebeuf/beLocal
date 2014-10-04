from django.conf.urls import patterns, include, url
from be_local_server import views

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'server.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^admin/', include(admin.site.urls), name='admin'),
    url(r'^login/(?P<backend>.+)/$', views.ObtainAuthToken.as_view(), name='login'),
    
    url(r'^vendor/add/?', views.AddVendorView.as_view(), name='vendor-add'),    
    url(r'^vendor/?$', views.RWDVendorView.as_view(), name='vendor-details'),    

    url(r'^vendor/location/add/?', views.AddSellerLocationView.as_view(), name='vendor-location-add'),
    url(r'^vendor/location/list/?', views.ListVendorLocations.as_view(), name='vendor-location-list'), 
       
    url(r'^vendor/products/add/?', views.AddProductView.as_view(), name='vendor-product-add'),
    url(r'^vendor/products/(?P<product_id>[0-9-]+)$', views.RWDProductView.as_view(), name='vendor-product-details'),
    url(r'^vendor/(?P<vendor_id>[0-9-]+)/products/$', views.VendorProductView.as_view(), name='vendor-product-list'),
    
    url(r'^products/trending/?', views.TrendingProductView.as_view(), name='product-trending-list'),
)
