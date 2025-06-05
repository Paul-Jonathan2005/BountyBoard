import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import Navbar from '../components/NavBar.jsx'
import '../css/CreatedBounties.css'
import { fetchDisputedBounties } from '../services/api';
import BountyTileList from '../components/BountyTileList';

export default function BountyDisputePage() {
  const [bounties, setBounties] = useState([]);
  useEffect(() => {
    const getBounties = async () => {
      try {
        const data = await fetchDisputedBounties();
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
      <BountyTileList bountyList={bounties} bountyType="COMPLETED" viewerType="voter" />
      <Footer />
    </div>
    </>
  )
}