from django.urls import path
from . import views

app_name = 'core_app'

urlpatterns = [
    path('discounts/', views.active_discounts_view, name='active_discounts'),
    path('discounts-full/', views.active_discounts_full_view, name='active_discounts_full'),
    path('discounts-preview/', views.discounts_preview_view, name='discounts_preview'),
    path('discounts.css', views.discounts_css_view, name='discounts_css'),
    path('discounts-scoped.css', views.discounts_scoped_css_view, name='discounts_scoped_css'),
]
