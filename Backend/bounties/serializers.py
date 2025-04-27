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
        
class CreateBountySerializer(serializers.ModelSerializer):
    class Meta:
        model = Bounties
        fields = ['title','descrition','deadline','amount', 'task_type']
        
    
    def validate(self, data):
        if not data['amount'] > 0:
            raise serializers.ValidationError('Invalid Amount')
        
        if data['deadline'] < 0:
            raise serializers.ValidationError('Invalid DeadLine')
        
        return data
    
    def create(self, validated_data):
        bounty = Bounties(
            title = str(validated_data['title']).title(),
            descrition = str(validated_data['descrition']).title(),
            deadline = validated_data['deadline'],
            amount = validated_data['amount'],
            task_type = str(validated_data['task_type']).upper(),
        )
        bounty.save()
        return validated_data
        
        

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
        
    
                
            