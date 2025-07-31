import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import Navbar from '../components/NavBar.jsx'
import '../css/Register.css'
import { fetchBountyTypes } from '../services/api.js';
import TaskTypeGrid from '../components/TaskTypeGrid.jsx';

export default function BountyTypePage() {
  const [task_types, setTaskType] = useState([]);

  useEffect(() => {
    const getTaskType = async () => {
      try {
        const data = await fetchBountyTypes();
        setTaskType(data);
      } catch (error) {
        console.error('Failed to fetch bounty types:', error);
      }
    };
    getTaskType();
  }, []);

  return (
    <div className='bountyType'>
      <Header />
      <Navbar />
      < TaskTypeGrid taskTypes={task_types} />
      <Footer />
    </div>

  )
}