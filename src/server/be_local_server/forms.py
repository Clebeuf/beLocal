# -*- coding: utf-8 -*-

from django import forms
from be_local_server.models import Product, Vendor

class UploadProductPhotoForm(forms.Form):
    #title = forms.CharField(max_length=100)
    imagefile = forms.FileField(label='Select a photo',
                                help_text='max. 10 megabytes')