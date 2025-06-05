import React, { useState, useEffect} from 'react';
import '../css/Navbar.css';
import { Link, useLocation } from 'react-router-dom';

function NavBar() {
  const [expanded, setExpanded] = useState(false);
  const [clientOpen, setClientOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [freelancerOpen, setFreelancerOpen] = useState(false);
  const [governanceOpen, setGovernanceOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  

  const freelancerPaths = [
  "/freelancer/bounty-types",
  "/freelancer/bounty-requests",
  "/freelancer/assigned-bounties",
  "/freelancer/payment-pending",
  "/freelancer/completed-bounties"
];

const clientPaths = [
  "/client/created-bounties",
  "/client/payment-pending",
  "/client/completed-bounties"
];

const adminPaths = [
  "/admin/users",
];

const governancePaths = [
  "/voter/disputed-bounties",
  "/voter/reward-bounties",
];

const isFreelancerOpen = freelancerOpen || freelancerPaths.includes(location.pathname);
const isClientOpen = clientOpen || clientPaths.includes(location.pathname);
const isAdminOpen = adminOpen || adminPaths.includes(location.pathname);
const isGovernanceOpen = governanceOpen || governancePaths.includes(location.pathname);

useEffect(() => {
  const userRole = localStorage.getItem("userRole")
  if(userRole === "CLIENT" || userRole === "ADMIN" || userRole === "CLIENT-FREELANCER"){
    setIsClient(true)
  }
  if(userRole === "FREELANCER" || userRole === "ADMIN" || userRole === "CLIENT-FREELANCER"){
    setIsFreelancer(true)
  }
  if(userRole === "ADMIN"){
    setIsAdmin(true)
  }
  
}, []);

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
          {isFreelancer &&
          <>
          <li onClick={() => setFreelancerOpen(!freelancerOpen)}>
            🧑‍💻 {expanded && 'Freelancer ▾'}
          </li>
          {isFreelancerOpen && expanded && (
            <ul className="submenu">
              <li className={location.pathname === "/freelancer/bounty-types" ? "active" : ""}>
                <Link to="/freelancer/bounty-types">Bounty Types</Link>
              </li>
              <li className={location.pathname === "/freelancer/bounty-requests" ? "active" : ""}>
                <Link to="/freelancer/bounty-requests">Bounty Requests</Link>
              </li>
              <li className={location.pathname === "/freelancer/assigned-bounties" ? "active" : ""}>
                <Link to="/freelancer/assigned-bounties">Assigned Bounties</Link>
              </li>
              <li className={location.pathname === "/freelancer/payment-pending" ? "active" : ""}>
                <Link to="/freelancer/payment-pending">Payment Pending</Link>
              </li>
              <li className={location.pathname === "/freelancer/completed-bounties" ? "active" : ""}>
                <Link to="/freelancer/completed-bounties">Completed Bounties</Link>
              </li>
              </ul>
            )}
            </>
          }
          {isClient &&
          <>
          <li onClick={() => setClientOpen(!clientOpen)}>
            👤 {expanded && 'Client ▾'}
          </li>
          {isClientOpen && expanded && (
            <ul className="submenu">
              <li className={location.pathname === "/client/created-bounties" ? "active" : ""}>
                <Link to="/client/created-bounties">Created Bounties</Link>
              </li>
              <li className={location.pathname === "/client/payment-pending" ? "active" : ""}>
                <Link to="/client/payment-pending">Payment Pending</Link>
              </li>
              <li className={location.pathname === "/client/completed-bounties" ? "active" : ""}>
                <Link to="/client/completed-bounties">Completed Bounties</Link>
              </li>
            </ul>
          )}
          </>
        }
        {/* {isAdmin &&
        <>
        <li onClick={() => setAdminOpen(!adminOpen)}>
            🧑‍🔧 {expanded && 'Admin ▾'}
          </li>
          {isAdminOpen && expanded && (
            <ul className="submenu">
              <li className={location.pathname === "/admin/users" ? "active" : ""}>
                <Link to="/admin/users">Users</Link>
              </li>
            </ul>
          )}
        </>
        } */}
         <li onClick={() => setGovernanceOpen(!governanceOpen)}>
            ⚖️ {expanded && 'Governance ▾'}
          </li>
          {isGovernanceOpen && expanded && (
            <ul className="submenu">
              <li className={location.pathname === "/voter/disputed-bounties" ? "active" : ""}>
                <Link to="/voter/disputed-bounties">Bounty Disputes</Link>
              </li>
              <li className={location.pathname === "/voter/reward-bounties" ? "active" : ""}>
                <Link to="/voter/reward-bounties">Voting Rewards</Link>
              </li>
            </ul>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;