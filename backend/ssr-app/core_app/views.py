from django.shortcuts import render
from django.utils import timezone
from django.http import JsonResponse, HttpResponse
from django.conf import settings
import os
from .models import Discount


def active_discounts_view(request):
    """
    Server Side Rendering view for displaying active discounts.
    Fetches and displays only currently valid discounts.
    """
    now = timezone.now()
    
    active_discounts = Discount.objects.filter(
        valid_from__lte=now,
        valid_to__gte=now
    ).order_by('-percentage')
    
    context = {
        'active_discounts': active_discounts,
        'total_discounts': active_discounts.count(),
        'current_time': now,
    }
    
    return render(request, 'core_app/discounts_list.html', context)


def active_discounts_full_view(request):
    """
    Full HTML page view for displaying active discounts with CSS.
    """
    now = timezone.now()
    
    active_discounts = Discount.objects.filter(
        valid_from__lte=now,
        valid_to__gte=now
    ).order_by('-percentage')
    
    context = {
        'active_discounts': active_discounts,
        'total_discounts': active_discounts.count(),
        'current_time': now,
    }
    
    return render(request, 'core_app/discounts_full.html', context)


def discounts_preview_view(request):
    """
    API endpoint for React integration.
    Returns active discounts data as JSON.
    """
    now = timezone.now()
    
    active_discounts = Discount.objects.filter(
        valid_from__lte=now,
        valid_to__gte=now
    ).order_by('-percentage')
    
    discounts_data = []
    for discount in active_discounts:
        discounts_data.append({
            'name': discount.name,
            'percentage': discount.percentage,
            'description': discount.description,
            'valid_to': discount.valid_to.strftime('%B %d, %Y at %H:%M'),
        })
    
    return JsonResponse({
        'total_discounts': active_discounts.count(),
        'current_time': now.strftime('%b %d, %Y %H:%M'),
        'active_discounts': discounts_data,
    })


def discounts_css_view(request):
    """
    Serves the discounts CSS file for React integration.
    """
    css_path = os.path.join(settings.BASE_DIR, 'core_app', 'static', 'css', 'discounts.css')
    
    try:
        with open(css_path, 'r', encoding='utf-8') as f:
            css_content = f.read()
        
        response = HttpResponse(css_content, content_type='text/css')
        response['Cache-Control'] = 'public, max-age=3600'  # Cache for 1 hour
        return response
    except FileNotFoundError:
        return HttpResponse('CSS file not found', status=404)


def discounts_scoped_css_view(request):
    """
    Serves the scoped discounts CSS file for React integration.
    """
    css_path = os.path.join(settings.BASE_DIR, 'core_app', 'static', 'css', 'discounts-scoped.css')
    
    try:
        with open(css_path, 'r', encoding='utf-8') as f:
            css_content = f.read()
        
        response = HttpResponse(css_content, content_type='text/css')
        response['Cache-Control'] = 'public, max-age=3600'  # Cache for 1 hour
        return response
    except FileNotFoundError:
        return HttpResponse('Scoped CSS file not found', status=404)
