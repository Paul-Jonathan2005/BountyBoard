from django.db import models
from rest_framework import serializers

from user.models import MyUser

class Bounties(models.Model):
    
    title = models.CharField()
    descrition = models.TextField()
    deadline = models.CharField()
    amount = models.IntegerField()
    task_type = models.CharField()
    is_selected = models.BooleanField(default=False)
    end_date = models.DateField(null = True)
    start_date = models.DateField(null = True)
    status = models.CharField(default = 'UNASSIGNED')

    
class BountyFreelancerMap(models.Model):
    
    bounty_id = models.ForeignKey(Bounties, on_delete=models.CASCADE)
    assigned_candidate_id = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    
    
class Request_table(models.Model):
    
    bounty_id = models.ForeignKey(Bounties, on_delete=models.CASCADE)
    requested_candidate_id = models.ForeignKey(MyUser, on_delete=models.CASCADE)


class Chat_table(models.Model):
    
    bounty_id = models.ForeignKey(Bounties, on_delete=models.CASCADE)
    assigned_candidate_id = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name="assigned_chats")
    client_id = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name="client_chats")
    message = models.TextField()
    msg_order = models.IntegerField()