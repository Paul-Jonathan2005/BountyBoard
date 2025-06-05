import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import Navbar from '../components/NavBar.jsx'
import '../css/CreatedBounties.css'
import { fetchRewardBounties } from '../services/api';
import BountyTileList from '../components/BountyTileList';

export default function BountyVotingRewardPage() {
  const [bounties, setBounties] = useState([]);
  useEffect(() => {
    const getBounties = async () => {
      try {
        const data = await fetchRewardBounties();
        setBounties(data);
      } catch (error) {
        console.error('Failed to fetch bounties:', error);
      }
    };
    getBounties();
  }, []);

  return (
    <>
    <div className='createdbounties'>
      <Header />
      <Navbar />
      <BountyTileList bountyList={bounties} bountyType="PAID" viewerType="voter" />
      <Footer />
    </div>
    </>
  )
}