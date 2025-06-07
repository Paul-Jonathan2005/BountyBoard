import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import Navbar from '../components/NavBar.jsx'
import { fetchClientBountyList } from '../services/api.js';
import BountyTileList from '../components/BountyTileList.jsx';
import '../css/CreatedBounties.css';
import NoBounties from '../assets/no-data.png';

export default function CompletedBountiesPage() {
    const [bounties, setBounties] = useState([]);
      useEffect(() => {
        const getBounties = async () => {
          try {
            const data = await fetchClientBountyList('PAID');
            setBounties(data);
          } catch (error) {
            console.error('Failed to fetch bounties:', error);
          }
        };
        getBounties();
      }, []);

  return (
    <div id="completedbounties">
      <Header />
      <Navbar />
      {bounties.length > 0 ? (
        <BountyTileList bountyList={bounties} bountyType="PAID" viewerType="client" />
      ) : (
        <div className="no-bounties">
          <img src={NoBounties} alt="No Bounties" className="no-bounties-img" />
          <p>No Completed Bounties Found</p>
        </div>
      )}
      <Footer />
    </div>
      
  )
}