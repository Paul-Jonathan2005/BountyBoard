import React from 'react';
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import BountyDetails from '../components/BountyDetails.jsx'
import Navbar from '../components/NavBar.jsx'

export default function BountyDetailsPage() {
  return (
    <div id="bountyDetails">
      <Header />
      <Navbar />
      <BountyDetails />
      <Footer />
    </div>
      
  )
}