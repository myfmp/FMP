from django.db import models
from django.utils import timezone


class Pins(models.Model):
  id = models.AutoField(primary_key=True)
  pin = models.CharField(max_length=7)


class Users(models.Model):
  id = models.AutoField(primary_key=True)
  username = models.CharField(max_length=25)
  mail = models.EmailField(max_length=256)
  password = models.CharField(max_length=256)
  faculty = models.CharField(max_length=256, default='none')
  year = models.CharField(max_length=256, default='none')
  creation_date = models.DateTimeField(default=timezone.now)
  verified = models.BooleanField(default=False)


class Vrequests(models.Model):
  id = models.AutoField(primary_key=True)
  mail = models.CharField(max_length=256)
  tmp = models.CharField(max_length=256)
  creation_date = models.DateTimeField(default=timezone.now)
  number_of_requests = models.IntegerField(default=1)

class FMP(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=256)
    description = models.CharField(max_length=256)

class Subjects(models.Model):
    id = models.AutoField(primary_key=True)
    subject = models.CharField(max_length=256)
    school_year = models.CharField(max_length=256)
    semester = models.CharField(max_length=256)
    key_words = models.CharField(max_length=256, default=None, null=True, blank=True)

class Main_Courses(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=256)
    school_year = models.CharField(max_length=256)
    semester = models.CharField(max_length=256)
    subject = models.CharField(max_length=256)
    key_words = models.CharField(max_length=256, default=None, null=True, blank=True)

class Files(models.Model):
    id = models.AutoField(primary_key=True)
    id_publisher = models.CharField(max_length=256)
    file_path = models.CharField(max_length=256)
    id_subject = models.CharField(max_length=256)
    id_courses = models.CharField(max_length=256)
    file_name = models.CharField(max_length=256)
    creation_date = models.DateTimeField(default=timezone.now)