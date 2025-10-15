from django.db import models
from django.utils import timezone


class Discount(models.Model):
    """
    Model representing a discount from external API.
    Maps external API data structure to Django ORM.
    """
    external_id = models.IntegerField(unique=True, help_text="ID from external API")
    name = models.CharField(max_length=255, help_text="Discount name")
    percentage = models.DecimalField(max_digits=5, decimal_places=2, help_text="Discount percentage")
    description = models.TextField(blank=True, help_text="Discount description")
    valid_from = models.DateTimeField(help_text="Discount valid from date and time")
    valid_to = models.DateTimeField(help_text="Discount valid to date and time")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-valid_to']
        verbose_name = 'Discount'
        verbose_name_plural = 'Discounts'

    def __str__(self):
        return f"{self.name} ({self.percentage}%)"

    def is_active(self):
        """Check if discount is currently active"""
        now = timezone.now()
        return self.valid_from <= now <= self.valid_to

    @property
    def is_expired(self):
        """Check if discount has expired"""
        return timezone.now() > self.valid_to
