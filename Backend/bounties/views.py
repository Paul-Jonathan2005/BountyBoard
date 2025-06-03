from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.decorators import api_view

from rest_framework import serializers

from user.models import MyUser
from user.serializers import BountyFreelancerSerializer
from .models import Bounties, BountyFreelancerMap, Chat_table, Request_table, Dispute_messages_table, Voting_table
from .serializers import (
    AcceptBountySerializer,
    GetBountySerializer,
    RequestBountySerializer,
    BountySerializer,
    CreateBountySerializer,
    MessageSerializer,
    ComplaintSerializer,
    voteBountySerializer,
)

from datetime import date, timedelta, datetime
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

    sort_by = request.GET.get("sort_by", "-id")
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

    bounties_requests = Request_table.objects.filter(bounty_id=bounty_id)
    freelancer_address_map = {
        req.requested_candidate_id.id: req.candidate_pera_wallet_address for req in bounties_requests
    }
    bounty_request_ids = freelancer_address_map.keys()
    freelancer_details = MyUser.objects.filter(id__in=bounty_request_ids)
    serializer = BountyFreelancerSerializer(instance=freelancer_details, many=True)

    data_with_wallets = []
    for user in serializer.data:
        user_id = user["id"]
        user["wallet_address"] = freelancer_address_map.get(user_id, "")
        data_with_wallets.append(user)

    return Response({"requested_candidates": data_with_wallets}, status.HTTP_200_OK)


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
        message = Chat_table.objects.filter(bounty_id=bounty_id).order_by("id")
        serializers = MessageSerializer(message, many=True)
        user_ids = set([msg["user"] for msg in serializers.data])
        users = MyUser.objects.filter(id__in=user_ids)
        user_map = {user.id: user.username for user in users}
        
        enriched_messages = []
        for msg in serializers.data:
            msg["username"] = user_map.get(msg["user"], "Unknown")
            enriched_messages.append(msg)
            
        return Response({"status": True, "chat": enriched_messages}, status.HTTP_200_OK)


class Complaint_chat(APIView):
    def post(self, request):
        data = request.data
        serializer = ComplaintSerializer(data=data)

        if not serializer.is_valid():
            return Response(
                {"status": False, "message": serializer.errors},
                status.HTTP_400_BAD_REQUEST,
            )

        serializer.save()
        return Response(
            {"status": True, "message": "Complaint saved successfully"},
            status.HTTP_201_CREATED,
        )

    def get(self, request, bounty_id):
        if not bounty_id:
            return Response(
                {"status": False, "message": "Bounty_id is Required"},
                status.HTTP_400_BAD_REQUEST,
            )
        message = Dispute_messages_table.objects.filter(bounty_id=bounty_id).order_by("id")
        serializers = ComplaintSerializer(message, many=True)
        user_ids = set([msg["user"] for msg in serializers.data])
        users = MyUser.objects.filter(id__in=user_ids)
        user_map = {user.id: user.username for user in users}
        
        enriched_messages = []
        for msg in serializers.data:
            msg["username"] = user_map.get(msg["user"], "Unknown")
            enriched_messages.append(msg)
            
        return Response({"status": True, "complaint": enriched_messages}, status.HTTP_200_OK)


@api_view(["GET"])
def get_bounties_details(request, bounty_id, freelancer_id):
    bounty_details = Bounties.objects.get(id=bounty_id)
    serializer = BountySerializer(bounty_details, many = False)
    is_bounty_requested = (
        Request_table.objects.filter(bounty_id=bounty_id)
        .filter(requested_candidate_id=freelancer_id)
        .exists()
    )
    
    bounty_map = BountyFreelancerMap.objects.filter(bounty_id=bounty_id).first()
    assigned_candidate_id = bounty_map.assigned_candidate_id.id if bounty_map else None
    
    vote = Voting_table.objects.filter(bounty_id=bounty_id).filter(user=freelancer_id).first() 
    voted_for = vote.voted_for if vote else None
    bounty_details = {
        **serializer.data,
        "is_bounty_requested": is_bounty_requested,
        "assigned_candidate_id": assigned_candidate_id,
        "voted_for" : voted_for,
    }
    return Response(
        {"status": True, "bounty_details": bounty_details}, status.HTTP_200_OK
    )

@api_view(["POST"])
def accept_submission_link(request, bounty_id):
    data = request.data
    bounty = Bounties.objects.get(id=bounty_id)
    bounty.final_submission_link = data["finalSubmissionLink"]
    bounty.is_completed = True
    bounty.save()
    return Response(
            {
                "status": True,
                "message": "Final Submission Link Accepted Successfullly",
            },
            status.HTTP_201_CREATED,
        )

@api_view(["POST"])
def voting(request):
    data = request.data
    serializer = voteBountySerializer(data=data)

    if not serializer.is_valid():
        return Response(
            {"status": False, "message": serializer.errors},
            status.HTTP_400_BAD_REQUEST,
        )

    serializer.save()
    return Response(
        {
            "status": True,
            "message": "Vote Submitted Successfullly",
        },
        status.HTTP_201_CREATED,
    )
    
@api_view(["GET"])
def transfer_amount(request, bounty_id):
    bounty = Bounties.objects.get(id=bounty_id)
    bounty.is_amount_transfered = True
    bounty.save()
    return Response(
            {
                "status": True,
                "message": "Paid Successfullly",
            },
            status.HTTP_201_CREATED,
        )
    
@api_view(["GET"])
def raise_bounty_dispute(request, bounty_id):
    bounty = Bounties.objects.get(id=bounty_id)
    bounty.is_disputed = True
    bounty.dispute_end_data = (datetime.now() + timedelta(days=3)).isoformat()
    bounty.save()
    return Response(
            {
                "status": True,
                "message": "Dispute Raised Successfullly",
            },
            status.HTTP_201_CREATED,
        )
    
@api_view(["GET"])
def get_freelancer_requested_bounties(request, freelancer_id):
    requested_bounty_ids = Request_table.objects.filter(requested_candidate_id=freelancer_id).values_list("bounty_id", flat=True)
    requested_bounties = Bounties.objects.filter(id__in=requested_bounty_ids)
    serializer = BountySerializer(instance=requested_bounties, many=True)
    return Response(
            {
                "status": True,
                "requestedBounties": serializer.data,
            },
            status.HTTP_200_OK,
        )