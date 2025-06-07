import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../css/FreelancerDashboard.css"
import { fetchDashboardDetails } from '../services/api';

export default function FreelancerDashboard() {
  const [freelanceDashboardDetails, setFreelancerDashboardDetails] = useState({});
  useEffect(() => {
    const getDashboardDetails = async () => {
      try {
        const data = await fetchDashboardDetails("freelancer");
        setFreelancerDashboardDetails(data);
      } catch (error) {
        console.error('Failed to fetch Details:', error);
      }
    };
    getDashboardDetails();
  }, []);
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Freelancer Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-tile tile-green-1">
          <h3>Earned Rewards</h3>
          <div className="reward-container">
            <div className="reward-value">{freelanceDashboardDetails.earned_task_reward}</div>
            <div className="reward-unit">ALGOS</div>
          </div>
        </div>
        <div className="dashboard-tile tile-blue-1">
          <h3>Active Bounties</h3>
          <p>{freelanceDashboardDetails.active_bounties_count}</p>
        </div>
        <div className="dashboard-tile tile-green-2">
          <h3>Completed</h3>
          <p>{freelanceDashboardDetails.completed_bounties_count}</p>
        </div>
        <div className="dashboard-tile tile-orange-1">
          <h3>Payment Pending</h3>
          <p>{freelanceDashboardDetails.payment_pending_bounties_count}</p>
        </div>
        <div className="dashboard-tile tile-red-1">
          <h3>Disputed</h3>
          <p>{freelanceDashboardDetails.disputed_bounties_count}</p>
        </div>
        <div className="dashboard-tile tile-purple-1">
          <h3>Requested Bounties</h3>
          <p>{freelanceDashboardDetails.requested_bounties_count}</p>
        </div>
      </div>
    </div>
  );
}