# Trip Budget API

A simple Express.js API for calculating travel budget estimates.

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Start the server
npm start

# Server will run on http://localhost:3000
```

### Test the API
```bash
# Health check
curl http://localhost:3000/

# Budget estimation
curl -X POST http://localhost:3000/api/estimate-budget \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Goa",
    "travelStyle": "Budget",
    "travelMode": "Train",
    "people": 2,
    "days": 4
  }'
```

## 🌐 Deploy to Render

### 1. Push to GitHub
```bash
git add .
git commit -m "Convert to Express server for Render deployment"
git push origin main
```

### 2. Deploy on Render
1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure deployment:
   - **Name**: `packpalgo-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Port**: Leave empty (auto-detected from PORT env var)

### 3. Environment Variables (Optional)
- No environment variables required for basic functionality
- Add your frontend domain to CORS if needed

## 📋 API Endpoints

### GET /
Health check endpoint
```json
{
  "message": "Trip Budget API is running!",
  "status": "healthy",
  "endpoints": ["/api/estimate-budget"]
}
```

### POST /api/estimate-budget
Calculate travel budget
```json
{
  "destination": "Goa",
  "travelStyle": "Budget",
  "travelMode": "Train", 
  "people": 2,
  "days": 4
}
```

Response:
```json
{
  "budget": {
    "Travel": 2000,
    "Stay": 3200,
    "Food": 4000,
    "Misc": 300
  }
}
```

## 🔧 Configuration

### CORS
Currently configured for:
- `https://enchanting-gumdrop-6882e1.netlify.app`
- `http://localhost:3000`

Update the CORS origins in `server.js` if needed.

## 🐛 Error Handling

- **400**: Missing required fields
- **404**: Endpoint not found  
- **500**: Server error

All errors return JSON with helpful messages.

## 📝 Why Render > Vercel for this use case

- ✅ Better Express.js support
- ✅ Simpler deployment process  
- ✅ No serverless function limitations
- ✅ Easier debugging and logging
- ✅ More predictable pricing