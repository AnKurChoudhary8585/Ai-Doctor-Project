import React, { useState } from 'react';
import Splash from './components/Splash';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import Symptoms from './components/Symptoms';
import FirstAid from './components/FirstAid';
import HealthHistory from './components/HealthHistory';
import Hospitals from './components/Hospitals';
import { Activity, ArrowLeft } from 'lucide-react';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('splash');
  const [initialChatMsg, setInitialChatMsg] = useState('');
  const [user, setUser] = useState(null);

  const navigate = (page) => {
    setCurrentPage(page);
  };

  if (currentPage === 'splash') return <Splash onComplete={() => navigate('onboarding')} />;
  if (currentPage === 'onboarding') return <Onboarding onComplete={() => navigate('login')} />;
  if (currentPage === 'login') return <Login onLogin={(userData) => { setUser(userData); navigate('dashboard'); }} />;

  return (
    <>
      <iframe className="garden-iframe" src="/blooming_night_garden_animation/index.html" title="Garden Background"></iframe>
      <div className="app-container">
      {currentPage !== 'dashboard' && (
        <header className="app-header compact">
          <div className="logo-container" onClick={() => navigate('dashboard')} style={{cursor: 'pointer'}}>
            <Activity className="neon-icon cyan" size={24} />
            <h2>AI <span className="bg-gradient-text">Doctor</span></h2>
          </div>
          <button className="back-btn" onClick={() => navigate('dashboard')}>
            <ArrowLeft size={18} /> Back
          </button>
        </header>
      )}

      <main className="main-content">
        {currentPage === 'dashboard' && <Dashboard navigate={navigate} user={user} />}
        {currentPage === 'chatbot' && (
           <section className="chat-section full-width">
              <ChatInterface initialChatMsg={initialChatMsg} setInitialChatMsg={setInitialChatMsg} user={user} />
           </section>
        )}
        {currentPage === 'symptoms' && <Symptoms setActiveTab={navigate} setInitialChatMsg={setInitialChatMsg} />}
        {currentPage === 'first-aid' && <FirstAid />}
        {currentPage === 'history' && <HealthHistory user={user} />}
        {currentPage === 'hospitals' && <Hospitals />}
      </main>

      {/* Footer can be hidden on dashboard if preferred, but we will keep it simple */}
      {currentPage !== 'dashboard' && (
        <footer className="app-footer">
          <p>Disclaimer: This AI is for informational purposes only and is not a substitute for professional medical advice.</p>
        </footer>
      )}
    </div>
    </>
  );
}

export default App;
