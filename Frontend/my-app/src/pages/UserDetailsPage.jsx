import React from 'react';
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import UserDetails from '../components/UserDetails.jsx'
import Navbar from '../components/NavBar.jsx'

export default function UserDetailsPage() {
  return (
    <div id="userdetails">
      <Header />
      <Navbar/>
      <UserDetails />
      <Footer />
    </div>
      
  )
}