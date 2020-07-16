from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import CustomUser


def validate_password(value):
    if len(value) < 8:
        raise serializers.ValidationError("Password should be at least 8 characters long.")

    has_alpha = False
    has_num = False
    has_special_char = False
    for char in value:
        if char.isalpha():
            has_alpha = True
        elif char.isdigit():
            has_num = True
        else:
            has_special_char = True

        if has_alpha and has_num and has_special_char:
            return

    raise serializers.ValidationError(
        "Password must have at least one alphabet letter, one special character and one number."
    )


class CustomUserSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=60,
        validators=[
            UniqueValidator(CustomUser.objects.all(), 'Username already exists, try another one.')
        ]
    )
    password = serializers.CharField(max_length=255, validators=[validate_password, ])

    def create(self, validated_data):
        usr = validated_data.get('username')
        psw = validated_data.get('password')

        user = CustomUser(username=usr)
        user.set_password(psw)
        user.save()
        return user

    def update(self, instance, validated_data):
        usr = validated_data.get('username')
        psw = validated_data.get('password')

        if usr:
            instance.username = usr
        if psw:
            instance.set_password(psw)
        instance.save()

        return instance
