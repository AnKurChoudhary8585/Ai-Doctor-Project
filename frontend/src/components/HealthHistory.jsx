import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import './HealthHistory.css';

const HealthHistory = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocalHistory = () => {
      const email = user?.email || 'guest';
      return JSON.parse(localStorage.getItem(`history_${email}`) || '[]').reverse();
    };

    if (user && user._id) {
      // Offline fallback
      if (user._id.toString().startsWith('offline_')) {
         setHistory(loadLocalHistory());
         setLoading(false);
         return;
      }

      fetch(`http://localhost:5000/api/history/${user._id}`)
        .then(res => {
           if (!res.ok) throw new Error("Backend offline");
           return res.json();
        })
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setHistory(data);
          } else {
            setHistory(loadLocalHistory());
          }
          setLoading(false);
        })
        .catch(err => {
          console.warn("Backend fetch failed, using local offline history.");
          setHistory(loadLocalHistory());
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div className="history-loader">Loading records...</div>;

  return (
    <div className="history-container">
      <h2>Your Health <span className="bg-gradient-text">History</span></h2>
      <p className="history-desc">Past symptom analyses and recommendations.</p>

      {!Array.isArray(history) || history.length === 0 ? (
        <div className="no-history">
          <Clock size={48} className="neon-icon cyan opacity-50" />
          <p>No health records found or offline mode active.</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map(record => (
            <div key={record._id || Math.random()} className={`history-card ${record.recommendDoctor ? 'alert-card' : ''}`}>
              <div className="history-date">
                {record.timestamp ? new Date(record.timestamp).toLocaleString() : 'Just now'}
              </div>
              <div className="history-query">
                <strong>You:</strong> {record.userMessage}
              </div>
              <div className="history-reply">
                <strong>AI Doctor:</strong> {record.botReply}
              </div>
              {record.recommendDoctor && (
                <div className="history-alert">
                  <AlertTriangle size={16} /> Doctor visit recommended
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default HealthHistory;
