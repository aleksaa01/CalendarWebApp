from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import CalendarEventSerializer
from .models import CalendarEvent


def app_index(request):
    return render(request, "calendar.html")


class APIEventList(APIView):

    def get(self, request):
        events = CalendarEvent.objects.all()
        ser = CalendarEventSerializer(events, many=True)
        return Response(ser.data)

    def post(self, request):
        ser = CalendarEventSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save(user=request.user)

        x = 42
        return Response(ser.data, status=status.HTTP_201_CREATED)


class APIEventDetail(APIView):

    def get(self, request, pk):
        cal_event = CalendarEvent.get(pk=pk)
        ser = CalendarEventSerializer(cal_event)
        return Response(ser.data)

    def delete(self, request, pk):
        cal_event = CalendarEvent.objects.get(pk=pk)
        cal_event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk):
        cal_event = CalendarEvent(pk=pk)
        ser = CalendarEventSerializer(cal_event, data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save(user=request.user)
        return Response(status=status.HTTP_200_OK)
