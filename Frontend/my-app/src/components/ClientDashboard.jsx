import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../css/ClientDashboard.css";
import { fetchDashboardDetails } from '../services/api';

export default function ClientDashboard() {
    const { viewerType } = useParams();
    useEffect(() => {
      console.log("viewerType:", viewerType);
    }, [viewerType]);
    const [clientDashboardDetails, setClientDashboardDetails] = useState({});
    
    useEffect(() => {
    const getDashboardDetails = async () => {
        try {
        const data = await fetchDashboardDetails( viewerType);
        setClientDashboardDetails(data);
        } catch (error) {
        console.error('Failed to fetch Details:', error);
        }
    };
    getDashboardDetails();
    }, []);

    return (
      <div className="dashboard-container">
        <h1 className="dashboard-title">{viewerType === "client" ? "Client" : "Freelancer"} Dashboard</h1>
        <div className="dashboard-grid">
          <div className="dashboard-tile tile-blue">
            <h3>Total Created Bounties</h3>
            <p>{clientDashboardDetails.created_bounties_count}</p>
          </div>
          <div className="dashboard-tile tile-green">
            <h3>Completed</h3>
            <p>{clientDashboardDetails.completed_bounties_count}</p>
          </div>
          <div className="dashboard-tile tile-orange">
            <h3>Payment Pending</h3>
            <p>{clientDashboardDetails.payment_pending_bounties_count}</p>
          </div>
          <div className="dashboard-tile tile-red">
            <h3>Disputed</h3>
            <p>{clientDashboardDetails.disputed_bounties_count}</p>
          </div>
        </div>
      </div>
    );
}