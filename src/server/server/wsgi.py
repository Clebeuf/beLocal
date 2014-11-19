"""
WSGI config for server project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/
"""

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")

from django.core.wsgi import get_wsgi_application
from multiprocessing import cpu_count
from os import environ

application = get_wsgi_application()

bind = '0.0.0.0:' + environ.get('PORT', '8000')

