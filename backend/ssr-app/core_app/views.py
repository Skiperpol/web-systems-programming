from django.shortcuts import render
from django.utils import timezone
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
