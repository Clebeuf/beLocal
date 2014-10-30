from secretballot.middleware import SecretBallotMiddleware

class SecretBallotAuthenticatedUserMiddleware(SecretBallotMiddleware):

    def generate_token(self, request):
        auth = request.META.get('HTTP_AUTHORIZATION', b'')
        """if isinstance(auth, type('')):
            # Work around django test client oddness
            auth = auth.encode(HTTP_HEADER_ENCODING)"""
            
        token = auth.split()      
          
        if not token or token[0].lower() != b'token' or len(token) == 1 or len(token) > 2:
            return None
        
        return token[1]
