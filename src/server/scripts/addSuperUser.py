from django.contrib.auth.models import User

u = User.objects.get(pk=5)
u.is_superuser = True
u.is_staff = False
u.save()