import datetime
from haystack import indexes
from django.conf import settings
from haystack.backends.elasticsearch_backend import ElasticsearchSearchEngine, ElasticsearchSearchBackend
from be_local_server.models import *

class ProductIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    name = indexes.CharField(model_attr='name')
    vendor = indexes.CharField(model_attr='vendor')
    # We add this for autocomplete.
    name_auto = indexes.EdgeNgramField(model_attr='name')
    is_active = indexes.NgramField(model_attr='vendor__is_active')

    def get_model(self):
        return Product

    def index_queryset(self, using=None):
	    """Used when the entire index for model is updated."""
	    return self.get_model().objects.filter(vendor__is_active=True)

class VendorIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    company_name = indexes.NgramField(model_attr='company_name', null=True)
    city = indexes.NgramField(model_attr='address__city', null=True)
    state = indexes.NgramField(model_attr='address__state', null=True)
    country = indexes.NgramField(model_attr='address__country', null=True)
    zipcode = indexes.NgramField(model_attr='address__zipcode', null=True)
    webpage = indexes.NgramField(model_attr='webpage', null=True)
    country_code = indexes.NgramField(model_attr='country_code', null=True)
    phone = indexes.NgramField(model_attr='phone', null=True)
    is_active = indexes.NgramField(model_attr='is_active')

    def get_model(self):
        return Vendor

    def index_queryset(self, using=None):
	    """Used when the entire index for model is updated."""
	    return self.get_model().objects.filter(is_active=True)

class MarketIndex(indexes.SearchIndex, indexes.Indexable):
	text = indexes.CharField(document=True, use_template=True)
	name = indexes.NgramField(model_attr='name', null=True)
	addr_line1 = indexes.NgramField(model_attr='address__addr_line1', null=True)
	city = indexes.NgramField(model_attr='address__city', null=True)
	state = indexes.NgramField(model_attr='address__state', null=True)
	country = indexes.NgramField(model_attr='address__country', null=True)
	zipcode = indexes.NgramField(model_attr='address__zipcode', null=True)
	webpage = indexes.NgramField(model_attr='webpage', null=True)

	def get_model(self):
		return Market

	def index_queryset(self, using=None):
		"""Used when the entire index for model is updated."""
		return self.get_model().objects.all()

class CustomElasticsearchBackend(ElasticsearchSearchBackend):
    """
    The default ElasticsearchSearchBackend settings don't tokenize strings of digits the same way as words, so emplids
    get lost: the lowercase tokenizer is the culprit. Switching to the standard tokenizer and doing the case-
    insensitivity in the filter seems to do the job.
    """
    def __init__(self, connection_alias, **connection_options):
        # see http://stackoverflow.com/questions/13636419/elasticsearch-edgengrams-and-numbers
        self.DEFAULT_SETTINGS['settings']['analysis']['analyzer']['edgengram_analyzer']['tokenizer'] = 'standard'
        self.DEFAULT_SETTINGS['settings']['analysis']['analyzer']['edgengram_analyzer']['filter'].append('lowercase')
        super(CustomElasticsearchBackend, self).__init__(connection_alias, **connection_options)

class CustomElasticsearchSearchEngine(ElasticsearchSearchEngine):
    backend = CustomElasticsearchBackend