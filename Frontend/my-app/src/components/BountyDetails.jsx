import React, { useEffect, useState, useRef } from 'react';
import { fetchBountyDetails, fetchBountyRequests} from '../services/api';
import { useParams } from 'react-router-dom';
import '../css/BountyDetails.css'
import Alert from '../components/Alert';
import extractErrorMessage from '../utils/extractErrorMessage';
import { useNavigate } from 'react-router-dom';
import {sendBountyRequest, fetchMessages, postChatMessage} from '../services/api';
import CandidateTileList from './CandidateTileList';
import MessageTileList from './MessageTileList';


export default function BountyDetails(){
    const { viewerType, bountyId } = useParams();
    const [bountyDetails, setBountyDetails] = useState([]);
    const [bountyRequests, setBountyRequests] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [formData, setFormData] = useState({
          chat: '',
        });
    const isFreelancer = viewerType==="freelancer";
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [type, setType] = useState("success")

    const chatEndRef = useRef(null);
    const scrollToBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
    };

    useEffect(() => {
      scrollToBottom();
    }, [chatMessages]);

    const handleChange = (e) => {
      const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getBountyDetails = async () => {
      try {
        const data = await fetchBountyDetails(bountyId);
        setBountyDetails(data);
        if (data.is_assigened){
          const data2 = await fetchMessages(bountyId);
          setChatMessages(data2)
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

     const handleRequestBounty = async () => {
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
        }
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
            <CandidateTileList candidateDetailsList={bountyRequests} setShowAlert={setShowAlert} setType={setType} setAlertMessage={setAlertMessage} reward={bountyDetails.amount} getBountyDetails={getBountyDetails}/>
            </div>
        }
        {
            bountyDetails.is_assigened  &&
            <div className="chat-box">
              <h2 className='chat-box-header'>Chat Box</h2>
              <div className="chat-messages">
                <MessageTileList chatMessages={chatMessages} />
                <div ref={chatEndRef} />
              </div>
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
            </div>
        }
        </>
      )
}
