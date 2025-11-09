import React from 'react';
import { SKILL_OPTIONS } from '../utils/constants';

export default function LevelUpModal({ onSelectSkill }) {
  const getRandomSkills = () => {
    const shuffled = [...SKILL_OPTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  };

  const skills = getRandomSkills();

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ 
          fontSize: '3rem', 
          color: '#ffd700', 
          textAlign: 'center', 
          marginBottom: '1rem',
          textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
        }}>
          LEVEL UP!
        </h2>
        <p style={{ 
          color: '#fff', 
          textAlign: 'center', 
          marginBottom: '2rem',
          fontSize: '1.2rem'
        }}>
          Choose an upgrade:
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1rem' 
        }}>
          {skills.map(skill => (
            <button
              key={skill.id}
              onClick={() => onSelectSkill(skill.id)}
              className="skill-button"
            >
              <div className="skill-icon">{skill.icon}</div>
              <div className="skill-name">{skill.name}</div>
              <div className="skill-desc">{skill.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}