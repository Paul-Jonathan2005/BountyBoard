import React, { useEffect, useState } from 'react';
import { fetchBountyDetails } from '../services/api';
import { useParams } from 'react-router-dom';
import '../css/BountyDetails.css'
import Alert from '../components/Alert';
import extractErrorMessage from '../utils/extractErrorMessage';
import { useNavigate } from 'react-router-dom';
import {sendBountyRequest} from '../services/api';


export default function BountyDetails(){
    const { viewerType, bountyId } = useParams();
    const [bountyDetails, setBountyDetails] = useState([]);
    const [bountyRequests, setBountyRequests] = useState([]);
    const isFreelancer = viewerType==="freelancer";
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [type, setType] = useState("success")

    const getBountyDetails = async () => {
      try {
        const data = await fetchBountyDetails(bountyId);
        setBountyDetails(data);
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

     const handleRequestBounty = async () => {
        try{
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
            isFreelancer && !bountyDetails.is_bounty_requested &&
            <button className='request-bounty-button' onClick={handleRequestBounty}>
              Request For Bounty
            </button>
        }
        {
            isFreelancer && bountyDetails.is_bounty_requested &&
            <button className='requested-bounty-button'>Requested For Bounty</button>
        }
        {
            !isFreelancer && !bountyDetails.is_assigened && !bountyRequests &&
            <button className='bounty-requests-button' onClick={getBountyRequests} >View Bounty Requests</button>
        }
        {
            !isFreelancer && !bountyDetails.is_assigened && !bountyRequests &&
            <button className='bounty-requests' >Bounty Requests</button>
        }
        </>
      )
}