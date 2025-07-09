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

// � Destination cost factors and travel calculation logic
const DESTINATION_COSTS = {
  // Domestic India
  'goa': { costFactor: 1.0, region: 'domestic' },
  'kerala': { costFactor: 0.9, region: 'domestic' },
  'rajasthan': { costFactor: 0.8, region: 'domestic' },
  'himachal pradesh': { costFactor: 0.7, region: 'domestic' },
  'uttarakhand': { costFactor: 0.7, region: 'domestic' },
  'kashmir': { costFactor: 1.1, region: 'domestic' },
  'mumbai': { costFactor: 1.3, region: 'domestic' },
  'delhi': { costFactor: 1.2, region: 'domestic' },
  'bangalore': { costFactor: 1.1, region: 'domestic' },
  'chennai': { costFactor: 1.0, region: 'domestic' },
  'kolkata': { costFactor: 0.9, region: 'domestic' },
  'agra': { costFactor: 0.8, region: 'domestic' },
  'varanasi': { costFactor: 0.7, region: 'domestic' },
  'rishikesh': { costFactor: 0.8, region: 'domestic' },
  'manali': { costFactor: 0.9, region: 'domestic' },
  'ladakh': { costFactor: 1.2, region: 'domestic' },

  // South Asia
  'nepal': { costFactor: 0.6, region: 'south_asia' },
  'bhutan': { costFactor: 1.8, region: 'south_asia' },
  'sri lanka': { costFactor: 0.8, region: 'south_asia' },
  'maldives': { costFactor: 3.5, region: 'south_asia' },

  // Southeast Asia
  'thailand': { costFactor: 1.2, region: 'southeast_asia' },
  'vietnam': { costFactor: 0.9, region: 'southeast_asia' },
  'indonesia': { costFactor: 1.0, region: 'southeast_asia' },
  'malaysia': { costFactor: 1.1, region: 'southeast_asia' },
  'singapore': { costFactor: 2.8, region: 'southeast_asia' },
  'philippines': { costFactor: 1.0, region: 'southeast_asia' },
  'cambodia': { costFactor: 0.8, region: 'southeast_asia' },
  'bali': { costFactor: 1.1, region: 'southeast_asia' },

  // East Asia
  'japan': { costFactor: 4.0, region: 'east_asia' },
  'south korea': { costFactor: 2.5, region: 'east_asia' },
  'china': { costFactor: 1.5, region: 'east_asia' },
  'hong kong': { costFactor: 3.0, region: 'east_asia' },

  // Middle East
  'dubai': { costFactor: 2.5, region: 'middle_east' },
  'turkey': { costFactor: 1.3, region: 'middle_east' },
  'israel': { costFactor: 2.8, region: 'middle_east' },
  'jordan': { costFactor: 1.8, region: 'middle_east' },

  // Europe
  'france': { costFactor: 3.5, region: 'europe' },
  'italy': { costFactor: 3.2, region: 'europe' },
  'spain': { costFactor: 2.8, region: 'europe' },
  'germany': { costFactor: 3.3, region: 'europe' },
  'uk': { costFactor: 4.0, region: 'europe' },
  'netherlands': { costFactor: 3.5, region: 'europe' },
  'switzerland': { costFactor: 5.0, region: 'europe' },
  'greece': { costFactor: 2.5, region: 'europe' },
  'portugal': { costFactor: 2.3, region: 'europe' },
  'eastern europe': { costFactor: 1.8, region: 'europe' },

  // Americas
  'usa': { costFactor: 4.2, region: 'americas' },
  'canada': { costFactor: 3.8, region: 'americas' },
  'mexico': { costFactor: 1.5, region: 'americas' },
  'brazil': { costFactor: 1.8, region: 'americas' },
  'argentina': { costFactor: 1.6, region: 'americas' },
  'peru': { costFactor: 1.2, region: 'americas' },

  // Africa
  'south africa': { costFactor: 1.5, region: 'africa' },
  'egypt': { costFactor: 1.0, region: 'africa' },
  'morocco': { costFactor: 1.2, region: 'africa' },
  'kenya': { costFactor: 1.3, region: 'africa' },

  // Oceania
  'australia': { costFactor: 4.5, region: 'oceania' },
  'new zealand': { costFactor: 4.0, region: 'oceania' }
};

