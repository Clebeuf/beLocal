from django.conf.urls import patterns, include, url
from be_local_server import views

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'server.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/(?P<backend>.+)/$', views.ObtainAuthToken.as_view()),
    url(r'^vendor/add/?', views.AddVendorView.as_view()),    
    url(r'^vendor/?$', views.RWDVendorView.as_view()),    

    url(r'^vendor/location/add/?', views.AddSellerLocationView.as_view()),
    url(r'^vendor/products/add/?', views.AddProductView.as_view()),
    url(r'^vendor/products/(?P<product_id>[0-9-]+)$', views.RWDProductView.as_view()),

    url(r'^products/trending/?', views.TrendingProductView.as_view()),
)
