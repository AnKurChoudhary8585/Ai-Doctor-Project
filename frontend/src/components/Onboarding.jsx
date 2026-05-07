import React, { useState } from 'react';
import { Stethoscope, Clock, ShieldCheck } from 'lucide-react';
import './Onboarding.css';

const slides = [
  { icon: <Stethoscope size={64} />, title: "Symptom Checker", desc: "Input your symptoms and get a detailed analysis of potential conditions and risk levels." },
  { icon: <Clock size={64} />, title: "24x7 Support", desc: "Access health guidance anytime, anywhere. Your personal health companion is always awake." },
  { icon: <ShieldCheck size={64} />, title: "Secure & Private", desc: "Your health data is completely secure and private with end-to-end encryption." }
];

const Onboarding = ({ onComplete }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="onboarding-screen">
      <div className="onboarding-content">
        <div className="onboarding-icon cyan-glow">
          {slides[current].icon}
        </div>
        <h2>{slides[current].title}</h2>
        <p>{slides[current].desc}</p>
      </div>
      
      <div className="onboarding-dots">
        {slides.map((_, i) => (
          <div key={i} className={`dot ${i === current ? 'active' : ''}`} />
        ))}
      </div>

      <div className="onboarding-controls">
        <button className="skip-btn" onClick={onComplete}>Skip</button>
        <button className="next-btn" onClick={() => {
          if (current === slides.length - 1) onComplete();
          else setCurrent(prev => prev + 1);
        }}>
          {current === slides.length - 1 ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
};
export default Onboarding;
