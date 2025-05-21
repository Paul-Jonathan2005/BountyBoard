

import { useState } from 'react';

function Register() {
  const [paraWallet, setParaWallet] = useState('');
  const [isValidPara, setIsValidPara] = useState(null);

  const validateParaWallet = () => {
    // if (paraWallet.length === 58 && paraWallet.startsWith('P')) {
    //   setIsValidPara(true);
    //   alert('Para Wallet address is valid!');
    // } else {
    //   setIsValidPara(false);
    //   alert('Invalid Para Wallet address.');
    // }
    setIsValidPara(true)
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
      <form style={{
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

        <input type="text" placeholder="Username" required style={inputStyle} />
        <input type="password" placeholder="Password" required style={inputStyle} />
        <input type="text" placeholder="First Name" required style={inputStyle} />
        <input type="text" placeholder="Last Name" required style={inputStyle} />
        <input type="tel" placeholder="Phone Number" required style={inputStyle} />
        <input type="email" placeholder="Email" required style={inputStyle} />

        <select required style={{ ...inputStyle, marginBottom: '1rem' }}>
          <option value="" disabled selected>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input type="number" placeholder="Age" min="0" max="120" required style={inputStyle} />
        <input type="url" placeholder="LinkedIn Profile Link" style={inputStyle} />

        <div style={{ display: 'flex', marginBottom: '1rem', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Para Wallet Address"
            value={paraWallet}
            onChange={(e) => setParaWallet(e.target.value)}
            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            type="button"
            onClick={validateParaWallet}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#1a3744',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Validate
          </button>
        </div>

        {isValidPara && <button
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
        }
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