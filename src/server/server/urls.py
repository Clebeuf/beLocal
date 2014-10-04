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
    url(r'^vendor/products/add/?', views.AddProductView.as_view(), name='product-add'),
    url(r'^vendor/products/(?P<product_id>[0-9-]+)/$', views.RWDProductView.as_view(), name='vendor-product'),
    url(r'^vendor/(?P<vendor_id>[0-9-]+)/products/$', views.VendorProductView.as_view(), name='vendor-products-list'),
)
