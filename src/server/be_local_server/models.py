from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Vendors(models.Model):
    user = models.ForeignKey(User)
    company_name = models.CharField(max_length=100)
    webpage = models.CharField(max_length=100)