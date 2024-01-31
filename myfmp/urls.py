from django.urls import path
from . import views

urlpatterns = [
    path("",views.index, name="index"),
    path("register/",views.register, name="register"),
    path("back_up/",views.back_up, name="back_up"),
    path("authenticator/",views.authenticator, name="authenticator"),
    path("mailer/",views.mailer, name="mailer"),
    path("recovery/",views.recovery, name="recovery"),
    path("logout/",views.logout, name="logout"),
    path("main/",views.main, name="main"),
]