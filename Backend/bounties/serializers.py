from rest_framework import serializers
from .models import Bounties, Request_table, Chat_table


class GetBountySerializer(serializers.ModelSerializer):
    class Meta:
        model = Bounties
        fields = ['title','descrition','deadline','amount', 'status', 'id']

            