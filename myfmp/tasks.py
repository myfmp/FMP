import schedule
import time as tm
import os
import sys
import django

# Add the path to your Django project
sys.path.append("C:\\MAMP\\htdocs\\FMP\\fmp")

# Set the Django project settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "fmp.settings")

# Initialize Django
django.setup()

# Now you can import and use your models
from myfmp.models import Users , Vrequests
from django.utils import timezone


def check_db():
    # Get the current time
    current_time = timezone.now()
    # Define your time limit (e.g., 7 days ago)
    time_limit = current_time - timezone.timedelta(days=5)
    # Query the rows that meet the deletion conditions
    rows_to_delete = Users.objects.filter(verified=False, creation_date__lt=time_limit)
    # Delete the rows
    rows_to_delete.delete()
    # Query the rows that meet the deletion conditions
    rows_to_delete_2 = Vrequests.objects.filter(creation_date__lt=time_limit)
    # Delete the rows
    rows_to_delete_2.delete()
    print('db cleared !')

schedule.every(24).hours.do(check_db)

while True:
    schedule.run_pending()
