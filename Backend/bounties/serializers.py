from rest_framework import serializers

from user.models import MyUser
from .models import Bounties, Request_table, Chat_table, BountyFreelancerMap


class GetBountySerializer(serializers.ModelSerializer):
    class Meta:
        model = Bounties
        fields = ["title", "descrition", "deadline", "amount", "status", "id"]


class BountySerializer(serializers.ModelSerializer):
    class Meta:
        model = Bounties
        fields = "__all__"


class CreateBountySerializer(serializers.ModelSerializer):
    class Meta:
        model = Bounties
        fields = ["title", "descrition", "deadline", "amount", "task_type", "client_id"]

    def validate(self, data):
        if not data["amount"] > 0:
            raise serializers.ValidationError("Invalid Amount")

        if data["deadline"] < 0:
            raise serializers.ValidationError("Invalid DeadLine")

        if data["client_id"]:
            if (
                not MyUser.objects.filter(is_client=True)
                .filter(id=data["client_id"].id)
                .exists()
            ):
                raise serializers.ValidationError("Invalid Client ID")

        return data

    def create(self, validated_data):
        bounty = Bounties(
            title=str(validated_data["title"]).title(),
            descrition=str(validated_data["descrition"]).title(),
            deadline=validated_data["deadline"],
            amount=validated_data["amount"],
            task_type=str(validated_data["task_type"]).upper(),
            client_id=validated_data["client_id"],
        )
        bounty.save()
        return validated_data


class RequestBountySerializer(serializers.ModelSerializer):
    class Meta:
        model = Request_table
        fields = "__all__"

    def validate(self, data):

        if data["bounty_id"]:
            if (
                not Bounties.objects.filter(id=data["bounty_id"].id)
                .filter(is_assigened=False)
                .exists()
            ):
                raise serializers.ValidationError(" Bounty Already Selected")

        if data["requested_candidate_id"]:

            if (
                not MyUser.objects.filter(is_client=False)
                .filter(id=data["requested_candidate_id"].id)
                .exists()
            ):
                raise serializers.ValidationError("Invalid Freelancer ID")

            if (
                Request_table.objects.filter(bounty_id=data["bounty_id"].id)
                .filter(requested_candidate_id=data["requested_candidate_id"])
                .exists()
            ):
                raise serializers.ValidationError("Request already Submitted")
        return data


class AcceptBountySerializer(serializers.ModelSerializer):
    class Meta:
        model = Request_table
        fields = "__all__"

    def validate(self, data):

        if data["bounty_id"]:
            if (
                not Bounties.objects.filter(id=data["bounty_id"].id)
                .filter(is_assigened=False)
                .exists()
            ):
                raise serializers.ValidationError(" Bounty Already Selected")

        if data["requested_candidate_id"]:

            if (
                not MyUser.objects.filter(is_client=False)
                .filter(id=data["requested_candidate_id"].id)
                .exists()
            ):
                raise serializers.ValidationError("Invalid Freelancer ID")

            if (
                not Request_table.objects.filter(bounty_id=data["bounty_id"].id)
                .filter(requested_candidate_id=data["requested_candidate_id"])
                .exists()
            ):
                raise serializers.ValidationError("Request Not Found")
        return data

    def create(self, validated_data):
        bounty_freelancer_map = BountyFreelancerMap(
            bounty_id=validated_data["bounty_id"],
            assigned_candidate_id=validated_data["requested_candidate_id"],
        )
        bounty_freelancer_map.save()
        return validated_data
