import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import Navbar from '../components/NavBar.jsx'
import { fetchClientBountyList } from '../services/api.js';
import BountyTileList from '../components/BountyTileList.jsx';
import '../css/CreatedBounties.css'

export default function PaymentPendingPage() {
    const [bounties, setBounties] = useState([]);
      useEffect(() => {
        const getBounties = async () => {
          try {
            const data = await fetchClientBountyList('COMPLETED');
            setBounties(data);
          } catch (error) {
            console.error('Failed to fetch bounties:', error);
          }
        };
        getBounties();
      }, []);

  return (
    <div id="paymentpending">
      <Header />
      <Navbar />
      <BountyTileList bountyList={bounties} bountyType="COMPLETED" viewerType="client" />
      <Footer />
    </div>
      
  )
}