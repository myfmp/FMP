import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from .models import Pins, Users, Vrequests
from django.utils import timezone
from datetime import timedelta

def Sendmail(user_mail, subject, html):
    mail = smtplib.SMTP('smtp.gmail.com', 587)
    mail.ehlo()
    mail.starttls()
    mail.login('myfmp2023@gmail.com', 'yjcp dhkc xfbt lqlj')
    # Print everything from a table
    admin = "FMP"
    user = user_mail
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = admin
    msg['To'] = user
    part = MIMEText(html, 'html')
    msg.attach(part)
    mail.sendmail(admin, user, msg.as_string())
    mail.quit()


def Resendmail(mail, subject, html):
    if Users.objects.filter(mail=mail).exists():
        last_request = Vrequests.objects.get(mail=mail)
        last_request_time = last_request.creation_date
        last_request_cooldown = last_request.number_of_requests
        if last_request_cooldown == 1:
          time_difference = timezone.now() - last_request_time
          if time_difference > timedelta(seconds=1):
            instance_to_update = Vrequests.objects.get(mail=mail)
            instance_to_update.number_of_requests = last_request_cooldown+1
            instance_to_update.save()
            Sendmail(mail,subject, html)
        else:
          time_difference = timezone.now() - last_request_time
          cool_down = last_request_cooldown*5
          if time_difference > timedelta(minutes=cool_down):
            instance_to_update = Vrequests.objects.get(mail=mail)
            instance_to_update.number_of_requests = last_request_cooldown+1
            instance_to_update.save()
            Sendmail(mail, subject, html)
      


  





