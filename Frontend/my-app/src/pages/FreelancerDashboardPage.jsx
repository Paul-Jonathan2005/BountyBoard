import React from 'react';
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import FreelancerDashboard from '../components/FreelancerDashboard.jsx'
import NavBar from '../components/NavBar.jsx';


export default function FreelancerDashboardPage() {
  return (
    <div id="freelancerdashboard">
      <Header />
      <NavBar />
      <FreelancerDashboard />
      <Footer />
    </div>
      
  )
}