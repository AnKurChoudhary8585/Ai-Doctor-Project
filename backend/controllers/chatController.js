import History from '../models/History.js';

export const handleChat = async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let reply = "I'm your virtual health assistant. Could you describe your specific symptoms in more detail?";
    let recommendDoctor = false;

    // 1. USE REAL AI IF API KEY IS PROVIDED
    if (process.env.GEMINI_API_KEY) {
      try {
        const aiPrompt = `You are AI Doctor, a helpful, concise, virtual health assistant. Analyze the following user message: "${message}". Keep your response brief (2-3 sentences). Provide practical first-aid or general advice. If the symptom is severe, life-threatening, or requires medical attention (like chest pain, severe bleeding, difficulty breathing, high fever), you MUST end your response with EXACTLY the phrase: "[ALERT: DOCTOR_RECOMMENDED]". Do not use markdown bolding for the alert phrase.`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: aiPrompt }] }]
          })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates.length > 0) {
           let aiText = data.candidates[0].content.parts[0].text;
           
           if (aiText.includes('[ALERT: DOCTOR_RECOMMENDED]')) {
              recommendDoctor = true;
              aiText = aiText.replace('[ALERT: DOCTOR_RECOMMENDED]', '').trim();
           }
           reply = aiText;
        } else {
           console.error("Gemini API Error Response:", data);
           reply = "I encountered an error connecting to my AI brain. Check terminal logs.";
        }
      } catch (aiErr) {
        console.error("Fetch to Gemini failed:", aiErr);
        reply = "My AI services are temporarily offline. Please try again later.";
      }
    } 
    // 2. FALLBACK TO RULE-BASED SYSTEM IF NO API KEY
    else {
      const msg = message.toLowerCase();

      // Regular Chat Replies
      const chatRules = [
        { keys: ["who are you", "your name", "what are you"], reply: "I am AI Doctor, your virtual health and first-aid assistant. I'm here to help you evaluate symptoms!" },
        { keys: ["what can you do", "how can you help", "help", "features"], reply: "I can analyze basic health symptoms, provide first-aid advice for emergencies, and let you know if you should visit a real doctor." },
        { keys: ["hi", "hello", "hey", "greetings", "what's up"], reply: "Hello there! I am your AI Health Assistant. How are you feeling today?" },
        { keys: ["how are you", "how do you do"], reply: "I'm functioning perfectly and ready to help! What symptoms are you experiencing?" },
        { keys: ["thank", "thanks", "appreciate"], reply: "You're very welcome! Let me know if you need any more health guidance. Stay safe!" },
        { keys: ["emergency", "911", "dying"], reply: "If you are experiencing a life-threatening emergency, please call 911 or your local emergency number immediately!", alert: true },
        { keys: ["yes", "yup", "yeah", "correct"], reply: "Okay, got it. Could you elaborate slightly more on your symptoms?" },
        { keys: ["no", "nope", "nothing"], reply: "Alright. If anything changes or you notice new symptoms, I'll be here." },
        { keys: ["ok", "okay", "alright", "sure"], reply: "Understood. Let me know if you need anything else." }
      ];

      // Medical Rules
      const medicalRules = [
        { keys: ["fever", "temperature"], reply: "For a mild fever, stay hydrated, rest, and consider over-the-counter fever reducers like Paracetamol. If it exceeds 103°F (39.4°C) or lasts more than 3 days, please see a doctor." },
        { keys: ["headache", "migraine", "head hurts"], reply: "Headaches can be caused by dehydration, stress, or lack of sleep. Try drinking water, resting in a dark room, and taking a mild pain reliever." },
        { keys: ["chest pain", "heart attack", "heart"], reply: "Chest pain can be a sign of a serious medical emergency, such as a heart attack. Please seek immediate emergency medical care!", alert: true },
        { keys: ["cough", "sore throat"], reply: "For a cough or sore throat, warm liquids, honey, and throat lozenges can help. If you experience shortness of breath, consult a doctor immediately." },
        { keys: ["stomach", "nausea", "vomit"], reply: "For stomach upset or nausea, stick to bland foods (BRAT diet) and sip clear liquids." },
        { keys: ["cut", "bleeding", "wound"], reply: "Apply direct pressure to stop the bleeding. Clean the wound with mild soap and water. If it won't stop, go to the ER.", alertKeys: ["deep", "won't stop", "heavy"] },
        { keys: ["breathe", "breathing", "shortness of breath", "asthma"], reply: "Difficulty breathing can be a medical emergency. If you are struggling to catch your breath, please go to the ER immediately.", alert: true }
      ];

      for (let rule of chatRules) {
        if (rule.keys.some(k => msg.includes(k))) {
          reply = rule.reply;
          if (rule.alert) recommendDoctor = true;
          break;
        }
      }

      for (let rule of medicalRules) {
        if (rule.keys.some(k => msg.includes(k))) {
          reply = rule.reply;
          if (rule.alert) recommendDoctor = true;
          if (rule.alertKeys && rule.alertKeys.some(ak => msg.includes(ak))) recommendDoctor = true;
          break;
        }
      }
    }

    // Save to Database and Return
    setTimeout(async () => {
        if (userId && !userId.startsWith('offline_')) {
          try {
            await History.create({
              userId,
              userMessage: message,
              botReply: reply,
              recommendDoctor
            });
          } catch(e) { console.error("Error saving history:", e); }
        }

        res.json({
          reply,
          recommendDoctor,
          timestamp: new Date()
        });
    }, 500);

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
