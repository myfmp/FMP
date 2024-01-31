# Generated by Django 5.0 on 2024-01-20 11:05

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Files',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('id_publisher', models.CharField(max_length=256)),
                ('file_path', models.CharField(max_length=256)),
                ('id_subject', models.CharField(max_length=256)),
                ('id_course', models.CharField(max_length=256)),
                ('file_name', models.CharField(max_length=256)),
                ('creation_date', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='FMP',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='Main_Courses',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=256)),
                ('school_year', models.CharField(max_length=256)),
                ('semester', models.CharField(max_length=256)),
                ('subject', models.CharField(max_length=256)),
                ('key_words', models.CharField(blank=True, default=None, max_length=256, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Pins',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('pin', models.CharField(max_length=7)),
            ],
        ),
        migrations.CreateModel(
            name='Subjects',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('subject', models.CharField(max_length=256)),
                ('school_year', models.CharField(max_length=256)),
                ('semester', models.CharField(max_length=256)),
                ('key_words', models.CharField(blank=True, default=None, max_length=256, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Users',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=25)),
                ('mail', models.EmailField(max_length=256)),
                ('password', models.CharField(max_length=256)),
                ('faculty', models.CharField(default='none', max_length=256)),
                ('year', models.CharField(default='none', max_length=256)),
                ('creation_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('verified', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Vrequests',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('mail', models.CharField(max_length=256)),
                ('tmp', models.CharField(max_length=256)),
                ('creation_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('number_of_requests', models.IntegerField(default=1)),
            ],
        ),
    ]