const TRAVEL_STYLE_MULTIPLIERS = {
  'budget': { accommodation: 0.6, food: 0.7, activities: 0.5 },
  'mid-range': { accommodation: 1.0, food: 1.0, activities: 1.0 },
  'luxury': { accommodation: 2.5, food: 1.8, activities: 2.0 }
};

function getDestinationInfo(destination) {
  const normalizedDestination = destination.toLowerCase().trim();
  
  // Direct match
  if (DESTINATION_COSTS[normalizedDestination]) {
    return DESTINATION_COSTS[normalizedDestination];
  }
  
  // Partial match
  for (const [key, value] of Object.entries(DESTINATION_COSTS)) {
    if (normalizedDestination.includes(key) || key.includes(normalizedDestination)) {
      return value;
    }
  }
  
  // Default for unknown destinations
  return { costFactor: 1.5, region: 'international' };
}

function calculateTravelCost(destination, travelMode, people, destInfo) {
  const baseCosts = {
    domestic: {
      'flight': 8000,
      'train': 2000,
      'bus': 1200,
      'car': 3000
    },
    south_asia: {
      'flight': 15000,
      'train': 5000,
      'bus': 3000,
      'car': 8000
    },
    southeast_asia: {
      'flight': 25000,
      'train': 12000,
      'bus': 8000,
      'car': 15000
    },
    east_asia: {
      'flight': 45000,
      'train': 20000,
      'bus': 15000,
      'car': 25000
    },
    middle_east: {
      'flight': 35000,
      'train': 18000,
      'bus': 12000,
      'car': 20000
    },
    europe: {
      'flight': 55000,
      'train': 25000,
      'bus': 18000,
      'car': 30000
    },
    americas: {
      'flight': 80000,
      'train': 35000,
      'bus': 25000,
      'car': 40000
    },
    africa: {
      'flight': 45000,
      'train': 20000,
      'bus': 15000,
      'car': 25000
    },
    oceania: {
      'flight': 85000,
      'train': 35000,
      'bus': 25000,
      'car': 40000
    }
  };

  const regionCosts = baseCosts[destInfo.region] || baseCosts.domestic;
  const basePrice = regionCosts[travelMode.toLowerCase()] || regionCosts.flight;
  
  return Math.round(basePrice * people * destInfo.costFactor);
}

function calculateAccurateBudget({ destination, travelStyle, travelMode, people, days }) {
  const destInfo = getDestinationInfo(destination);
  const styleMultipliers = TRAVEL_STYLE_MULTIPLIERS[travelStyle.toLowerCase()] || TRAVEL_STYLE_MULTIPLIERS['mid-range'];
  
  // Base costs per person per day (in INR)
  const baseCosts = {
    accommodation: 2500,
    food: 1200,
    activities: 800,
    local_transport: 400
  };

  // Calculate each component
  const travel = calculateTravelCost(destination, travelMode, people, destInfo);
  
  const accommodation = Math.round(
    baseCosts.accommodation * 
    days * 
    (people > 1 ? people * 0.8 : people) * // Group discount
    destInfo.costFactor * 
    styleMultipliers.accommodation
  );
  
  const food = Math.round(
    baseCosts.food * 
    days * 
    people * 
    destInfo.costFactor * 
    styleMultipliers.food
  );
  
  const activities = Math.round(
    baseCosts.activities * 
    days * 
    people * 
    destInfo.costFactor * 
    styleMultipliers.activities
  );
  
  const localTransport = Math.round(
    baseCosts.local_transport * 
    days * 
    people * 
    destInfo.costFactor
  );
  
  // Miscellaneous (shopping, tips, emergency fund)
  const miscellaneous = Math.round((travel + accommodation + food + activities) * 0.15);
  
  return {
    Travel: travel,
    Stay: accommodation,
    Food: food,
    Activities: activities,
    LocalTransport: localTransport,
    Miscellaneous: miscellaneous
  };
}

// �🏠 Health check endpoint
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

    // 🧮 Calculate accurate budget based on destination and preferences
    const budget = calculateAccurateBudget({
      destination,
      travelStyle,
      travelMode,
      people,
      days
    });

    console.log(`Budget calculated for ${people} people to ${destination} for ${days} days:`, budget);
    
    return res.status(200).json({ 
      budget,
      details: {
        destination,
        travelStyle,
        travelMode,
        people,
        days,
        currency: "INR"
      }
    });
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