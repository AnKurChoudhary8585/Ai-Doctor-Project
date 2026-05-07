import React, { useState } from 'react';
import { Activity, ScanLine, Smile, Clock, Settings, User, LogOut, Moon, Info, MapPin } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ navigate, user }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [modalType, setModalType] = useState(null); // 'profile' or 'about'

  const toggleTheme = () => {
    document.body.classList.toggle('smooth-theme');
    setShowSettings(false);
  };

  const openModal = (type) => {
    setModalType(type);
    setShowSettings(false);
  };

  return (
    <div className="dashboard-screen">
      <header className="dash-header">
        <div className="user-info">
          <div className="avatar-placeholder" style={{overflow: 'hidden'}}>
            {user?.avatar ? <img src={user.avatar} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="avatar"/> : <User size={24} />}
          </div>
          <div>
            <h3>Hello, {user?.name.split(' ')[0] || "Guest"} <span className="wave">👋</span></h3>
            <p>How are you feeling?</p>
          </div>
        </div>
        
        <div className="settings-container">
          <button className="settings-btn" onClick={() => setShowSettings(!showSettings)}>
            <Settings size={24} />
          </button>
          
          {showSettings && (
            <div className="settings-dropdown">
              <div className="settings-header">
                <strong>Account Options</strong>
              </div>
              <button className="settings-item" onClick={() => openModal('profile')}>
                <User size={16} /> Profile Details
              </button>
              <button className="settings-item" onClick={toggleTheme}>
                <Moon size={16} /> Toggle Theme
              </button>
              <button className="settings-item" onClick={() => openModal('about')}>
                <Info size={16} /> About AI Doctor
              </button>
              <div className="settings-divider"></div>
              <button className="settings-item logout" onClick={() => {
                 navigate('splash');
                 setTimeout(() => window.location.reload(), 500);
              }}>
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="dash-section">
        <h4 className="section-title">Start Health Check</h4>
        <div className="primary-card" onClick={() => navigate('chatbot')}>
          <div className="card-icon"><Activity size={32} /></div>
          <div className="card-text">
            <h3>Primary Symptom Analysis</h3>
            <p>Check symptoms & get instant advice</p>
          </div>
          <div className="card-arrow">→</div>
        </div>
      </div>

      <div className="dash-section">
        <h4 className="section-title">More Options</h4>
        <div className="grid-options">
          <div className="grid-card cyan-grad" onClick={() => navigate('symptoms')}>
            <ScanLine size={28} />
            <h4>Browse Symptoms</h4>
          </div>
          <div className="grid-card purple-grad" onClick={() => navigate('first-aid')}>
            <Smile size={28} />
            <h4>First Aid Guide</h4>
          </div>
          <div className="grid-card mixed-grad" onClick={() => navigate('history')}>
            <Clock size={28} />
            <h4>Health History</h4>
          </div>
          <div className="grid-card cyan-grad" onClick={() => navigate('hospitals')}>
            <MapPin size={28} />
            <h4>Medical Centers</h4>
          </div>
        </div>
      </div>

      {modalType === 'profile' && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Profile Details</h3>
            <div style={{display:'flex', alignItems:'center', gap:'1rem', margin:'1.5rem 0'}}>
              <img src={user?.avatar || 'https://ui-avatars.com/api/?name=Guest'} alt="Avatar" style={{width:'60px', height:'60px', borderRadius:'50%'}} />
              <div>
                <p style={{fontSize:'1.1rem', fontWeight:'600', marginBottom:'5px'}}>{user?.name || "Guest User"}</p>
                <p style={{color:'var(--text-muted)'}}>{user?.email || "Not signed in"}</p>
              </div>
            </div>
            <button className="primary-btn" onClick={() => setModalType(null)}>Close</button>
          </div>
        </div>
      )}

      {modalType === 'about' && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-content text-center" onClick={e => e.stopPropagation()}>
            <Activity size={48} className="neon-icon cyan" style={{margin:'0 auto 1rem'}} />
            <h3>AI Doctor Project</h3>
            <p style={{color:'var(--text-muted)', margin:'1rem 0'}}>Version 1.0.0 Prototype<br/>Built for quick and accessible health triage.</p>
            <button className="primary-btn" onClick={() => setModalType(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
