from django.contrib import admin
from .models import Pins, Users, Vrequests, FMP, Subjects, Main_Courses, Files
# Register your models here.

admin.site.register(Pins)
admin.site.register(Users)
admin.site.register(Vrequests)
admin.site.register(FMP)
admin.site.register(Subjects)
admin.site.register(Main_Courses)
admin.site.register(Files)