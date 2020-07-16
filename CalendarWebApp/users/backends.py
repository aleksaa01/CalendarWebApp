from .models import CustomUser


class CustomUserBackend:

    def authenticate(self, request, username=None, password=None):
        try:
            user = CustomUser.objects.get(username=username)
            if not user.check_password(password):
                return None
            return user
        except CustomUser.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return None