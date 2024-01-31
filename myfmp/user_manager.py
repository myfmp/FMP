from .models import Vrequests, Users
from django.contrib.auth.hashers import make_password

def change_password(pswd, mail):
    hashed_password = make_password(pswd)
    new_pswd = Users.objects.get(mail=mail)
    new_pswd.password = hashed_password
    new_pswd.save()
    last_request= Vrequests.objects.get(mail=mail)
    last_request.delete()

def change_username(new_username,req_id):
    new_usname = Users.objects.get(id=req_id)
    new_usname.username = new_username
    new_usname.save()