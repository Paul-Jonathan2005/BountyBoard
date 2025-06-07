import React from 'react';
import TaskTypeTile from './TaskTypeTile';
import '../css/TaskTypeGrid.css';

export default function TaskTypeGrid({ taskTypes }) {
  return (
    <div className="task-type-grid">
      {taskTypes.map((type, index) => (
        <TaskTypeTile key={index} taskType={type} index={index} />
      ))}
    </div>
  );
}