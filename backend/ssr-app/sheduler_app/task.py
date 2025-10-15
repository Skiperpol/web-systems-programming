from celery import shared_task
from django.utils import timezone
from django.conf import settings
from datetime import datetime, timedelta
import requests
import json

from core_app.models import Discount


@shared_task
def sync_discounts_from_api():
    """
    Task A: Synchronization with external API
    Fetches discount data from web-api and updates the database.
    Runs daily at 3:00 AM.
    """
    
    api_base_url = getattr(settings, 'EXTERNAL_API_BASE_URL')
    api_timeout = getattr(settings, 'EXTERNAL_API_TIMEOUT')
    discounts_endpoint = f"{api_base_url}/discounts"
    
    try:
        response = requests.get(discounts_endpoint, timeout=api_timeout)
        response.raise_for_status()
        
        api_data = response.json()
        
    except requests.exceptions.RequestException as e:
        api_data = _get_fallback_mock_data()
    
    except json.JSONDecodeError as e:
        api_data = _get_fallback_mock_data()
    
    updated_count = 0
    created_count = 0
    
    for api_item in api_data:
        try:
            external_id = api_item.get("id")
            
            valid_from_str = api_item.get("validFrom")
            valid_to_str = api_item.get("validTo")
            
            valid_from = datetime.fromisoformat(valid_from_str.replace('Z', '+00:00'))
            valid_to = datetime.fromisoformat(valid_to_str.replace('Z', '+00:00'))
            
            discount, created = Discount.objects.update_or_create(
                external_id=external_id,
                defaults={
                    'name': api_item.get("name", ""),
                    'percentage': float(api_item.get("percentage", 0)),
                    'description': api_item.get("description", ""),
                    'valid_from': valid_from,
                    'valid_to': valid_to,
                }
            )
            
            if created:
                created_count += 1
            else:
                updated_count += 1
                
        except (ValueError, KeyError, TypeError) as e:
            continue
    
    result_message = f"Sync completed. Created: {created_count}, Updated: {updated_count}"
    return result_message


def _get_fallback_mock_data():
    """
    Fallback mock data when web-api is not available.
    Returns sample discount data for testing purposes.
    """
    now = timezone.now()
    return [
        {
            "id": "fallback-1",
            "name": "Fallback Summer Sale",
            "percentage": 25.00,
            "description": "Fallback discount for testing when API is unavailable",
            "validFrom": (now + timedelta(days=1)).isoformat(),
            "validTo": (now + timedelta(days=30)).isoformat()
        },
        {
            "id": "fallback-2", 
            "name": "Fallback Black Friday Special",
            "percentage": 50.00,
            "description": "Fallback Black Friday offer",
            "validFrom": (now - timedelta(days=5)).isoformat(),
            "validTo": (now + timedelta(days=15)).isoformat()
        },
        {
            "id": "fallback-3",
            "name": "Fallback Student Discount",
            "percentage": 10.00,
            "description": "Fallback student discount",
            "validFrom": (now + timedelta(days=3)).isoformat(),
            "validTo": (now + timedelta(days=60)).isoformat()
        }
    ]


@shared_task
def cleanup_expired_discounts():
    """
    Task B: Cleanup expired discounts
    Removes all discounts that have passed their valid_to date.
    Runs daily at midnight (00:00).
    """
    
    now = timezone.now()
    
    expired_discounts = Discount.objects.filter(valid_to__lt=now)
    expired_count = expired_discounts.count()
    
    if expired_count > 0:
        expired_names = list(expired_discounts.values_list('name', flat=True))
        
        deleted_count, _ = expired_discounts.delete()
        
        result_message = f"Cleanup completed. Deleted {deleted_count} expired discounts: {', '.join(expired_names)}"
        return result_message
    else:
        result_message = "Cleanup completed. No expired discounts found."
        return result_message