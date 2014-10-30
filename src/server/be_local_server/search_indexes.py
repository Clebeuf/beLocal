import datetime
from haystack import indexes
from be_local_server.models import Product

class ProductIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    name = indexes.CharField(model_attr='name')
    vendor = indexes.CharField(model_attr='vendor')
    # We add this for autocomplete.
    name_auto = indexes.EdgeNgramField(model_attr='name')

    def get_model(self):
        return Product

    def index_queryset(self, using=None):
	    """Used when the entire index for model is updated."""
	    return self.get_model().objects.all()
