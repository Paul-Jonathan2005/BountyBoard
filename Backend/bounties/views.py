from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.decorators import api_view

from rest_framework import serializers

from user.models import MyUser
from user.serializers import BountyFreelancerSerializer
from .models import Bounties, BountyFreelancerMap, Chat_table, Request_table
from .serializers import (
    AcceptBountySerializer,
    GetBountySerializer,
    RequestBountySerializer,
    BountySerializer,
    CreateBountySerializer,
    MessageSerializer,
)

from datetime import date
from dateutil.relativedelta import relativedelta


@api_view(["GET"])
def bounty_types(request):
    task_types = Bounties.objects.values_list("task_type", flat=True).distinct()

    sort_by = request.GET.get("sort_by", "task_type")
    ordering = []
    if sort_by:
        ordering = [field.strip() for field in sort_by.split(",")]
    if ordering:
        task_types = task_types.order_by(*ordering)

    return Response({"task_types": task_types}, status.HTTP_200_OK)


@api_view(["GET"])
def get_bounties(request, task_type_value):
    data = request.data
    task_bounties = Bounties.objects.filter(task_type=task_type_value).filter(
        is_assigened=False
    )

    sort_by = request.GET.get("sort_by", "title")
    ordering = []
    if sort_by:
        ordering = [field.strip() for field in sort_by.split(",")]
    if ordering:
        task_bounties = task_bounties.order_by(*ordering)

    serializer = GetBountySerializer(instance=task_bounties, many=True)
    return Response({"bounties": serializer.data}, status.HTTP_200_OK)


@api_view(["POST"])
def request_bounty(request):
    data = request.data
    serializer = RequestBountySerializer(data=data)

    if not serializer.is_valid():
        return Response(
            {"status": False, "message": serializer.errors}, status.HTTP_400_BAD_REQUEST
        )

    serializer.save()

    return Response(
        {"status": True, "message": "Bounty Requested"}, status.HTTP_201_CREATED
    )


@api_view(["GET"])
def get_freelancer_bounties(request, freelancer_id, bounty_type):

    if not MyUser.objects.filter(is_client=False).filter(id=freelancer_id).exists():
        return Response(
            {"status": False, "message": "Invalid Freelancer ID"},
            status.HTTP_400_BAD_REQUEST,
        )

    freelancer_bounty_ids = BountyFreelancerMap.objects.filter(
        assigned_candidate_id=freelancer_id
    ).values_list("bounty_id", flat=True)
    freelancer_bounties = Bounties.objects.filter(id__in=freelancer_bounty_ids)

    if bounty_type == "INPROGRESS":
        freelancer_bounties = freelancer_bounties.filter(is_completed=False)
    elif bounty_type == "COMPLETED":
        freelancer_bounties = freelancer_bounties.filter(is_completed=True).filter(
            is_amount_transfered=False
        )
    elif bounty_type == "PAID":
        freelancer_bounties = freelancer_bounties.filter(is_completed=True).filter(
            is_amount_transfered=True
        )

    sort_by = request.GET.get("sort_by", "title")
    ordering = []
    if sort_by:
        ordering = [field.strip() for field in sort_by.split(",")]
    if ordering:
        freelancer_bounties = freelancer_bounties.order_by(*ordering)

    serializer = GetBountySerializer(instance=freelancer_bounties, many=True)

    return Response({"freelancer_bounties": serializer.data}, status.HTTP_200_OK)


class Bounty(APIView):

    def post(self, request):
        data = request.data
        serializer = CreateBountySerializer(data=data)

        if not serializer.is_valid():
            return Response(
                {"status": False, "message": serializer.errors},
                status.HTTP_400_BAD_REQUEST,
            )

        serializer.save()
        return Response(
            {
                "status": True,
                "message": "Bounty Created Successfullly",
            },
            status.HTTP_201_CREATED,
        )


@api_view(["GET"])
def get_client_bounties(request, client_id, bounty_type):

    client_bounties = Bounties.objects.filter(client_id=client_id)
    if bounty_type == "INPROGRESS":
        client_bounties = client_bounties.filter(is_completed=False)
    elif bounty_type == "COMPLETED":
        client_bounties = client_bounties.filter(is_completed=True).filter(
            is_amount_transfered=False
        )
    elif bounty_type == "PAID":
        client_bounties = client_bounties.filter(is_completed=True).filter(
            is_amount_transfered=True
        )

    sort_by = request.GET.get("sort_by", "title")
    ordering = []
    if sort_by:
        ordering = [field.strip() for field in sort_by.split(",")]
    if ordering:
        client_bounties = client_bounties.order_by(*ordering)

    serializer = BountySerializer(instance=client_bounties, many=True)

    return Response({"client_bounties": serializer.data}, status.HTTP_200_OK)


@api_view(["GET"])
def submit_bounty(request, bounty_id):
    bounty = Bounties.objects.get(id=bounty_id)
    bounty.is_completed = True
    bounty.save()

    return Response(
        {"status": True, "message": " Bounty Submitted Successfully"},
        status.HTTP_200_OK,
    )


@api_view(["GET"])
def transfer_amount(request, bounty_id):
    bounty = Bounties.objects.get(id=bounty_id)
    bounty.is_amount_transfered = True
    bounty.save()

    return Response(
        {"status": True, "message": " Amount Transfered Successfully "},
        status.HTTP_200_OK,
    )


@api_view(["GET"])
def get_bounties_request(request, bounty_id):

    if not Bounties.objects.filter(id=bounty_id).exists():
        return Response(
            {"status": False, "message": "Invalid Bounty ID"},
            status.HTTP_400_BAD_REQUEST,
        )

    bounties_request = Request_table.objects.filter(bounty_id=bounty_id).values_list(
        "requested_candidate_id", flat=True
    )
    freelancer_details = MyUser.objects.filter(id__in=bounties_request)
    serializer = BountyFreelancerSerializer(instance=freelancer_details, many=True)

    return Response({"client_bounties": serializer.data}, status.HTTP_200_OK)


class accept_bounty_request(APIView):

    def post(self, request):
        data = request.data
        serializer = AcceptBountySerializer(data=data)

        if not serializer.is_valid():
            return Response(
                {"status": False, "message": serializer.errors},
                status.HTTP_400_BAD_REQUEST,
            )

        serializer.save()
        # delete all the pending requested ID's
        Request_table.objects.filter(bounty_id=data["bounty_id"]).delete()

        bounty = Bounties.objects.get(id=data["bounty_id"])

        bounty.is_assigened = True
        # Set end_date using months instead of days
        bounty.start_date = date.today()
        bounty.end_date = date.today() + relativedelta(months=bounty.deadline)
        bounty.save()

        return Response(
            {
                "status": True,
                "message": "Bounty Accepted Successfullly",
            },
            status.HTTP_201_CREATED,
        )

class message(APIView):
    def post(self, request):
        data = request.data
        serializer = MessageSerializer(data=data)

        if not serializer.is_valid():
            return Response(
                {"status": False, "message": serializer.errors},
                status.HTTP_400_BAD_REQUEST,
            )

        serializer.save()
        return Response(
            {"status": True, "message": "Message sent successfully"},
            status.HTTP_201_CREATED,
        )
    
    def get(self, request, bounty_id):
        if not bounty_id:
            return Response(
                {"status": False, "message": "Bounty_id is Required"},
                status.HTTP_400_BAD_REQUEST,
            )
        message = Chat_table.objects.filter(bounty_id=bounty_id).order_by('id')
        serializers = MessageSerializer(message, many = True)
        return Response({"status": True, "chat": serializers.data}, status.HTTP_200_OK)