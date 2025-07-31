import React from 'react';
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import ClientDashboard from '../components/ClientDashboard.jsx'
import NavBar from '../components/NavBar.jsx';

export default function ClientDashboardPage() {
  return (
    <div id="clientdashboard">
      <Header />
      <NavBar />
      <ClientDashboard />
      <Footer />
    </div>

  )
}