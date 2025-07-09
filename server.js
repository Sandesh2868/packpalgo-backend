import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// 🔓 CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "https://enchanting-gumdrop-6882e1.netlify.app",
      "http://localhost:3000",
      "http://localhost:5173",  // Vite dev server
      "http://localhost:4173"   // Vite preview
    ];
    
    // Check if the origin is in our allowed list or is a netlify.app domain
    if (allowedOrigins.includes(origin) || origin.includes('.netlify.app')) {
      return callback(null, true);
    }
    
    console.log('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
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
    console.log('Request received from origin:', req.headers.origin);
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    
    const { destination, travelStyle, travelMode, people, days } = req.body;

    // ✅ Validate required fields
    if (!destination || !travelStyle || !travelMode || !people || !days) {
      console.log('Validation failed - missing fields');
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