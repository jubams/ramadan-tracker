import React from 'react';
import '../styles/GoalCard.css';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const GoalCard = ({ 
  goalConfig, 
  goalData, 
  onUpdateGoal,
  isDisabled 
}) => {
  const { id, name, label, icon, type, max, target } = goalConfig;
  
  const handleCheckboxChange = (e) => {
    onUpdateGoal(id, e.target.checked);
  };

  const handleNumberChange = (delta) => {
    const currentValue = goalData.value || 0;
    const newValue = Math.max(0, Math.min(max, currentValue + delta));
    onUpdateGoal(id, newValue);
  };

  const handleInputChange = (e) => {
    let value = parseInt(e.target.value) || 0;
    value = Math.max(0, Math.min(max, value));
    onUpdateGoal(id, value);
  };

  const getProgressColor = (percentage) => {
    if (percentage === 0) return 'var(--color-text-muted)';
    if (percentage < 100) return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  if (type === 'checkbox') {
    const isCompleted = goalData.completed;
    
    return (
      <label className={`goal-card checkbox ${isCompleted ? 'completed' : ''}`}>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleCheckboxChange}
          disabled={isDisabled}
        />
        <div className="goal-checkbox-visual">
          {isCompleted && <CheckIcon />}
        </div>
        <div className="goal-content">
          <span className="goal-icon">{icon}</span>
          <div className="goal-text">
            <span className="goal-name">{name}</span>
            <span className="goal-label">{label}</span>
          </div>
        </div>
        <div className="goal-status">
          {isCompleted ? (
            <span className="status-complete">✓ Done</span>
          ) : (
            <span className="status-pending">Pending</span>
          )}
        </div>
      </label>
    );
  }

  // Number type goal
  const currentValue = goalData.value || 0;
  const percentage = goalData.completionPercentage || 0;
  
  return (
    <div className="goal-card number">
      <div className="goal-header">
        <div className="goal-content">
          <span className="goal-icon">{icon}</span>
          <div className="goal-text">
            <span className="goal-name">{name}</span>
            <span className="goal-label">{label}</span>
          </div>
        </div>
        <div className="goal-percentage" style={{ color: getProgressColor(percentage) }}>
          {percentage}%
        </div>
      </div>
      
      <div className="goal-controls">
        <button 
          className="control-btn"
          onClick={() => handleNumberChange(-1)}
          disabled={isDisabled || currentValue <= 0}
        >
          −
        </button>
        
        <div className="number-display">
          <input
            type="number"
            value={currentValue}
            onChange={handleInputChange}
            min="0"
            max={max}
            disabled={isDisabled}
            className="number-input"
          />
          <span className="target-label">/ {target} target</span>
        </div>
        
        <button 
          className="control-btn"
          onClick={() => handleNumberChange(1)}
          disabled={isDisabled || currentValue >= max}
        >
          +
        </button>
      </div>
      
      <div className="goal-progress-bar">
        <div 
          className="progress-fill"
          style={{ 
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: getProgressColor(percentage)
          }}
        />
      </div>
    </div>
  );
};

export default GoalCard;
