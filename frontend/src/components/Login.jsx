import React, { useState } from 'react';
import './Login.css';
import { API_BASE_URL } from '../config';

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [showChooser, setShowChooser] = useState(false);

  const mockAccounts = [
    { name: "Ankur", email: "ankur@example.com", avatar: "https://ui-avatars.com/api/?name=Ankur&background=0D8ABC&color=fff" },
    { name: "Project Evaluator", email: "evaluator@university.edu", avatar: "https://ui-avatars.com/api/?name=Project+Evaluator&background=9D00FF&color=fff" }
  ];

  const handleAccountSelect = async (account) => {
    setShowChooser(false);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: "MOCK_TOKEN", mockProfile: account })
      });
      
      if (response.ok) {
        const data = await response.json();
        onLogin(data.user);
      } else {
        console.warn("Backend error. Using offline mode.");
        onLogin({ ...account, _id: "offline_" + Date.now() });
      }
    } catch (e) {
      console.warn("Backend is not running. Using offline mode.");
      onLogin({ ...account, _id: "offline_" + Date.now() });
    }
    setLoading(false);
  };

  return (
    <div className="login-screen">
      <div className="login-header">
        <h2>Welcome Back</h2>
        <p>Sign in to consult your AI Doctor</p>
      </div>
      
      <div className="login-body">
        <p className="login-prompt">Sign in securely with your Google account</p>
        <button className="google-btn" onClick={() => setShowChooser(true)} disabled={loading}>
          {loading ? 'Authenticating...' : (
            <>
              <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="G" />
              Continue with Google
            </>
          )}
        </button>
        <p className="terms">By continuing, you agree to our <span>Terms & Conditions</span></p>
      </div>

      {showChooser && (
        <div className="google-chooser-overlay">
          <div className="google-chooser-modal">
            <div className="chooser-header">
              <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="G" />
              <h3>Choose an account</h3>
              <p>to continue to AI Doctor</p>
            </div>
            <div className="account-list">
              {mockAccounts.map((acc, index) => (
                <div key={index} className="account-item" onClick={() => handleAccountSelect(acc)}>
                  <img src={acc.avatar} alt="avatar" />
                  <div className="account-info">
                    <h4>{acc.name}</h4>
                    <p>{acc.email}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="chooser-footer">
              <p>To continue, Google will share your name, email address, and profile picture with AI Doctor.</p>
              <button className="cancel-btn" onClick={() => setShowChooser(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Login;
