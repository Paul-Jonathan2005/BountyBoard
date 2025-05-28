import { useParams } from 'react-router-dom';
import { fecthTaskTypeBounties } from '../services/api';
import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import Navbar from '../components/NavBar.jsx'
import BountyTileList from '../components/BountyTileList';

export default function TaskTypeBounties(){
    const { taskType } = useParams();
    const [taskTypeBounties, setTaskTypeBounties] = useState([]);

    useEffect(() => {
        const getTaskTypeBounties = async () => {
          try {
            const data = await fecthTaskTypeBounties(taskType);
            setTaskTypeBounties(data);
          } catch (error) {
            console.error('Failed to fetch bounties:', error);
          }
        };
        getTaskTypeBounties();
      }, []);
    return (
     <div className='bountyType'>
      <Header />
      <Navbar />
      <BountyTileList bountyList={taskTypeBounties} bountyType="INPROGRESS"  viewerType ="freelancer"/>
      <Footer />
    </div>
      
  )

}