import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import Navbar from '../components/NavBar.jsx'
import { fetchFreelancerBountyList } from '../services/api.js';
import BountyTileList from '../components/BountyTileList.jsx';
import '../css/CreatedBounties.css'

export default function CompletedBountiesPage() {
    const [bounties, setBounties] = useState([]);
      useEffect(() => {
        const getBounties = async () => {
          try {
            const data = await fetchFreelancerBountyList('PAID');
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
      <BountyTileList bountyList={bounties} bountyType="PAID" viewerType="freelancer" />
      <Footer />
    </div>
      
  )
}