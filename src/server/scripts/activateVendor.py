from be_local_server.models import Vendor

v = Vendor.objects.get(pk=1)
v.is_active = True
v.save()