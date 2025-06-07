import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import BountyTypePage from '../pages/TaskTypePage';
import UserDetailsPage from '../pages/UserDetailsPage';
import CreatedBountiesPage from '../pages/CreatedBountiesPage';
import TaskTypeBountiesPage from '../pages/TaskTypeBountiesPage'
import BountyDetailsPage from '../pages/BountyDetailsPage'
import AssignedBountiesPage from '../pages/AssignedBountiesPage';
import FreelancerCompletedBountiesPage from '../pages/FreelancerCompletedBountiesPage';
import FreelancerPaymentPendingPage from '../pages/FreelancerPaymentPendingPage';
import ClientCompletedBountiesPage from '../pages/ClientCompletedBountiesPage';
import ClientPaymentPendingPage from '../pages/ClientPaymentPendingPage';
import BountyRequestsPage from '../pages/BountyRequestsPage';
import BountyDisputePage from '../pages/BountyDisputePage';
import BountyVotingRewardPage from '../pages/BountyVotingRewardPage';
import PrivateRoute from './PrivateRoute';
import FreelancerDashboardPage from '../pages/FreelancerDashboardpage';
import ClientDashboardPage from '../pages/ClientDashboardPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/freelancer/bounty-types" element={<PrivateRoute><BountyTypePage /></PrivateRoute>} />
      <Route path="/user-details" element={<PrivateRoute><UserDetailsPage /></PrivateRoute>} />
      <Route path="/:viewerType/bounty-details/:bountyId" element={<PrivateRoute><BountyDetailsPage /></PrivateRoute>} />
      <Route path="/client/created-bounties" element={<PrivateRoute><CreatedBountiesPage /></PrivateRoute>} />
      <Route path="/freelancer/assigned-bounties" element={<PrivateRoute><AssignedBountiesPage /></PrivateRoute>} />
      <Route path="/freelancer/dashboard" element={<PrivateRoute><FreelancerDashboardPage /></PrivateRoute>} />
      <Route path="/client/dashboard" element={<PrivateRoute><ClientDashboardPage /></PrivateRoute>} />
      <Route path="/freelancer/bounty-types" element={<PrivateRoute><BountyTypePage /></PrivateRoute>} />
      <Route path="/freelancer/task-type/:taskType" element={<PrivateRoute><TaskTypeBountiesPage /></PrivateRoute>} />
      <Route path="/freelancer/bounty-requests" element={<PrivateRoute><BountyRequestsPage /></PrivateRoute>} />
      <Route path="/freelancer/completed-bounties" element={<PrivateRoute><FreelancerCompletedBountiesPage /></PrivateRoute>} />
      <Route path="/freelancer/payment-pending" element={<PrivateRoute><FreelancerPaymentPendingPage /></PrivateRoute>} />
      <Route path="/client/completed-bounties" element={<PrivateRoute><ClientCompletedBountiesPage /></PrivateRoute>} />
      <Route path="/client/payment-pending" element={<PrivateRoute><ClientPaymentPendingPage /></PrivateRoute>} />
      <Route path="/voter/disputed-bounties" element={<PrivateRoute><BountyDisputePage /></PrivateRoute>} />
      <Route path="/voter/reward-bounties" element={<PrivateRoute><BountyVotingRewardPage /></PrivateRoute>} />
    </Routes>
  );
}
