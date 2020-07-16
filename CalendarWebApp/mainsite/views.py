from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.http import require_http_methods

from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from users.serializers import CustomUserSerializer

import json


@api_view(['POST'])
def register(request):
    ser = CustomUserSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    ser.save()

    return Response(status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login(request):
    token_ser = TokenObtainPairSerializer(data=request.data)
    token_ser.is_valid(raise_exception=True)

    context = {
        'jwt': token_ser.validated_data
    }

    return render(request, 'calendar.html', context=context)


def index(request):
    return render(request, 'index.html')
