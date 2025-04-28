from algopy import UInt64, gtxn
from algopy import ARC4Contract, arc4, Global, itxn, BoxMap


class TaskData(arc4.Struct, frozen=True):
    company: arc4.Address
    freelancer: arc4.Address
    reward: arc4.UInt64


class TaskBountyContract(ARC4Contract):

    def __init__(self) -> None:
        self.box_map_struct = BoxMap(arc4.UInt64, TaskData, key_prefix="users")

    @arc4.abimethod
    def create_task(
        self,
        payment_txn: gtxn.PaymentTransaction,
        task_id: arc4.UInt64,
        company: arc4.Address,
        freelancer: arc4.Address,
        reward: arc4.UInt64,
    ) -> None:
        # Check payment is in group txn 0
        # payment_txn = gtxn.PaymentTransaction(0)
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
