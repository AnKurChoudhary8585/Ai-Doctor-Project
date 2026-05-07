import React from 'react';
import { Thermometer, Activity, Brain, Eye, Stethoscope, AlertCircle } from 'lucide-react';
import './Symptoms.css';

const symptomsData = [
  { id: 1, title: 'Fever', icon: <Thermometer size={32} />, desc: 'High body temperature, sweating, chills, and muscle aches.' },
  { id: 2, title: 'Headache', icon: <Brain size={32} />, desc: 'Continuous pain in the head, throbbing or dull ache.' },
  { id: 3, title: 'Chest Pain', icon: <Activity size={32} />, desc: 'Discomfort in the chest area. Can be sharp or dull.', alert: true },
  { id: 4, title: 'Blurry Vision', icon: <Eye size={32} />, desc: 'Loss of sharpness of eyesight, making objects appear out of focus.' },
  { id: 5, title: 'Cough', icon: <Stethoscope size={32} />, desc: 'Sudden, forceful hacking sound to clear airways.' },
  { id: 6, title: 'Shortness of Breath', icon: <AlertCircle size={32} />, desc: 'Difficulty breathing or feeling like you cannot get enough air.', alert: true },
];

const Symptoms = ({ setActiveTab, setInitialChatMsg }) => {
  return (
    <div className="symptoms-container">
      <h2>Common <span className="bg-gradient-text">Symptoms</span></h2>
      <p className="subtitle">Select a symptom to learn more, or go to the Chatbot for an analysis.</p>
      
      <div className="symptoms-grid">
        {symptomsData.map(symp => (
          <div key={symp.id} className={`symptom-card ${symp.alert ? 'alert-card' : ''}`}>
            <div className="icon-wrapper">
              {symp.icon}
            </div>
            <h3>{symp.title}</h3>
            <p>{symp.desc}</p>
            <button className="check-btn" onClick={() => {
              setInitialChatMsg(`I am experiencing ${symp.title.toLowerCase()}. Can you help?`);
              setActiveTab('chatbot');
            }}>
              Analyze in Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Symptoms;
