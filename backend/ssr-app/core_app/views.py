from django.shortcuts import render
from django.utils import timezone
from django.http import JsonResponse
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
