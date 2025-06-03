from django.shortcuts import render
from rest_framework.views import APIView

from .models import MyUser
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    RatingSerializer,
    UserDetailSerializer,
    BountyFreelancerSerializer,
)
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework import serializers
from rest_framework.authentication import BasicAuthentication
from rest_framework.decorators import api_view


class RegisterPerson(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        serializer = RegisterSerializer(data=data)

        if not serializer.is_valid():
            return Response(
                {"status": False, "message": serializer.errors},
                status.HTTP_400_BAD_REQUEST,
            )

        serializer.save()

        return Response(
            {"status": True, "message": "User Created"}, status.HTTP_201_CREATED
        )


class LoginPerson(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        serializer = LoginSerializer(data=data)

        if not serializer.is_valid():
            return Response(
                {"status": False, "message": serializer.errors},
                status.HTTP_400_BAD_REQUEST,
            )

        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)
        user = MyUser.objects.filter(username=data["username"]).first()
        user_id = user.id
        user_role = user.user_role

        return Response(
            {
                "status": True,
                "message": "Login Successful",
                "token": str(token),
                "user_id": user_id,
                "user_role": user_role,
            },
            status.HTTP_202_ACCEPTED,
        )


class LogoutPerson(APIView):

    def post(self, request):
        request.user.auth_token.delete()
        return Response(
            {"status": True, "message": "Logout successful"}, status=status.HTTP_200_OK
        )


@api_view(["POST"])
def freelancer_rating(request):
    data = request.data
    serializer = RatingSerializer(data=data)

    if not serializer.is_valid():
        return Response(
            {"status": False, "message": serializer.errors},
            status.HTTP_400_BAD_REQUEST,
        )
    serializer.save()

    return Response(
        {"status": True, "message": "Rated Successful"}, status.HTTP_201_CREATED
    )


@api_view(["GET"])
def user_detail(request, username):

    serializer = UserDetailSerializer(data={"username": username})

    if not serializer.is_valid():
        return Response(
            {"status": False, "message": serializer.errors},
            status.HTTP_400_BAD_REQUEST,
        )
    user_details = MyUser.objects.filter(username=username).first()
    serializer = BountyFreelancerSerializer(instance=user_details, many=False)

    return Response({"user_details": serializer.data}, status.HTTP_200_OK)
