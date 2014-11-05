from be_local_server.models import *
from datetime import *
from django.core.files import File 
import urllib
from taggit.models import Tag

# CATEGORIES & TAGS

# Create Categories
c1 = Category(
	name="Fruits",
	slug="fruits"
)
c2 = Category(
	name="Vegetables",
	slug="vegetables"
)
c3 = Category(
	name="Preserves",
	slug="preserves"
)
# Save it
c1.save()
c2.save()
c3.save()

# Create Tags
t1 = Tag(
	name="summer only",
	slug="summer-only"
)
t2 = Tag(
	name="spring only",
	slug="spring-only"
)
t3 = Tag(
	name="winter only",
	slug="winter only"
)
t4 = Tag(
	name="local",
	slug="local"
)
# Save it
t1.save()
t2.save()
t3.save()
t4.save()
