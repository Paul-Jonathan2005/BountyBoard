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
    voters: arc4.DynamicArray[arc4.Address]
    reward: arc4.UInt64
    client_amount_transferred: arc4.Bool
    freelancer_amount_transferred: arc4.Bool


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
        assert payment_txn.amount >= reward.native
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
        assert task_id not in self.dispute_box
        self.dispute_box[task_id] = DisputeData(
            freelancer_votes=arc4.UInt64(0),
            company_votes=arc4.UInt64(0),
            is_open=arc4.Bool(True),
            voters=arc4.DynamicArray[arc4.Address](),
            reward=task_data.reward,
            client_amount_transferred=arc4.Bool(False),
            freelancer_amount_transferred=arc4.Bool(False),
        )

    @arc4.abimethod
    def cast_vote(
        self, task_id: arc4.UInt64, vote_for_freelancer: arc4.Bool, caller: arc4.Address
    ) -> None:
        dispute = self.dispute_box[task_id].copy()
        assert dispute.is_open
        # assert caller not in dispute.voters, "Already Voted"
        found = False
        for voter in dispute.voters:
            if caller == voter:
                found = True
                break
        assert not found, "Already voted"
        if vote_for_freelancer:
            dispute.freelancer_votes = arc4.UInt64(dispute.freelancer_votes.native + 1)
        else:
            dispute.company_votes = arc4.UInt64(dispute.company_votes.native + 1)
        found = False
        for voter in dispute.voters:
            if caller == voter:
                found = True
                break
        if not found:
            dispute.voters.append(caller)
        self.dispute_box[task_id] = dispute.copy()

    @arc4.abimethod
    def resolve_dispute(self, task_id: arc4.UInt64, caller: arc4.Address) -> UInt64:
        task_data = self.box_map_struct[task_id]
        dispute = self.dispute_box[task_id].copy()
        assert dispute.is_open
        
        if dispute.voters.length != 0:
            voter_reward_pool = arc4.UInt64(dispute.reward.native // 10)
        else:
            voter_reward_pool = arc4.UInt64(0)
            
        reward_to_winner = arc4.UInt64(dispute.reward.native - voter_reward_pool.native)

        if dispute.freelancer_votes.native > dispute.company_votes.native:
            result = itxn.Payment(
                sender=Global.current_application_address,
                receiver=task_data.freelancer.native,
                amount=reward_to_winner.native,
                fee=0,
            ).submit()
            dispute.client_amount_transferred = arc4.Bool(True)
            dispute.freelancer_amount_transferred = arc4.Bool(True)

        elif dispute.freelancer_votes.native < dispute.company_votes.native:
            result = itxn.Payment(
                sender=Global.current_application_address,
                receiver=task_data.company.native,
                amount=reward_to_winner.native,
                fee=0,
            ).submit()
            dispute.client_amount_transferred = arc4.Bool(True)
            dispute.freelancer_amount_transferred = arc4.Bool(True)

        else:
            assert caller == task_data.company or caller == task_data.freelancer

            if caller == task_data.company:
                dispute.client_amount_transferred = arc4.Bool(True)
            elif caller == task_data.freelancer:
                dispute.freelancer_amount_transferred = arc4.Bool(True)

            reward_to_winner = arc4.UInt64(reward_to_winner.native // 2)
            result = itxn.Payment(
                sender=Global.current_application_address,
                receiver=caller.native,
                amount=reward_to_winner.native,
                fee=0,
            ).submit()
        if dispute.freelancer_amount_transferred and dispute.client_amount_transferred:
            del self.box_map_struct[task_id]
            dispute.is_open = arc4.Bool(False)
        self.dispute_box[task_id] = dispute.copy()

        return result.amount

    @arc4.abimethod
    def claim_voting_reward(self, task_id: arc4.UInt64, caller: arc4.Address) -> UInt64:
        dispute = self.dispute_box[task_id].copy()
        voters = dispute.voters.copy()
        new_voters = arc4.DynamicArray[arc4.Address]()
        found = False
        for voter in voters:
            if voter != caller:
                new_voters.append(voter)
            else:
                found = True
        assert found, "Voter Not Found"

        dispute.voters = new_voters.copy()

        total_reward = arc4.UInt64(dispute.reward.native // 10)
        share = arc4.UInt64(total_reward.native // (voters.length))

        result = itxn.Payment(
            sender=Global.current_application_address,
            receiver=caller.native,
            amount=share.native,
            fee=0,
        ).submit()

        if new_voters.length == 0:
            del self.dispute_box[task_id]
        else:
            self.dispute_box[task_id] = dispute.copy()

        return result.amount
