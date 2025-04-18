from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework import serializers

class RegisterPerson(APIView):
    
    def post(self, request):
        data = request.data
        serializer = RegisterSerializer(data=data)
        
        if not serializer.is_valid():
            return Response({
                'status': False,
                'message': serializer.error_messages
            }, status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        
        return Response({
            'status': True,
            'message': 'User Created'
        }, status.HTTP_201_CREATED)
        
        
class LoginPerson(APIView):
    
    def post(self, request):
        data = request.data
        serializer = LoginSerializer(data=data)
        
        if not serializer.is_valid():
            return Response({
                'status': False,
                'message': 'UserName or Password is incorrect'
            }, status.HTTP_400_BAD_REQUEST)
            
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        
        return Response({
            'status': True,
            'message': 'Login Succeful',
            'token': str(token),
            
        }, status.HTTP_202_ACCEPTED)


class LogoutPerson(APIView):

    def post(self, request):
        request.user.auth_token.delete() 
        return Response({
            'status': True,
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)