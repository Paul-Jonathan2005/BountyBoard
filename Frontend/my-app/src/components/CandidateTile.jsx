import React from 'react';
import  '../css/CandidateTile.css';
import { useParams } from 'react-router-dom';
import extractErrorMessage from '../utils/extractErrorMessage';
import {acceptBountyRequest, transferAlgosToSmartContracts} from '../services/api';
import algosdk from 'algosdk';
import { useWallet } from '@txnlab/use-wallet-react';

export default function CandidateTile({ candidateDetails, setShowAlert, setType, setAlertMessage, reward, getBountyDetails}) {
    const { bountyId } = useParams();
    const { id, first_name, last_name, linkedin_profile_link, wallet_address } = candidateDetails;
    const { activeAddress, transactionSigner, algodClient } = useWallet();

 const handleAcceptRequest = async () => {
        try{
            const clientWalletAddress = localStorage.getItem("walletAddress");
            if (!clientWalletAddress) {
                setAlertMessage('Please Connect To Pera Wallet From UserPage');
                setShowAlert(true);
                setType("success")
                return;
            }

            const callSmartContract = await transferAlgosToSmartContracts(bountyId, reward*1000000, wallet_address, activeAddress, transactionSigner, algodClient);
            const data = await acceptBountyRequest(bountyId, id);
            setAlertMessage('Accepted Successfully');
            setShowAlert(true);
            setType("success")
            setTimeout(async () => {
                await getBountyDetails();
            }, 1500);

        } catch(error){
            console.log(error);
            
           const msg = extractErrorMessage(error);
            setAlertMessage(msg);
            setShowAlert(true);
            setType("error") 
        }
     }
  return (
    <div className="candidate-tile">
      <div className="candidate-name">
        {first_name} {last_name}
      </div>
      <div className="candidate-profile">
        <a href={linkedin_profile_link} target="_blank" rel="noopener noreferrer">
          View Profile
        </a>
      </div>
      <div className="candidate-action">
        <button onClick={handleAcceptRequest}>Accept Request</button>
      </div>
    </div>
  );
}