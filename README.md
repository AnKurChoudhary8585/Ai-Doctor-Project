# AI Doctor Project

## 📖 Project Overview
The **AI Doctor Project** is a comprehensive, full-stack web application designed to act as a virtual health assistant. It provides users with preliminary health advice, first-aid information, symptom checking, and hospital recommendations. The platform features an AI-driven chatbot that analyzes symptoms and gives instant feedback, including alerting the user when a real medical professional's intervention is highly recommended. The project is designed with a premium, engaging "Blooming Night Garden" animated theme for an immersive user experience.

---

## 🛠️ Technology Stack

### Frontend
*   **Framework:** React 18
*   **Styling:** Custom CSS (with glowing neon aesthetics and gradient text)
*   **Icons:** `lucide-react`
*   **Background Animation:** Custom iframe integration for "Blooming Night Garden" theme

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (via Mongoose)
*   **AI Integration:** Google Gemini API 

---

## 📂 File Structure


Ai Doctor Project/
│
├── backend/                  
│   ├── controllers/         
│   │   └── chatController.js 
│   ├── models/               
│   │   ├── History.js        
│   │   └── User.js          
│   ├── routes/               
│   │   ├── authRoutes.js     
│   │   ├── chatRoutes.js     
│   │   ├── historyRoutes.js  
│   │   └── hospitalRoutes.js 
│   ├── server.js             
│   └── package.json          
│
└── frontend/                 
    ├── src/
    │   ├── components/       
    │   │   ├── ChatInterface.jsx 
    │   │   ├── Dashboard.jsx     
    │   │   ├── Symptoms.jsx      
    │   │   ├── FirstAid.jsx      
    │   │   ├── Login.jsx         
    │   │   └── ... (Splash, Onboarding, Hospitals, HealthHistory)
    │   ├── App.jsx      
    │   ├── App.css         
    │   ├── index.css         
    │   └── main.jsx          
    ├── index.html            
    ├── vite.config.js    
    └── package.json         




