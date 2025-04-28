from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.decorators import api_view

from rest_framework import serializers
from .models import Bounties, BountyFreelancerMap
from .serializers import GetBountySerializer, RequestBountySerializer, BountySerializer, CreateBountySerializer


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
    
    
@api_view(['POST'])
def request_bounty(request):
    data = request.data
    serializer = RequestBountySerializer(data=data)
    
    if not serializer.is_valid():
        return Response({
            'status': False,
            'message': serializer.errors
        }, status.HTTP_400_BAD_REQUEST)
        
    serializer.save()
    
    return Response({
        'status': True,
        'message': 'Bounty Requested'
    }, status.HTTP_201_CREATED)
    
    
@api_view(['GET'])
def get_freelancer_bounties(request, freelancer_id):
   freelancer_bounty_ids = BountyFreelancerMap.objects.filter(assigned_candidate_id = freelancer_id).values_list('bounty_id', flat=True)
   freelancer_bounties = Bounties.objects.filter(id__in= freelancer_bounty_ids)
   serializer = GetBountySerializer(instance=freelancer_bounties, many= True)
   
   return Response({
        'freelancer_bounties' : serializer.data
    }, status.HTTP_200_OK)
   
   
class Bounty(APIView):
    
    def post(self, request):
        data = request.data
        serializer = CreateBountySerializer(data=data)
        
        if not serializer.is_valid():
            return Response({
                'status': False,
                'message': serializer.errors
            }, status.HTTP_400_BAD_REQUEST)
            
        serializer.save()
        return Response({
            'status' : True,
            'message' : 'Bounty Created Successfullly',
            
        }, status.HTTP_201_CREATED)
        
@api_view(['GET'])
def get_client_bounties(request, client_id):
   client_bounties = Bounties.objects.filter(client_id = client_id)
   serializer = BountySerializer(instance=client_bounties, many = True)
   
   return Response({
        'client_bounties' : serializer.data
    }, status.HTTP_200_OK)