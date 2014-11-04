import datetime
from haystack import indexes
from be_local_server.models import *

class ProductIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    name = indexes.CharField(model_attr='name')
    vendor = indexes.CharField(model_attr='vendor')
    photo = indexes.CharField(model_attr='photo')
    # We add this for autocomplete.
    name_auto = indexes.EdgeNgramField(model_attr='name')

    def get_model(self):
        return Product

    def index_queryset(self, using=None):
	    """Used when the entire index for model is updated."""
	    return self.get_model().objects.all()

class VendorIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    company_name = indexes.CharField(model_attr='company_name', null=True)
    address = indexes.CharField(model_attr='address', null=True)
    phone = indexes.CharField(model_attr='phone', null=True)
    webpage = indexes.CharField(model_attr='webpage', null=True)
    photo = indexes.CharField(model_attr='photo', null=True)
    # We add this for autocomplete.
    company_name_auto = indexes.EdgeNgramField(model_attr='company_name', null=True)

    def get_model(self):
        return Vendor

    def index_queryset(self, using=None):
	    """Used when the entire index for model is updated."""
	    return self.get_model().objects.all()