import React, { useState, useEffect } from 'react';
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
		"/freelancer/dashboard",
		"/freelancer/bounty-types",
		"/freelancer/bounty-requests",
		"/freelancer/assigned-bounties",
		"/freelancer/payment-pending",
		"/freelancer/completed-bounties"
	];

	const clientPaths = [
		"/client/dashboard",
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
		if (userRole === "CLIENT" || userRole === "ADMIN" || userRole === "CLIENT-FREELANCER") {
			setIsClient(true)
		}
		if (userRole === "FREELANCER" || userRole === "ADMIN" || userRole === "CLIENT-FREELANCER") {
			setIsFreelancer(true)
		}
		if (userRole === "ADMIN") {
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
									<Link to="/freelancer/dashboard">
										<li className={location.pathname === "/freelancer/dashboard" ? "active" : ""}>
											Dashboard
										</li>
									</Link>
									<Link to="/freelancer/bounty-types">
										<li className={location.pathname === "/freelancer/bounty-types" ? "active" : ""}>
											Bounty Types
										</li>
									</Link>
									<Link to="/freelancer/bounty-requests">
										<li className={location.pathname === "/freelancer/bounty-requests" ? "active" : ""}>
											Bounty Requests
										</li>
									</Link>

									<Link to="/freelancer/assigned-bounties">
										<li className={location.pathname === "/freelancer/assigned-bounties" ? "active" : ""}>
											Assigned Bounties
										</li>
									</Link>
									<Link to="/freelancer/payment-pending">
										<li className={location.pathname === "/freelancer/payment-pending" ? "active" : ""}>
											Payment Pending
										</li>
									</Link>
									<Link to="/freelancer/completed-bounties">
										<li className={location.pathname === "/freelancer/completed-bounties" ? "active" : ""}>
											Completed Bounties
										</li>
									</Link>
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
									<Link to="/client/dashboard">
										<li className={location.pathname === "/client/dashboard" ? "active" : ""}>
											Dashboard
										</li>
									</Link>
									<Link to="/client/created-bounties">
										<li className={location.pathname === "/client/created-bounties" ? "active" : ""}>
											Created Bounties
										</li>
									</Link>
									<Link to="/client/payment-pending">
										<li className={location.pathname === "/client/payment-pending" ? "active" : ""}>
											Payment Pending
										</li>
									</Link>
									<Link to="/client/completed-bounties">
										<li className={location.pathname === "/client/completed-bounties" ? "active" : ""}>
											Completed Bounties
										</li>
									</Link>
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
							<Link to="/voter/disputed-bounties">
								<li className={location.pathname === "/voter/disputed-bounties" ? "active" : ""}>
									Bounty Disputes
								</li>
							</Link>
							<Link to="/voter/reward-bounties">
								<li className={location.pathname === "/voter/reward-bounties" ? "active" : ""}>
									Voting Rewards
								</li>
							</Link>
						</ul>
					)}
				</ul>
			</nav>
		</div>
	);
}

export default NavBar;