from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.decorators import api_view

from rest_framework import serializers
from .models import Bounties
from .serializers import GetBountySerializer


@api_view(['GET' ])
def bounty_types(request):
    task_types = Bounties.objects.values_list('task_type', flat=True).distinct().order_by('task_type')
    return Response({'task_types': task_types},status.HTTP_200_OK)


@api_view(['GET'])
def get_bounties(request, task_type_value):
    data = request.data
    task_bounties = Bounties.objects.filter(task_type=task_type_value)
    serializer = GetBountySerializer(instance=task_bounties, many= True)
            
    return Response({
        'bounties' : serializer.data
    }, status.HTTP_200_OK)  