from algopy import UInt64, gtxn
from algopy import ARC4Contract, arc4, Global, itxn, BoxMap


class TaskData(arc4.Struct, frozen=True):
    company: arc4.Address
    freelancer: arc4.Address
    reward: arc4.UInt64


class DisputeData(arc4.Struct, frozen=False):
    freelancer_votes: arc4.UInt64
    company_votes: arc4.UInt64
    is_open: arc4.Bool


class TaskBountyContract(ARC4Contract):

    def __init__(self) -> None:
        self.box_map_struct = BoxMap(arc4.UInt64, TaskData, key_prefix="users")
        self.dispute_box = BoxMap(arc4.UInt64, DisputeData, key_prefix="disputes")

    @arc4.abimethod
    def create_task(
        self,
        payment_txn: gtxn.PaymentTransaction,
        task_id: arc4.UInt64,
        company: arc4.Address,
        freelancer: arc4.Address,
        reward: arc4.UInt64,
    ) -> None:
        assert payment_txn.receiver == Global.current_application_address
        assert payment_txn.amount == reward.native
        assert payment_txn.sender == company.native

        # Save task data in a box
        task_data = TaskData(
            company=company,
            freelancer=freelancer,
            reward=reward,
        )
        self.box_map_struct[task_id] = task_data

    @arc4.abimethod
    def release_reward(self, task_id: arc4.UInt64, caller: arc4.Address) -> UInt64:
        task_data = self.box_map_struct[task_id]
        assert caller == task_data.company, "Only company can release"

        result = itxn.Payment(
            sender=Global.current_application_address,
            receiver=task_data.freelancer.native,
            amount=task_data.reward.native,
            fee=0,
        ).submit()

        # Optionally delete the task box
        del self.box_map_struct[task_id]

        return result.amount

    @arc4.abimethod
    def start_appeal(self, task_id: arc4.UInt64, caller: arc4.Address) -> None:
        task_data = self.box_map_struct[task_id]
        assert caller == task_data.company or caller == task_data.freelancer
        assert not self.dispute_box.exists(task_id)
        self.dispute_box[task_id] = DisputeData(
            freelancer_votes=arc4.UInt64(0), company_votes=arc4.UInt64(0), is_open=True
        )

    @arc4.abimethod
    def cast_vote(self, task_id: arc4.UInt64, vote_for_freelancer: arc4.Bool) -> None:
        dispute = self.dispute_box[task_id]
        assert dispute.is_open
        if vote_for_freelancer:
            dispute.freelancer_votes += arc4.UInt64(1)
        else:
            dispute.company_votes += arc4.UInt64(1)
        self.dispute_box[task_id] = dispute
