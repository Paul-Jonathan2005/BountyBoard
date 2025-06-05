from django.db import models
from rest_framework import serializers

from user.models import MyUser


class Bounties(models.Model):

    title = models.CharField()
    descrition = models.TextField()
    deadline = models.IntegerField()
    amount = models.IntegerField()
    task_type = models.CharField()
    is_assigened = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    is_amount_transfered = models.BooleanField(default=False)
    is_client_amount_transfered = models.BooleanField(default=False)
    end_date = models.DateField(null=True)
    start_date = models.DateField(null=True)
    status = models.IntegerField(default=0)
    client_id = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    final_submission_link = models.URLField(null=True)
    is_disputed = models.BooleanField(default=False, null=True)
    dispute_end_date = models.DateTimeField(null=True)


class BountyFreelancerMap(models.Model):

    bounty_id = models.ForeignKey(Bounties, on_delete=models.CASCADE)
    assigned_candidate_id = models.ForeignKey(MyUser, on_delete=models.CASCADE)


class Request_table(models.Model):

    bounty_id = models.ForeignKey(Bounties, on_delete=models.CASCADE)
    requested_candidate_id = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    candidate_pera_wallet_address = models.TextField(null=True)


class Chat_table(models.Model):

    bounty_id = models.ForeignKey(Bounties, on_delete=models.CASCADE)
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    message = models.TextField()
    created_time = models.DateTimeField()


class Dispute_messages_table(models.Model):

    bounty_id = models.ForeignKey(Bounties, on_delete=models.CASCADE)
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    message = models.TextField()
    created_time = models.DateTimeField()


class Voting_table(models.Model):

    bounty_id = models.ForeignKey(Bounties, on_delete=models.CASCADE)
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    voted_for = models.TextField(null=True)
