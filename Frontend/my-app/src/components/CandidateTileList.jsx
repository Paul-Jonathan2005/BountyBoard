import React from 'react';
import CandidateTile from './CandidateTile';
import '../css/CandidateTileList.css';

export default function CandidateTileList({ candidateDetailsList, setShowAlert, setType, setAlertMessage, reward, getBountyDetails, setLoading }) {
  return (
    <div className="candidate-tile-list">
      {candidateDetailsList.map((candidate, index) => (
        <CandidateTile key={index} candidateDetails={candidate} setShowAlert={setShowAlert} setType={setType} setAlertMessage={setAlertMessage} reward={reward} getBountyDetails={getBountyDetails} setLoading={setLoading} />
      ))}
    </div>
  );
}