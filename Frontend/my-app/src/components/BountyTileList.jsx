

import React from 'react';
import BountyTile from './BountyTile';
import '../css/BountyTileList.css';

export default function BountyTileList({ bountyList, bountyType, viewerType }) {
  return (
    <div className="bounty-tile-list-container">
      {bountyList.map((bounty, index) => (
        <BountyTile key={index} BountyDetails={bounty} bountyType={bountyType} viewerType={viewerType}/>
      ))}
    </div>
  );
}