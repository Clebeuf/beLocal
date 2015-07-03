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
    url(r'^api/admin/', include(admin.site.urls), name='admin'),
    url(r'^api/login/(?P<backend>.+)/$', views.LoginView.as_view(), name='login'),
    url(r'^api/vendor/no-fb-create/$', views.CreateNonFacebookVendorView.as_view(), name='vendor-no-fb-create'),
    url(r'^api/vendor/(?P<backend>.+)/create/$', views.CreateVendorView.as_view(), name='create-vendor'),
    url(r'^api/customer/no-fb-create/$', views.CreateNonFacebookCustomerView.as_view(), name='customer-no-fb-create'),     
    url(r'^api/customer/(?P<backend>.+)/create/$', views.CreateCustomerView.as_view(), name='create-customer'), 
    url(r'^api/login-no-fb/$', views.LoginNoFBView.as_view(), name='login-no-fb'),
    url(r'^api/users/password/reset/$', views.PasswordReset.as_view(), name='password_reset'),
    url(r'^api/users/password/reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views.reset_confirm, name='password_reset_confirm'),      
    url(r'^api/redirect_to_login/$', RedirectView.as_view(url='http://belocalvictoria.me'), name='password_reset_complete'),
    url(r'^api/users/delete/?$', views.DeleteUserView.as_view(), name='vendor'),    

    url(r'^api/vendor/?$', views.RWDVendorView.as_view(), name='vendor'),   
    url(r'^api/vendor/details/?$', views.VendorDetailsView.as_view(), name='vendor-details'),
    url(r'^api/vendor/photo/add/$',views.AddVendorPhotoView.as_view(), name='vendor-photo-add'),

    url(r'^api/vendor/location/add/$', views.AddSellerLocationView.as_view(), name='vendor-location-add'),
    url(r'^api/vendor/location/list/$', views.ListVendorLocations.as_view(), name='vendor-location-list'), 
    url(r'^api/vendor/location/(?P<location_id>[0-9-]+)/$', views.RWDSellerLocationView.as_view(), name='vendor-location-details'),
    url(r'^api/vendor/location/delete/$', views.DeleteSellerLocationView.as_view(), name='vendors-location-delete'),  

    url(r'^api/vendor/markets/list/$', views.ListVendorMarkets.as_view(), name='vendor-location-list'),
    url(r'^api/vendor/markets/available/$', views.ListAvailableVendorMarkets.as_view(), name='vendor-location-list'),    
       
    url(r'^api/vendor/products/add/$', views.AddProductView.as_view(), name='vendor-products-add'),
    url(r'^api/vendor/products/photo/add/$', views.AddProductPhotoView.as_view(), name='vendor-products-photo-add'),
    url(r'^api/vendor/products/photo/(?P<pk>[0-9-]+)/$', views.RWDProductPhotoView.as_view(), name='vendor-products-photo-details'),
    url(r'^api/vendor/products/(?P<product_id>[0-9-]+)/$', views.RWDProductView.as_view(), name='vendor-products-details'),
    url(r'^api/vendor/products/list/$', views.VendorProductView.as_view(), name='vendor-products-list'),
    url(r'^api/vendor/products/stock/$', views.UpdateStockView.as_view(), name='vendors-products-stock'),
    url(r'^api/vendor/products/delete/$', views.DeleteProductView.as_view(), name='vendors-product-delete'),
   
    url(r'^api/products/trending/$', views.TrendingProductView.as_view(), name='product-trending-list'),
    url(r'^api/vendors/$', views.VendorsView.as_view(), name='vendors-list'),    
    url(r'^api/markets/$', views.ListMarketsView.as_view(), name='market-list'),
    url(r'^api/markets/(?P<market_id>[0-9-]+)/$', views.MarketView.as_view(), name='market-details'),
    url(r'^api/market/(?P<market_id>[0-9-]+)/$', views.RWDMarketView.as_view(), name='market-rwd'),    
    url(r'^api/markets/add/$',views.AddMarketView.as_view(), name='market-add'),    
    url(r'^api/markets/delete/$',views.DeleteMarketView.as_view(), name='market-remove'),       
    url(r'^api/markets/join/$', views.JoinMarketView.as_view(), name='market-join'),
    url(r'^api/markets/leave/$', views.LeaveMarketView.as_view(), name='market-join'),
    url(r'^api/markets/photo/add/$',views.AddMarketPhotoView.as_view(), name='market-photo-add'),
    url(r'^api/market/details/$', views.MarketDetailsView.as_view(), name='market-details'), 

    url(r'^api/search/autocomplete', 'be_local_server.views.autocomplete'),
    url(r'^api/search/products', views.SearchProductView.as_view(), name="product-search"),    
    url(r'^api/search/vendors', views.SearchVendorView.as_view(), name="vendor-search"),
    url(r'^api/search/markets', views.SearchMarketView.as_view(), name="market-search"),
    
    url(r'^api/like/(?P<content_type>[\w-]+)/(?P<id>[0-9-]+)/$', views.like, name='like'),
    url(r'^api/tag/list/$', views.ListProductTags.as_view(), name='tag-list'),
    url(r'^api/products/tag/(?P<tag_slug>[\w-]+)/$', views.TaggedProductView.as_view(), name='tagged-products-list'),
    url(r'^api/category/list/$', views.ListProductCategories.as_view(), name='category-list'),
    url(r'^api/products/category/(?P<category_slug>[\w-]+)/$', views.CategorizedProductView.as_view(), name='categorized-products-list'),

    url(r'^api/manage/vendors/list/$',views.ManageVendorsView.as_view(), name='inactive-vendors'),
    url(r'^api/manage/users/list/$',views.ManageUsersView.as_view(), name='manage-users'),    
    url(r'^api/manage/vendors/activate/$',views.ActivateVendorView.as_view(), name='activate-vendor'), 

    url(r'^api/public/markets/$', views.ListMarketsOnlyView.as_view(), name='public-market-list'),    
) # + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
