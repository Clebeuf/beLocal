from django.contrib.auth.models import User

u = User.objects.get(pk=1)
u.is_superuser = True
u.is_staff = False
u.save()