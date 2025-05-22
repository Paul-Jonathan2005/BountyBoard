import React, { useState } from 'react';
import '../css/Navbar.css';
import { Link } from 'react-router-dom';

function NavBar() {
  const [expanded, setExpanded] = useState(false);
  const [clientOpen, setClientOpen] = useState(false);
  const [freelancerOpen, setFreelancerOpen] = useState(false);

  return (
    <div
      className={`sidebar ${expanded ? 'expanded' : ''}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => {
        setExpanded(false);
        // setClientOpen(false);
        // setFreelancerOpen(false);
      }}
    >
      <nav>
        <ul>
          <li onClick={() => setFreelancerOpen(!freelancerOpen)}>🧑‍💻 Freelancer ▾</li>
          {freelancerOpen && (
            <ul className="submenu">
              <li><Link to="/freelancer/bounty-types">Bounty Types</Link></li>
              <li><Link to="/freelancer/bounty-requests">Bounty Requests</Link></li>
              <li><Link to="/freelancer/assigned-bounties">Assigned Bounties</Link></li>
              <li><Link to="/freelancer/payment-pending">Payment Pending</Link></li>
              <li><Link to="/freelancer/completed-bounties">Completed Bounties</Link></li>
            </ul>
          )}

          <li onClick={() => setClientOpen(!clientOpen)}>👤 Client ▾</li>
          {clientOpen && (
              <ul className="submenu">
              <li><Link to="/client/created-bounties">Created Bounties</Link></li>
              <li><Link to="/client/payment-pending">Payment Pending</Link></li>
              <li><Link to="/client/completed-bounties">Completed Bounties</Link></li>
            </ul>
          )}

        </ul>
      </nav>
    </div>
  );
}

export default NavBar;