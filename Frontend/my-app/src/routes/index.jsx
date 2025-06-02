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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/freelancer/bounty-types" element={<BountyTypePage />} />
      <Route path="/user-details" element={<UserDetailsPage />} />
      <Route path="/:viewerType/bounty-details/:bountyId" element={<BountyDetailsPage />} />
      <Route path="/client/created-bounties" element={<CreatedBountiesPage />} />
      <Route path="/freelancer/assigned-bounties" element={<AssignedBountiesPage />} />
      <Route path="/freelancer/bounty-types" element={<BountyTypePage />} />
      <Route path="/freelancer/task-type/:taskType" element={<TaskTypeBountiesPage />} />
      <Route path="/freelancer/bounty-requests" element={<BountyRequestsPage />} />
      <Route path="/freelancer/completed-bounties" element={<FreelancerCompletedBountiesPage />} />
      <Route path="/freelancer/payment-pending" element={<FreelancerPaymentPendingPage />} />
      <Route path="/client/completed-bounties" element={<ClientCompletedBountiesPage />} />
      <Route path="/client/payment-pending" element={<ClientPaymentPendingPage />} />
    </Routes>
  );
}
