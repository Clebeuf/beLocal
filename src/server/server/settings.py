"""
Django settings for server project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'fy=c#^1m+x38z=(5pb6i3a_8v(bhv)$#2a7h!1*dv))jby0xh4'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

TEMPLATE_DEBUG = False

ALLOWED_HOSTS = ['belocalvictoria.me', 'api.belocalvictoria.me', '127.0.0.1', 'localhost']

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTOCOL', 'https')
#SESSION_COOKIE_HTTPONLY
SESSION_COOKIE_SECURE = True
#CSRF_COOKIE_SECURE = True
SESSION_EXPIRE_AT_BROWSER_CLOSE = True

SITE_ID = 1

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'haystack',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'social.apps.django_app.default',
    #'account',
    #'sortedm2m',
    #'south',   # Only if you're relying on South for migrations.
    'be_local_server',
    'undelete',
    'taggit',
    'secretballot',
    'kombu.transport.django',
    'djcelery',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',     
    'be_local_server.middleware.SecretBallotAuthenticatedUserMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.core.context_processors.tz',
    'django.contrib.messages.context_processors.messages',
    'django.core.context_processors.request',
 
    'social.apps.django_app.context_processors.backends',
    'social.apps.django_app.context_processors.login_redirect',
 
    'django.core.context_processors.csrf',
    #'account.context_processors.account',
 
)

ROOT_URLCONF = 'server.urls'

CORS_ORIGIN_ALLOW_ALL = True

WSGI_APPLICATION = 'server.wsgi.application'

REST_FRAMEWORK = {
#     'DEFAULT_PERMISSION_CLASSES': [
#         'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
#     ]
    'TEST_REQUEST_DEFAULT_FORMAT': 'json',
    'TIME_FORMAT' : '%I:%M%p'    
 }

# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
	'NAME': 'belocal',
	'USER': 'root',
	'PASSWORD': 'belocal',
    }
}

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.elasticsearch_backend.ElasticsearchSearchEngine',
        'URL': 'http://127.0.0.1:9200/',
        'INDEX_NAME': 'haystack',
    },
}

HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.RealtimeSignalProcessor'

AUTHENTICATION_BACKENDS = (
    'social.backends.google.GoogleOAuth2',
    'social.backends.twitter.TwitterOAuth',
    'social.backends.facebook.FacebookOAuth2',
    'django.contrib.auth.backends.ModelBackend'
)

SOCIAL_AUTH_PIPELINE = (
    'social.pipeline.social_auth.social_details',
    'social.pipeline.social_auth.social_uid',
    'social.pipeline.social_auth.auth_allowed',
    'social.pipeline.social_auth.social_user',
    'social.pipeline.user.get_username',
    'social.pipeline.social_auth.associate_by_email',
    'social.pipeline.user.create_user',
    'social.pipeline.social_auth.associate_user',
    'social.pipeline.social_auth.load_extra_data',
    'social.pipeline.user.user_details',
    'be_local_server.pipeline.save_profile_picture',
    'be_local_server.pipeline.save_user_id',
)

SOCIAL_AUTH_STRATEGY = 'social.strategies.django_strategy.DjangoStrategy'

SOCIAL_AUTH_FACEBOOK_KEY = '1527244884188403'
SOCIAL_AUTH_FACEBOOK_SECRET = '7109a4dec448f9f8298d0859dca07682'
SOCIAL_AUTH_FACEBOOK_SCOPE = ['email', 'user_about_me', 'user_birthday', 'user_location']

# Celery integration with Django
BROKER_URL = "django://" # tell kombu to use the Django database as the message queue

import djcelery
djcelery.setup_loader()

# Celery Configuration 
CELERY_IMPORTS = ("be_local_server.tasks", )
CELERY_ALWAYS_EAGER = True

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True
    
USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_ROOT = '/home/ubuntu/beLocal.com/static/'
STATIC_URL = 'https://belocalvictoria.me/static/'

# User-uploaded images
# https://docs.djangoproject.com/en/1.5/howto/static-files/#serving-files-uploaded-by-a-user
MEDIA_ROOT = os.path.join('/home/ubuntu/beLocal.com/media/')
MEDIA_URL = 'https://belocalvictoria.me/media/' #'http://belocalvictoria.me:80/static/media/'
ADMIN_MEDIA_PREFIX = '/admin-media/'

# site id for sites framework
# https://docs.djangoproject.com/en/dev/ref/contrib/sites/#enabling-the-sites-framework
SITE_ID = 1

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'belocalvictoria@gmail.com'
EMAIL_HOST_PASSWORD = 'git#696969'
 
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
