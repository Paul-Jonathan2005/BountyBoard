import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Alert from '../components/Alert';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import extractErrorMessage from '../utils/extractErrorMessage';
import '../css/Login.css';

function Login() {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState("success")
  const [formData, setFormData] = useState({
      username: '',
      password: '',
    });
  
  const handleChange = (e) => {
  const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      setAlertMessage('Login successful!');
      setShowAlert(true);
      setType("success")
      setTimeout(() => {
      navigate('/freelancer/bounty-types');
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
    <div className="login-container">
      <form onSubmit={handleSubmit}  className="login-form">
        <h2 className="login-title">Login</h2>
        <input
          type="text"
          name="username"
          placeholder="User Name"
          value={formData.username}
          onChange={handleChange}
          required
          className="login-input"
        />

        <input
          type="password"
          name = "password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="login-input"
        />
        <button
          type="submit"
          className="login-button"
        >
          Sign In
        </button>
        <p className="login-register-link">
          New user? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
    </>
  );
}

export default Login;
