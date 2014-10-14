from requests import request, HTTPError

from django.core.files.base import ContentFile


def save_profile_picture(strategy, user, response, details,
                         is_new=False,*args,**kwargs):

    if is_new and strategy.backend.name == 'facebook':
        url = 'http://graph.facebook.com/{0}/picture'.format(response['id'])

        try:
            response = request('GET', url, params={'type': 'large'})
            response.raise_for_status()
        except HTTPError:
            pass
        else:
            profile = user.get_profile()
            profile.photo.save('{0}_social.jpg'.format(user.username),
                                   ContentFile(response.content))
            profile.save()