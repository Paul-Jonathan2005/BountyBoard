import React from 'react';
import '../css/TaskTypeTile.css';
import { useNavigate } from 'react-router-dom';

export default function TaskTypeTile({ taskType, index }) {
    const gradients = [
        'gradient-bg-1',
        'gradient-bg-2',
        'gradient-bg-3',
        'gradient-bg-4',
        'gradient-bg-5',
        'gradient-bg-6'
    ];
    const gradientClass = gradients[index % gradients.length];
    const navigate = useNavigate();

    return (
        <div
            className={`task-type-tile ${gradientClass}`}
            onClick={() => navigate(`/freelancer/task-type/${taskType}`)}
            style={{ cursor: 'pointer' }}
        >
            <span>{taskType}</span>
        </div>
    );
}