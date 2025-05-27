import React, { useState } from 'react';
import '../css/CreateBountyForm.css'; 
import Alert from '../components/Alert';
import extractErrorMessage from '../utils/extractErrorMessage';
import { useNavigate } from 'react-router-dom';
import { createBounty } from '../services/api';

export default function CreateBountyForm({ onClose, setShowAlert, setType, setAlertMessage  }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    descrition:'',
    task_type: '',
    amount: '',
    deadline: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createBounty(formData);
      setAlertMessage('Bounty Created Successfully!');
      setShowAlert(true);
      setType("success")
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      const msg = extractErrorMessage(error);
      setAlertMessage(msg);
      setShowAlert(true);
      setType("error")
    }
    onClose();
  };

  return (        
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create Bounty</h2>
        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
          <input name="descrition" placeholder="Description" value={formData.descrition} onChange={handleChange} required />
          <input name="task_type" placeholder="Task Type" value={formData.task_type} onChange={handleChange} required />
          <input name="amount" type="number" placeholder="Reward (ALGOS)" value={formData.amount} onChange={handleChange} required />
          <input name="deadline" type="number" min="0" placeholder="Duration (months)" value={formData.deadline} onChange={handleChange} required />
          <div className="modal-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}