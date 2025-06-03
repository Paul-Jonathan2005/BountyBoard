from django.contrib.auth.models import AbstractUser
from django.db import models
from rest_framework import serializers
from django.contrib.auth.models import User


class MyUser(AbstractUser):

    is_client = models.BooleanField(default=False)
    user_role = models.CharField(null=True)
    phone_number = models.CharField(max_length=15, blank=True)
    company_name = models.CharField(max_length=100, blank=True)
    rating = models.FloatField(default=0.0)
    num_of_rating = models.IntegerField(default=0)
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, blank=True)
    linkedin_profile_link = models.TextField(blank=True)
