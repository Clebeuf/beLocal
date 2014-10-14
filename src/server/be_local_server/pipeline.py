from requests import request, HTTPError
from django.core.files.base import ContentFile
from be_local_server.models import *
from django.core.exceptions import ObjectDoesNotExist

def save_profile_picture(strategy, user, response, details, backend,
                         is_new=False,*args,**kwargs):
    if backend.name == 'facebook':
        url = 'http://graph.facebook.com/{0}/picture'.format(response['id'])

        try:
            response = request('GET', url, params={'type': 'large'})
            response.raise_for_status()
        except HTTPError:
            pass
        else:
            try:
                vendor = Vendor.objects.get(user=user)
            except ObjectDoesNotExist:
                return
            if(vendor and not vendor.photo):
                vendorPhoto = VendorPhoto()
                vendorPhoto.image.save('{0}_social.jpg'.format(user.username),
                                       ContentFile(response.content))

                vendorPhoto.save()
                vendor.photo = vendorPhoto
                vendor.save()
            