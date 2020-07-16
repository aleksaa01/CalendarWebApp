from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.exceptions import AuthenticationFailed, InvalidToken

from .models import CustomUser


class CustomJWTAuthentication(JWTAuthentication):
    """
    JWTAuthentication is using Django User model as default. Kinda weird because they are using
    authenticate backend in their serializer but not in JWTAuthentication, where they use AUTH_USER_MODEL.
    The easiest way to make this work is to inherit JWTAuthentication, override get_user method
    and make it use CustomUser instead.
    """

    def get_user(self, validated_token):
        try:
            user_id = validated_token[api_settings.USER_ID_CLAIM]
        except KeyError:
            raise InvalidToken('Token contained no recognizable user identification')

        try:
            user = CustomUser.objects.get(**{api_settings.USER_ID_FIELD: user_id})
        except CustomUser.DoesNotExist:
            raise AuthenticationFailed('User not found', code='user_not_found')

        if not user.is_active:
            raise AuthenticationFailed('User is inactive', code='user_inactive')

        return user
