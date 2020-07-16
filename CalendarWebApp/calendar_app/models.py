from django.db import models


class CalendarEvent(models.Model):
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    day = models.IntegerField()
    month = models.IntegerField()
    year = models.IntegerField()
    description = models.TextField()
