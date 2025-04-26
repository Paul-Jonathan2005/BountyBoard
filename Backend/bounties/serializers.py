from rest_framework import serializers

from user.models import MyUser
from .models import Bounties, Request_table, Chat_table


class GetBountySerializer(serializers.ModelSerializer):
    class Meta:
        model = Bounties
        fields = ['title','descrition','deadline','amount', 'status', 'id']
        
class BountySerializer(serializers.ModelSerializer):
    class Meta:
        model = Bounties
        fields = '__all__'

class RequestBountySerializer(serializers.ModelSerializer):
    class Meta:
        model = Request_table
        fields = '__all__'
        
    def validate(self, data):
        
        if data['bounty_id']:            
            if not Bounties.objects.filter(id = data['bounty_id'].id).filter(is_selected = False).exists():
                raise serializers.ValidationError(" Bounty Already Selected")
        
        if data['requested_candidate_id']:
            if  Request_table.objects.filter(bounty_id = data['bounty_id'].id).filter(requested_candidate_id = data['requested_candidate_id']).exists():
                raise serializers.ValidationError('Request already Submitted')
        return data
        
                
            