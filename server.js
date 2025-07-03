import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// 🔓 CORS configuration
app.use(cors({
  origin: ["https://enchanting-gumdrop-6882e1.netlify.app", "http://localhost:3000"],
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// 📝 Parse JSON bodies
app.use(express.json());

// 🏠 Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: "Trip Budget API is running!",
    status: "healthy",
    endpoints: ["/api/estimate-budget"]
  });
});

// 💰 Budget estimation endpoint
app.post('/api/estimate-budget', (req, res) => {
  try {
    const { destination, travelStyle, travelMode, people, days } = req.body;

    // ✅ Validate required fields
    if (!destination || !travelStyle || !travelMode || !people || !days) {
      return res.status(400).json({ 
        error: "Missing required fields",
        required: ["destination", "travelStyle", "travelMode", "people", "days"],
        received: req.body
      });
    }

    // 🧮 Calculate budget (your AI logic / dummy response)
    const budget = {
      Travel: 1000 * people,
      Stay: 800 * days,
      Food: 500 * days * people,
      Misc: 300,
    };

    console.log(`Budget calculated for ${people} people to ${destination} for ${days} days`);
    
    return res.status(200).json({ budget });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ 
      error: "Something went wrong", 
      details: error.message 
    });
  }
});

// 🚫 Handle 404s
app.use('*', (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `${req.method} ${req.originalUrl} is not available`,
    availableEndpoints: [
      "GET /",
      "POST /api/estimate-budget"
    ]
  });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/`);
  console.log(`💰 Budget API: http://localhost:${PORT}/api/estimate-budget`);
});