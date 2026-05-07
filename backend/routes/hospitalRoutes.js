import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { location } = req.body;
    const searchLocation = location || "the user's area";
    
    // Use Gemini if API key is present
    if (process.env.GEMINI_API_KEY) {
      try {
        const aiPrompt = `List 3 major real hospitals or medical clinics in or near ${searchLocation}. Format your response strictly as a JSON array of objects. Each object must have exactly these keys: "name" (string), "address" (string), "type" (string, like 'General Hospital' or 'Urgent Care'), and "distance" (string, estimate like '2.5 km'). Return ONLY the JSON array. Do not use markdown backticks.`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: aiPrompt }] }] })
        });

        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
           let text = data.candidates[0].content.parts[0].text;
           text = text.replace(/```json/g, '').replace(/```/g, '').trim();
           const hospitals = JSON.parse(text);
           return res.json({ hospitals });
        }
      } catch (err) {
         console.error("Gemini Hospital Error:", err);
      }
    }
    
    // Fallback if no key or error
    res.json({ hospitals: [
      { name: "City General Hospital", address: "Downtown Area", type: "General Hospital", distance: "2.4 km" },
      { name: "Metro Care Clinic", address: "Westside", type: "Urgent Care", distance: "3.8 km" },
      { name: "University Medical Center", address: "University District", type: "Specialty Hospital", distance: "5.1 km" }
    ]});
  } catch (err) {
     res.status(500).json({ error: "Failed to fetch hospitals" });
  }
});

export default router;
