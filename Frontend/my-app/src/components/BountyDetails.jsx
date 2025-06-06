import React, { useEffect, useState, useRef } from 'react';
import Loader from '../assets/loader2.png'; 
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
dayjs.extend(utc);
dayjs.extend(duration);
import { fetchBountyDetails, fetchBountyRequests, transferAmount, raiseDispute, fetchComplaints, sendVote, deleteVote, transferDirectlyAmount} from '../services/api';
import { href, useParams } from 'react-router-dom';
import '../css/BountyDetails.css'
import Alert from '../components/Alert';
import extractErrorMessage from '../utils/extractErrorMessage';
import { useNavigate } from 'react-router-dom';
import {sendBountyRequest, 
        fetchMessages, 
        postChatMessage, 
        postFinalSubmissionLink, 
        transferAlgosToFreelancer, 
        startDisputeSmartContract, 
        postComplaintMessage, 
        votingSmartContract,
        claimRewardSmartContract,
        voterClaimRewardSmartContract,
      } 
        from '../services/api';
import CandidateTileList from './CandidateTileList';
import MessageTileList from './MessageTileList';
import algosdk from 'algosdk';
import { useWallet } from '@txnlab/use-wallet-react';


export default function BountyDetails(){
    const { viewerType, bountyId } = useParams();
    const UserId = parseInt(localStorage.getItem("userId"), 10);
    const [bountyDetails, setBountyDetails] = useState([]);
    const [bountyRequests, setBountyRequests] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [complaintMessages, setComplaintMessages] = useState([]);
    const [formData, setFormData] = useState({
          chat: '',
        });
    const [complaintData, setComplaintData] = useState({
          complaint: '',
        });
    const [finalSubmission, setFinalSubmission] = useState({
          finalSubmissionLink:'',
    });
    const isFreelancer = viewerType==="freelancer";
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [type, setType] = useState("success")
    const [loading, setLoading] = useState(false);

    const chatEndRef = useRef(null);
    const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const { activeAddress, transactionSigner, algodClient } = useWallet();


// Only scroll to bottom when user sends a message, not on load
useEffect(() => {
  if (chatMessages.length > 0 && formData.chat === '') return; // avoid scroll on load
  if (formData.chat.trim()) scrollToBottom();
}, [chatMessages]);

useEffect(() => {
  if (complaintMessages.length > 0 && complaintData.complaint === '') return; // avoid scroll on load
  if (complaintData.complaint.trim()) scrollToBottom();
}, [complaintMessages]);

    const handleChange = (e) => {
      const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleComplaintChange = (e) => {
      const { name, value } = e.target;
        setComplaintData(prev => ({ ...prev, [name]: value }));
    };

    const handleChangeSubmision = (e) => {
      const { name, value } = e.target;
        setFinalSubmission(prev => ({ ...prev, [name]: value }));
    };

    const getBountyDetails = async () => {
      try {
        const data = await fetchBountyDetails(bountyId);
        setBountyDetails(data);
        if (data.is_assigened){
          const data2 = await fetchMessages(bountyId);
          setChatMessages(data2)
        }
        if(data.is_disputed){
          const data3 = await fetchComplaints(bountyId);
          setComplaintMessages(data3)
        }
      } catch (error) {
        console.error('Failed to fetch bounty details:', error);
      }
    };
    const getBountyRequests = async () => {
      try {
        const data = await fetchBountyRequests(bountyId);
        setBountyRequests(data);
      } catch (error) {
        console.error('Failed to fetch bounty details:', error);
      }
    };

    useEffect(() => {
        getBountyDetails();
      }, []);


    const handleFreelancerVote = async(e) =>{
      e.preventDefault();
      await handleVote("FREELANCER")
    }

    const handleClientVote = async(e) =>{
      e.preventDefault();
      await handleVote("CLIENT")
    }

    const handleVote = async(voted_for) =>{
      setLoading(true);
      try {
         const WalletAddress = localStorage.getItem("walletAddress");
        if (!WalletAddress) {
          setAlertMessage('Please Connect To Pera Wallet From UserPage');
          setShowAlert(true);
          setType("success")
          return;
        } 
         const callSmartContract = await votingSmartContract(bountyId, voted_for, activeAddress,transactionSigner, algodClient);
        const data = await sendVote( bountyId, voted_for ); 
         setAlertMessage('Voted Successfully!');
          setShowAlert(true);
          setType("success")
          setTimeout(() => {
          getBountyDetails();
          }, 1500);
      } catch (error) {
        console.log(error);
        const msg = extractErrorMessage(error);
        setAlertMessage(msg);
        setShowAlert(true);
        setType("error")
      } finally {
        setLoading(false);
      }
    }
    
    const handleComplaint = async(e) =>{
      e.preventDefault();
      setLoading(true);
      try {
        const WalletAddress = localStorage.getItem("walletAddress");
        if (!WalletAddress) {
          setAlertMessage('Please Connect To Pera Wallet From UserPage');
          setShowAlert(true);
          setType("success")
          return;
        } 
        const callSmartContract = await startDisputeSmartContract(bountyId, activeAddress,transactionSigner, algodClient);
        const data = await raiseDispute( bountyId ); 
         setAlertMessage('Complaint Raised Successfully!');
          setShowAlert(true);
          setType("success")
          setTimeout(() => {
          getBountyDetails();
          }, 1500);
        
      } catch (error) {
        console.log(error);
        const msg = extractErrorMessage(error);
        setAlertMessage(msg);
        setShowAlert(true);
        setType("error")
      } finally {
        setLoading(false);
      }
    };
    
    const handlePay = async(e) =>{
      e.preventDefault();
      setLoading(true);
      try {
        const clientWalletAddress = localStorage.getItem("walletAddress");
        if (!clientWalletAddress) {
          setAlertMessage('Please Connect To Pera Wallet From UserPage');
          setShowAlert(true);
          setType("success")
          return;
        }        
          // const callSmartContract = await transferAlgosToFreelancer(bountyId, activeAddress,transactionSigner, algodClient);
          const data = await transferDirectlyAmount( bountyId );
          setAlertMessage('Paid Successfully!');
          setShowAlert(true);
          setType("success")
          setTimeout(() => {
          getBountyDetails();
          }, 1500);
        } catch (error) {
          console.log(error);
          const msg = extractErrorMessage(error);
          setAlertMessage(msg);
          setShowAlert(true);
          setType("error")
        } finally {
          setLoading(false);
        }
    };

    const handleReleaseReward = async(e) =>{
      e.preventDefault();
      setLoading(true);
      try {
        const clientWalletAddress = localStorage.getItem("walletAddress");
        if (!clientWalletAddress) {
          setAlertMessage('Please Connect To Pera Wallet From UserPage');
          setShowAlert(true);
          setType("success")
          return;
        }        
          const callSmartContract = await claimRewardSmartContract(bountyId, activeAddress,transactionSigner, algodClient);
          const data = await transferAmount( UserId===bountyDetails.assigned_candidate_id, bountyId );
          setAlertMessage('Reward Claimed Successfully!');
          setShowAlert(true);
          setType("success")
          setTimeout(() => {
          getBountyDetails();
          }, 1500);
        } catch (error) {
          console.log(error);
          const msg = extractErrorMessage(error);
          setAlertMessage(msg);
          setShowAlert(true);
          setType("error")
        } finally {
          setLoading(false);
        }
    };

    const handleVoterReward = async(e) =>{
      e.preventDefault();
      setLoading(true);
      try {
        const clientWalletAddress = localStorage.getItem("walletAddress");
        if (!clientWalletAddress) {
          setAlertMessage('Please Connect To Pera Wallet From UserPage');
          setShowAlert(true);
          setType("success")
          return;
        }        
          const callSmartContract = await voterClaimRewardSmartContract(bountyId, activeAddress,transactionSigner, algodClient);
          const data = await deleteVote( bountyId );
          setAlertMessage('Vote Reward Claimed Successfully!');
          setShowAlert(true);
          setType("success")
          setTimeout(() => {
          getBountyDetails();
          }, 1500);
        } catch (error) {
          console.log(error);
          const msg = extractErrorMessage(error);
          setAlertMessage(msg);
          setShowAlert(true);
          setType("error")
        } finally {
          setLoading(false);
        }
    };

    const handleFinalSubmission = async (e) =>{
       e.preventDefault();
        try {
          const data = await postFinalSubmissionLink(finalSubmission, bountyId);
          setFinalSubmission(prev => ({ ...prev, finalSubmissionLink: '' })); 
          setAlertMessage('Submited Successfully!');
          setShowAlert(true);
          setType("success")
          setTimeout(() => {
          getBountyDetails();
          }, 1500);
        } catch (error) {
            const msg = extractErrorMessage(error);
            setAlertMessage(msg);
            setShowAlert(true);
            setType("error")
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const data = await postChatMessage(formData, bountyId);
          setFormData(prev => ({ ...prev, chat: '' }));
          setTimeout(() => {
          getBountyDetails();
          }, 1500);
        } catch (error) {
            const msg = extractErrorMessage(error);
            setAlertMessage(msg);
            setShowAlert(true);
            setType("error")
        }
    };

    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        try {
          const data = await postComplaintMessage(complaintData, bountyId);
          setComplaintData(prev => ({ ...prev, complaint: '' }));
          setTimeout(() => {
          getBountyDetails();
          }, 1500);
        } catch (error) {
            const msg = extractErrorMessage(error);
            setAlertMessage(msg);
            setShowAlert(true);
            setType("error")
        }
    };

     const handleRequestBounty = async () => {
        setLoading(true);
        try{
          const freelancerWalletAddress = localStorage.getItem("walletAddress");
            if (!freelancerWalletAddress) {
                setAlertMessage('Please Connect To Pera Wallet From UserPage');
                setShowAlert(true);
                setType("success")
                return;
            }

            const data = await sendBountyRequest(bountyId);
            setAlertMessage('Request Submitted successfully');
            setShowAlert(true);
            setType("success")
            setTimeout(async () => {
                await getBountyDetails();
            }, 1500);
        } catch(error){
           const msg = extractErrorMessage(error);
            setAlertMessage(msg);
            setShowAlert(true);
            setType("error") 
        } finally {
          setLoading(false);
        }
     }

    const isVotingClosed = !bountyDetails.dispute_end_date || dayjs.utc().isAfter(dayjs.utc(bountyDetails.dispute_end_date));
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [formattedTimeRemaining, setFormattedTimeRemaining] = useState(null);

    useEffect(() => {
      if (!bountyDetails.dispute_end_date || isVotingClosed) return;

      const interval = setInterval(() => {
      const now = dayjs.utc();
      const end = dayjs.utc(bountyDetails.dispute_end_date);
      const remaining = end.diff(now);

        if (remaining > 0) {
          const duration = dayjs.duration(remaining);
          const formatted =
            (duration.days() > 0 ? `${duration.days()}d ` : '') +
            duration.format('HH:mm:ss');
          setFormattedTimeRemaining(formatted);
        } else {
          setFormattedTimeRemaining(null);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [bountyDetails.dispute_end_date, isVotingClosed]);
    
      if (loading) {
        return (
          <div className="loader-overlay">
            <div className="loader-container">
              <p className="loader-text">Please open Pera Wallet</p>
              <div className="loader-ring">
                <img src={Loader} alt="Loading..." className="loader-core" />
              </div>
            </div>
          </div>
        );
      }
      return (
        <>
        {showAlert && (
        <Alert
          message={alertMessage}
          type={type}
          duration={3000}
          onClose={() => setShowAlert(false)}
        />
      )}
        <div className="bounty-details-container">
          <h1 className="bounty-details-title">{bountyDetails.title}</h1>
          <div className="bounty-details-description">
            <ul>
                {(bountyDetails.descrition || "").split('.').map((sentence, index) =>
                sentence.trim() ? <li key={index}>{sentence.trim()}.</li> : null
                )}
            </ul>
         </div>
          <div className="bounty-details-info-row">
            <span className="bounty-details-type">{bountyDetails.task_type}</span>
            <span className="bounty-details-reward">{bountyDetails.amount} ALGOS</span>
            <span className="bounty-details-duration">{bountyDetails.deadline} MONTHS</span>
          </div>
        </div>
        {
            isFreelancer && !bountyDetails.is_bounty_requested && !bountyDetails.is_assigened &&
            <button className='request-bounty-button' onClick={handleRequestBounty}>
              Request For Bounty
            </button>
        }
        {
            isFreelancer && bountyDetails.is_bounty_requested &&
            <button className='requested-bounty-button'>Requested For Bounty</button>
        }
        {
            !isFreelancer && !bountyDetails.is_assigened && bountyRequests.length === 0 &&
            <button className='bounty-requests-button' onClick={getBountyRequests} >View Bounty Requests</button>
        }
        {
            !isFreelancer && !bountyDetails.is_assigened && bountyRequests.length !== 0 &&
            <div>
            <button className='bounty-requests' >Bounty Requests</button> 
            <CandidateTileList candidateDetailsList={bountyRequests} setShowAlert={setShowAlert} setType={setType} setAlertMessage={setAlertMessage} reward={bountyDetails.amount} getBountyDetails={getBountyDetails} setLoading={setLoading}/>
            </div>
        }
        {
            bountyDetails.is_assigened  &&
          <>
            <div className="chat-box">
              <h2 className='chat-box-header'>Chat Box</h2>
              <div className="chat-messages">
                <MessageTileList chatMessages={chatMessages} />
                <div ref={chatEndRef} />
              </div>
              {!bountyDetails.is_disputed && (UserId === bountyDetails.client_id || UserId === bountyDetails.assigned_candidate_id) && !bountyDetails.is_amount_transfered && !bountyDetails.is_client_amount_transfered &&
                <form onSubmit={handleSubmit} className="chat-form">
                  <input
                    type="text"
                    name="chat"
                    placeholder="Type Your Message Here"
                    value={formData.chat}
                    onChange={handleChange}
                    required
                    className="chat-input"
                  />
                  <button
                    type="submit"
                    className="chat-button"
                  >
                    Send
                  </button>
                </form>
              }
            </div>
            </>
        }
        {
            isFreelancer && bountyDetails.is_assigened && !bountyDetails.is_completed &&
            <div>
              <form onSubmit={handleFinalSubmission} className='submission-form'>
                <input 
                type="url"
                name="finalSubmissionLink" 
                placeholder='Final Submission Link'
                value={finalSubmission.finalSubmissionLink}
                onChange={handleChangeSubmision}
                requried
                className='submission-input'
                />

                <button 
                  type='submit'
                  className='submission-button'
                  disabled={!finalSubmission.finalSubmissionLink.trim()}
                >
                  Submit
                </button>

              </form>
            </div>
        }
        {
          bountyDetails.is_assigened && bountyDetails.is_completed &&
          <a
            className='final-submission-link'
            href={bountyDetails.final_submission_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here to View the Final Submission
          </a>
        }
        {
          !isFreelancer && bountyDetails.is_completed && !bountyDetails.is_amount_transfered &&  !bountyDetails.is_disputed &&
          <button className='pay-button' onClick={handlePay}>Pay</button>
        }
        {
           bountyDetails.is_completed && !bountyDetails.is_amount_transfered &&  !bountyDetails.is_disputed &&
          <button className='dispute-button' onClick={handleComplaint}>Raise Complaint</button>
        }
          {
            bountyDetails.is_disputed &&
          <>
            <div className="chat-box">
              <h2 className='chat-box-header'>Complaint Box</h2>
              <div className="chat-messages">
                <MessageTileList chatMessages={complaintMessages} />
                <div ref={chatEndRef} />
              </div>
              { bountyDetails.is_disputed && (UserId == bountyDetails.client_id || UserId == bountyDetails.assigned_candidate_id) && !bountyDetails.is_amount_transfered && !bountyDetails.is_client_amount_transfered &&
                <form onSubmit={handleComplaintSubmit} className="chat-form">
                  <input
                    type="text"
                    name="complaint"
                    placeholder="Type Your Message Here"
                    value={complaintData.complaint}
                    onChange={handleComplaintChange}
                    required
                    className="chat-input"
                  />
                  <button
                    type="submit"
                    className="chat-button"
                  >
                    Send
                  </button>
                </form>
              }
            </div>
            </>
        }
        { bountyDetails.is_disputed &&
          <div className="voting-timer">
            {formattedTimeRemaining && !isVotingClosed ? (
              <>Voting ends in: <strong>{formattedTimeRemaining}</strong></>
            ) : (
              <>Voting closed</>
            )}
          </div>
        }
        {
          !isVotingClosed &&
          UserId !== bountyDetails.assigned_candidate_id &&
          UserId !== bountyDetails.client_id &&
          !bountyDetails.voted_for &&
          <div className="vote-buttons-container">
            <button className="vote-button vote-freelancer-button" onClick={handleFreelancerVote}>Vote for Freelancer</button>
            <button className="vote-button vote-client-button" onClick={handleClientVote}>Vote for Client</button>
          </div>
        }
        
        {
          bountyDetails.voted_for &&
          <div className="vote-buttons-container">
            <button className="voted-button" disabled={true}>
              Voted for {bountyDetails.voted_for}
            </button>
          </div>
        }

        {
          isVotingClosed && bountyDetails.dispute_result && (
            <div className="dispute-result">
              <h3>Dispute Result</h3>
              <p>Freelancer Votes: <strong>{bountyDetails.dispute_result.freelancer_votes}</strong></p>
              <p>Client Votes: <strong>{bountyDetails.dispute_result.client_votes}</strong></p>
              <p>🏆 Winner: <strong>{bountyDetails.dispute_result.winner.toUpperCase()}</strong></p>
            </div>
          )
        }
        {
          isVotingClosed &&
          bountyDetails.dispute_result &&
          (
            <>
              {
                bountyDetails.dispute_result.winner === 'FREELANCER' &&
                UserId === bountyDetails.assigned_candidate_id && !bountyDetails.is_amount_transfered && (
                  <div className="vote-buttons-container" >
                    <button className="release-button" onClick={handleReleaseReward}>Release Reward</button>
                  </div>
                )
              }
              {
                bountyDetails.dispute_result.winner === 'CLIENT' &&
                UserId === bountyDetails.client_id && !bountyDetails.is_client_amount_transfered && (
                  <div className="vote-buttons-container">
                    <button className="release-button" onClick={handleReleaseReward}>Release Reward</button>
                  </div>
                )
              }
              {
                bountyDetails.dispute_result.winner === 'TIE' &&
                ((UserId === bountyDetails.client_id && !bountyDetails.is_client_amount_transfered ) || (UserId === bountyDetails.assigned_candidate_id && !bountyDetails.is_amount_transfered)) && (
                  <div className="vote-buttons-container">
                    <button className="release-button" onClick={handleReleaseReward}>Release Reward</button>
                    <p className="tie-message">50% of the reward will be released</p>
                  </div>
                )
              }
            </>
          )
        }
        {
          isVotingClosed && bountyDetails.vote_active &&
          <div className="vote-buttons-container">
            <button className="release-button" onClick={handleVoterReward}>
              Claim Voting Reward
            </button>
          </div>
        }
        </>
      )
}
