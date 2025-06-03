import React, { useEffect, useState } from 'react';
import AlgorandLogo from "../assets/image.png";
import Alert from '../components/Alert';
import extractErrorMessage from '../utils/extractErrorMessage';
import { logoutUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../css/Header.css';

export default function Header() {
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState('');
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [type, setType] = useState("success")

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const token = localStorage.getItem('authToken');
        if (storedUsername && token) {
            setUsername(storedUsername);
            setIsLoggedIn(true);
        }
    }, []);

    const handleClick = async (e) => {
    e.preventDefault();
    try {
      const data = await logoutUser();
      setAlertMessage('Logout successful!');
      setShowAlert(true);
      setType("success")
      setTimeout(() => {
      navigate('/');
      }, 1500);
    } catch (error) {
        const msg = extractErrorMessage(error);
        setAlertMessage(msg);
        setShowAlert(true);
        setType("error")
    }
  };


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

        <header className="header">
            <div className="header-content">
                <div className="header-left">
                    {isLoggedIn && (
                        <span
                          className="username clickable"
                          onClick={() => navigate('/user-details')}
                        >
                          🧑‍💼 {username}
                        </span>
                    )}
                </div>
                <div className="header-center">
                    <img src={AlgorandLogo} alt="Algorand Logo" />
                    <h1>Bounty Board</h1>
                </div>
                <div className="header-right">
                    {isLoggedIn && (
                            <button onClick={handleClick} className="logout-button">Logout</button>
                    )}
                </div>
            </div>
        </header>
        </>
    );
}