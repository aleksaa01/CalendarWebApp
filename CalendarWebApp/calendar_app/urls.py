from django.urls import path
from . import views


urlpatterns = [
    path('', views.app_index, name='app-index'),
    path('event/', views.APIEventList.as_view(), name='event-list'),
    path('event/<int:pk>', views.APIEventDetail.as_view(), name='event-detail'),
]