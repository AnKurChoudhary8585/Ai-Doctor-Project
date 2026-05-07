import React, { useEffect } from 'react';
import { Activity } from 'lucide-react';
import './Splash.css';

const Splash = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-screen">
      <div className="splash-logo">
        <Activity size={80} className="neon-icon cyan splash-icon" />
        <h1>AI <span className="bg-gradient-text">Doctor</span></h1>
        <p>Your Personal Health Assistant</p>
      </div>
    </div>
  );
};
export default Splash;
