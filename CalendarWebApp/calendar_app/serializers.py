from rest_framework import serializers

from .models import CalendarEvent


class CalendarEventSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='pk', read_only=True)

    class Meta:
        model = CalendarEvent
        fields = ['id', 'year', 'month', 'day', 'description']
        read_only_fields = ['id']
