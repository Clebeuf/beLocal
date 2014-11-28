from django.conf.urls import patterns, include, url
from be_local_server import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic.base import RedirectView
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'server.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^admin/', include(admin.site.urls), name='admin'),
    url(r'^login/(?P<backend>.+)/$', views.LoginView.as_view(), name='login'),
    url(r'^vendor/no-fb-create/$', views.CreateNonFacebookVendorView.as_view(), name='vendor-no-fb-create'),
    url(r'^vendor/(?P<backend>.+)/create/$', views.CreateVendorView.as_view(), name='create-vendor'),
    url(r'^customer/no-fb-create/$', views.CreateNonFacebookCustomerView.as_view(), name='customer-no-fb-create'),     
    url(r'^customer/(?P<backend>.+)/create/$', views.CreateCustomerView.as_view(), name='create-customer'), 
    url(r'^login-no-fb/$', views.LoginNoFBView.as_view(), name='login-no-fb'),

    url(r'^users/password/reset/$', views.PasswordReset.as_view(), name='password_reset'),
    url(r'^users/password/reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views.reset_confirm, name='password_reset_confirm'),      
    url(r'^redirect_to_login/$', RedirectView.as_view(url='http://127.0.0.1:9000'), name='password_reset_complete'),
    url(r'^users/delete/?$', views.DeleteUserView.as_view(), name='vendor'),    
    
    url(r'^vendor/add/$', views.AddVendorView.as_view(), name='vendor-add'),    
    url(r'^vendor/?$', views.RWDVendorView.as_view(), name='vendor'),   
    url(r'^vendor/details/?$', views.VendorDetailsView.as_view(), name='vendor-details'),
    url(r'^vendor/photo/add/$',views.AddVendorPhotoView.as_view(), name='vendor-photo-add'),

    url(r'^vendor/location/add/$', views.AddSellerLocationView.as_view(), name='vendor-location-add'),
    url(r'^vendor/location/list/$', views.ListVendorLocations.as_view(), name='vendor-location-list'), 
    url(r'^vendor/location/(?P<location_id>[0-9-]+)/$', views.RWDSellerLocationView.as_view(), name='vendor-location-details'),
    url(r'^vendor/location/delete/$', views.DeleteSellerLocationView.as_view(), name='vendors-location-delete'),  

    url(r'^vendor/markets/list/$', views.ListVendorMarkets.as_view(), name='vendor-location-list'),
    url(r'^vendor/markets/available/$', views.ListAvailableVendorMarkets.as_view(), name='vendor-location-list'),    
       
    url(r'^vendor/products/add/$', views.AddProductView.as_view(), name='vendor-products-add'),
    url(r'^vendor/products/photo/add/$', views.AddProductPhotoView.as_view(), name='vendor-products-photo-add'),
    url(r'^vendor/products/photo/(?P<pk>[0-9-]+)/$', views.RWDProductPhotoView.as_view(), name='vendor-products-photo-details'),
    url(r'^vendor/products/(?P<product_id>[0-9-]+)/$', views.RWDProductView.as_view(), name='vendor-products-details'),
    url(r'^vendor/products/list/$', views.VendorProductView.as_view(), name='vendor-products-list'),
    url(r'^vendor/products/stock/$', views.UpdateStockView.as_view(), name='vendors-products-stock'),
    url(r'^vendor/products/delete/$', views.DeleteProductView.as_view(), name='vendors-product-delete'),
   
    url(r'^products/trending/$', views.TrendingProductView.as_view(), name='product-trending-list'),
    url(r'^vendors/$', views.VendorsView.as_view(), name='vendors-list'),    
    url(r'^markets/$', views.ListMarketsView.as_view(), name='market-list'),
    url(r'^markets/(?P<market_id>[0-9-]+)/$', views.MarketView.as_view(), name='market-details'),
    url(r'^markets/join/$', views.JoinMarketView.as_view(), name='market-join'),
    url(r'^markets/leave/$', views.LeaveMarketView.as_view(), name='market-join'),
    url(r'^market/details/$', views.MarketDetailsView.as_view(), name='market-details'),     

    url(r'^search/autocomplete', 'be_local_server.views.autocomplete'),
    url(r'^search/products', views.SearchProductView.as_view(), name="product-search"),    
    url(r'^search/vendors', views.SearchVendorView.as_view(), name="vendor-search"),
    url(r'^search/markets', views.SearchMarketView.as_view(), name="market-search"),
    
    url(r'^like/(?P<content_type>[\w-]+)/(?P<id>[0-9-]+)/$', views.like, name='like'),
    
    url(r'^tag/list/$', views.ListProductTags.as_view(), name='tag-list'),
    url(r'^products/tag/(?P<tag_slug>[\w-]+)/$', views.TaggedProductView.as_view(), name='tagged-products-list'),
    url(r'^category/list/$', views.ListProductCategories.as_view(), name='category-list'),
    url(r'^products/category/(?P<category_slug>[\w-]+)/$', views.CategorizedProductView.as_view(), name='categorized-products-list'),

    url(r'^manage/vendors/list/$',views.ManageVendorsView.as_view(), name='inactive-vendors'),
    url(r'^manage/users/list/$',views.ManageUsersView.as_view(), name='manage-users'),    
    url(r'^manage/vendors/activate/$',views.ActivateVendorView.as_view(), name='activate-vendor'), 
    
) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
