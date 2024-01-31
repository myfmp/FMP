import secrets
import string
from .models import Pins, Users, Vrequests
from django.contrib.auth.hashers import make_password, check_password

def generate_tmp(length):
    characters = string.ascii_letters + string.digits
    random_string = ''.join(secrets.choice(characters) for _ in range(length))
    return random_string

def authenticate(tmp, uni , year):
    if Vrequests.objects.filter(tmp=tmp).exists():
        Request = Vrequests.objects.get(tmp=tmp)
        if Users.objects.filter(mail=Request.mail, verified = False).exists():
            User_to_verify = Users.objects.get(mail=Request.mail, verified = False)
            User_to_verify.faculty = uni
            User_to_verify.year = year
            User_to_verify.verified = True
            User_to_verify.save()
            Vrequests.objects.filter(tmp=tmp).delete()

def  login(mail, password):
    # Retrieve the user based on email
    user = Users.objects.filter(mail=mail).first()
    # Check if the user exists and the password matches
    if user and check_password(password, user.password):
        response_data = {'success': 'User is verified'}
        if user.verified:
            return True
        else:
            return False

            

