import React from 'react';
import Alert from '../components/Alert';
import extractErrorMessage from '../utils/extractErrorMessage';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';


function Register() {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState("success")
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    gender: '',
    age: '',
    company_name: '',
    linkedin_profile_link: '',
    pera_wallet_address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(formData);
      setAlertMessage('Registration successful!');
      setShowAlert(true);
      setType("success")
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      const msg = extractErrorMessage(error);
      setAlertMessage(msg);
      setShowAlert(true);
      setType("error")
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 80px)',
      backgroundColor: '#f9fafb',
      padding: '2rem',
      marginTop: '45px'
    }}>
      {showAlert && (
        <Alert
          message={alertMessage}
          type={type}
          duration={3000}
          onClose={() => setShowAlert(false)}
        />
      )}

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '360px',
        fontFamily: 'Ubuntu, sans-serif'
      }}>
        <h2 style={{ marginBottom: '1rem', textAlign: 'center', color: '#111827' }}>Register</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="tel"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          style={{ ...inputStyle, marginBottom: '1rem' }}
        >
          <option value="" disabled>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input
          type="number"
          name="age"
          placeholder="Age in Years"
          min="0"
          max="120"
          value={formData.age}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="company_name"
          placeholder="Company Name"
          value={formData.company_name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="url"
          name="linkedin_profile_link"
          placeholder="LinkedIn Profile Link"
          value={formData.linkedin_profile_link}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="pera_wallet_address"
          placeholder="Para Wallet Address"
          value={formData.pera_wallet_address}
          onChange={handleChange}
          style={inputStyle}
        />
        <button
          type="submit"
          style={{
            padding: '0.75rem',
            backgroundColor: '#0f2027',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: '0.5rem',
  marginBottom: '1rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

export default Register;