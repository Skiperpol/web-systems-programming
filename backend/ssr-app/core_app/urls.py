from django.urls import path
from . import views

app_name = 'core_app'

urlpatterns = [
    path('discounts/', views.active_discounts_view, name='active_discounts'),
]
