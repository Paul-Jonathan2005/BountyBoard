import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import Navbar from '../components/NavBar.jsx'
import '../css/CreatedBounties.css'
import { fetchBountyList } from '../services/api';
import BountyTileList from '../components/BountyTileList';
import Alert from '../components/Alert';
import extractErrorMessage from '../utils/extractErrorMessage';
import CreateBountyForm from '../components/CreateBountyForm.jsx';

export default function CreatedBountiesPage() {
  const [bounties, setBounties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState("success")
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const getBounties = async () => {
      try {
        const data = await fetchBountyList('INPROGRESS');
        setBounties(data);
      } catch (error) {
        console.error('Failed to fetch bounties:', error);
      }
    };
    getBounties();
  }, []);

  return (
    <>
    {showAlert && (
            <Alert
            message={alertMessage}
            type={type}
            duration={3000}
            onClose={() => setShowAlert(false)}
            />
        )}
    <div className='createdbounties'>
      <Header />
      <Navbar />
      <BountyTileList bountyList={bounties} bountyType="INPROGRESS" viewerType="client" />
      <button className="create-bounty-button" onClick={() => setShowForm(true)  }>
        Create Bounty
      </button>

      {showForm && <CreateBountyForm onClose={() => setShowForm(false)} setShowAlert={setShowAlert} setType={setType} setAlertMessage={setAlertMessage} />}

      <Footer />
    </div>
    </>
  )
}