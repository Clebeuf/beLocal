from django.contrib import admin
from be_local_server.models import Vendor, Product

# Register your models here.

class VendorAdmin(admin.ModelAdmin):
    pass
admin.site.register(Vendor, VendorAdmin)


admin.site.register(Product)
