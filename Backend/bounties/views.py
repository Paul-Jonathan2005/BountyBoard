from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import LoginSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

