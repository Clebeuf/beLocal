from django.contrib.sites.models import Site
my_site = Site.objects.get(pk=1)
my_site.domain = '127.0.0.1:8000'
my_site.name = 'beLocal'
my_site.save()