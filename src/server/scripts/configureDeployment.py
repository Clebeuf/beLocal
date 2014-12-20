from django.contrib.sites.models import Site
my_site = Site.objects.get(pk=1)
my_site.domain = 'https://belocalvictoria.me'
my_site.name = 'beLocal'
my_site.save()
