from django.core.management.base import BaseCommand
from django.conf import settings
from sheduler_app.task import sync_discounts_from_api, cleanup_expired_discounts


class Command(BaseCommand):
    help = 'Test Celery tasks manually'

    def add_arguments(self, parser):
        parser.add_argument(
            '--task',
            type=str,
            choices=['sync', 'cleanup', 'both'],
            default='both',
            help='Which task to run'
        )
        parser.add_argument(
            '--sync',
            action='store_true',
            help='Run sync task synchronously (blocking)'
        )

    def handle(self, *args, **options):
        task = options['task']
        sync_mode = options['sync']
        
        # Show API configuration
        api_url = getattr(settings, 'EXTERNAL_API_BASE_URL', 'http://localhost:3000/api')
        self.stdout.write(f'API Endpoint: {api_url}/discounts')
        
        if task == 'sync' or task == 'both':
            self.stdout.write('Running sync_discounts_from_api task...')
            
            if sync_mode:
                # Run synchronously for immediate results
                self.stdout.write('Running synchronously...')
                result = sync_discounts_from_api()
                self.stdout.write(
                    self.style.SUCCESS(f'Sync completed: {result}')
                )
            else:
                # Run asynchronously
                result = sync_discounts_from_api.delay()
                self.stdout.write(
                    self.style.SUCCESS(f'Sync task started with ID: {result.id}')
                )
        
        if task == 'cleanup' or task == 'both':
            self.stdout.write('Running cleanup_expired_discounts task...')
            
            if sync_mode:
                # Run synchronously for immediate results
                self.stdout.write('Running synchronously...')
                result = cleanup_expired_discounts()
                self.stdout.write(
                    self.style.SUCCESS(f'Cleanup completed: {result}')
                )
            else:
                # Run asynchronously
                result = cleanup_expired_discounts.delay()
                self.stdout.write(
                    self.style.SUCCESS(f'Cleanup task started with ID: {result.id}')
                )
        
        if not sync_mode:
            self.stdout.write(
                self.style.SUCCESS('Tasks submitted successfully! Check Celery logs for results.')
            )
