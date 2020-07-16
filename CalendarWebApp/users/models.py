from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class CustomUser(models.Model):
    username = models.CharField('username', max_length=60, unique=True)
    password = models.CharField('password', max_length=128)

    is_active = models.BooleanField(default=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

