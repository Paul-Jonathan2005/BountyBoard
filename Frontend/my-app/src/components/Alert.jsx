import React, { useEffect, useState } from 'react';
import '../css/Alert.css';

function Alert({ message, type = 'success', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="alert-container">
      <div className={`alert-box ${type === 'error' ? 'alert-error' : 'alert-success'}`}>
        {message}
      </div>
    </div>
  );
}

export default Alert;