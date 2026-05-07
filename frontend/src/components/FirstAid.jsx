import React from 'react';
import { HeartPulse, Droplet, Flame, ShieldAlert, Wind } from 'lucide-react';
import './FirstAid.css';

const firstAidData = [
  { id: 1, title: 'CPR Basics', icon: <HeartPulse size={32} />, desc: 'Push hard and fast in the center of the chest. 100-120 compressions per minute.' },
  { id: 2, title: 'Severe Bleeding', icon: <Droplet size={32} />, desc: 'Apply direct pressure with a clean cloth. Elevate the injured area if possible.' },
  { id: 3, title: 'Burns', icon: <Flame size={32} />, desc: 'Cool the burn under cool (not cold) running water for 10-15 minutes. Do not pop blisters.' },
  { id: 4, title: 'Choking', icon: <Wind size={32} />, desc: 'Perform Heimlich maneuver: 5 back blows followed by 5 abdominal thrusts.' },
  { id: 5, title: 'Shock', icon: <ShieldAlert size={32} />, desc: 'Lay the person down, elevate their legs, and keep them warm with a blanket.' },
];

const FirstAid = () => {
  return (
    <div className="firstaid-container">
      <h2>First Aid <span className="bg-gradient-text">Quick Guide</span></h2>
      <p className="subtitle">Immediate steps for common medical emergencies.</p>
      
      <div className="firstaid-grid">
        {firstAidData.map(fa => (
          <div key={fa.id} className="fa-card">
            <div className="fa-header">
              <div className="icon-wrapper cyan">
                {fa.icon}
              </div>
              <h3>{fa.title}</h3>
            </div>
            <div className="fa-body">
              <p>{fa.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FirstAid;
