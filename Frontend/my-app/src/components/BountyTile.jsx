import React from 'react';
import '../css/BountyTile.css';
import { useNavigate } from 'react-router-dom';



export default function BountyTile({ BountyDetails, bountyType, viewerType }) {
  const { title, task_type, amount, deadline } = BountyDetails;
  const navigate = useNavigate();

  let typeClass = {
    INPROGRESS: 'bounty-tile-inprogress',
    COMPLETED: 'bounty-tile-completed',
    PAID: 'bounty-tile-paid',
  }[bountyType] || 'bounty-tile-default';

  if (BountyDetails.is_requested) {
    typeClass = 'bounty-tile-requested'
  }

  if (BountyDetails.is_assigened) {
    typeClass = 'bounty-tile-assigned'
  }

  if (BountyDetails.is_disputed) {
    typeClass = 'bounty-tile-disputed'
  }

  return (
    <div className={`bounty-tile ${typeClass}`}>
      <div className="bounty-title-row">
        <div
          className="view-button"
          onClick={() => navigate(`/${viewerType}/bounty-details/${BountyDetails.id}`)}
          title="View Bounty"
        >
          👁️
        </div>
        <div className="bounty-title">{title}</div>
      </div>
      <div className="bounty-details-row">
        <div className="bounty-type">{task_type}</div>
        <div className="bounty-reward">{amount} ALGOS</div>
        <div className="bounty-duration">{deadline} MONTHS</div>
      </div>
    </div>
  );
}