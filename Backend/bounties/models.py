from django.db import models
from rest_framework import serializers

class Bounties(models.Model):
    
    tilte = models.CharField()
    descrition = models.TextField()
    deadline = models.CharField()
    amount = models.IntegerField()
    task_type = models.CharField()
    end_date = models.DateField()
    is_selected = models.BooleanField(default=False)
    assigned_candidate_id = models.IntegerField()
    status = models.IntegerField()
    
class Request_table(models.Model):
    
    bounty_id = models.IntegerField()
    requested_candidate_id =  models.IntegerField()
    

class Chat_table(models.Model):
    
    bounty_id = models.IntegerField()
    assigned_candidate_id = models.IntegerField()
    client_id = models.IntegerField()
    message = models.TextField()
    msg_order = models.IntegerField()