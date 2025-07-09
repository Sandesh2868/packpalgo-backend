# Frontend-Backend Connection Guide

## 🎯 Problem
Your Netlify frontend is using sample data instead of fetching from your Render backend because it's not configured with the correct backend URL.

## 🔗 Your Backend URL
Based on your Render configuration (`packpalgo-backend`), your backend URL is:
```
https://packpalgo-backend.onrender.com
```

## 🛠️ Frontend Configuration Needed

### 1. Environment Variables (Recommended Approach)

**For Netlify Deployment:**
1. Go to your Netlify dashboard
2. Navigate to your site → Site settings → Environment variables
3. Add this environment variable:
   ```
   REACT_APP_API_URL=https://packpalgo-backend.onrender.com
   ```
   OR (if using Vite):
   ```
   VITE_API_URL=https://packpalgo-backend.onrender.com
   ```

### 2. Frontend Code Changes

**Option A: Using Environment Variables (Recommended)**
```javascript
// In your API service file or where you make the budget request
const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.VITE_API_URL || 'http://localhost:3000';

const fetchBudgetEstimate = async (budgetData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/estimate-budget`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(budgetData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.budget;
  } catch (error) {
    console.error('Error fetching budget:', error);
    throw error;
  }
};
```

**Option B: Direct URL (Quick Fix)**
```javascript
// Replace any localhost or sample data calls with:
const API_BASE_URL = 'https://packpalgo-backend.onrender.com';

const fetchBudgetEstimate = async (budgetData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/estimate-budget`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(budgetData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.budget;
  } catch (error) {
    console.error('Error fetching budget:', error);
    throw error;
  }
};
```

## 🔍 Common Frontend Issues to Check

### 1. **Find Your Budget Estimation Code**
Look for files like:
- `src/components/BudgetEstimator.js/jsx`
- `src/services/api.js`
- `src/utils/budget.js`
- Any component that handles the "Estimate Budget" button

### 2. **Look for Sample/Mock Data**
Replace any hardcoded data like:
```javascript
// ❌ Remove this type of sample data:
const mockBudget = {
  Travel: 1000,
  Stay: 800,
  Food: 500,
  Misc: 300
};
```

### 3. **Update API Calls**
Replace calls to localhost:
```javascript
// ❌ Change this:
fetch('http://localhost:3000/api/estimate-budget')

// ✅ To this:
fetch('https://packpalgo-backend.onrender.com/api/estimate-budget')
```

## 🧪 Testing Steps

### 1. **Test Backend Directly**
First, verify your backend is working:
```bash
curl -X POST https://packpalgo-backend.onrender.com/api/estimate-budget \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Goa",
    "travelStyle": "Budget", 
    "travelMode": "Train",
    "people": 2,
    "days": 4
  }'
```

Expected response:
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

### 2. **Check Frontend Network Tab**
1. Open your Netlify site
2. Open Browser Developer Tools (F12)
3. Go to Network tab
4. Click "Estimate Budget" button
5. Check if you see a request to your Render URL

### 3. **Debug Steps**
If it's still not working:
1. Check if you see any network requests to `packpalgo-backend.onrender.com`
2. Look for CORS errors in the console
3. Verify the request payload matches what your backend expects

## 📂 Frontend File Structure Examples

### React App Structure
```
src/
├── components/
│   ├── BudgetEstimator.js    # Main component with estimate button
│   └── BudgetDisplay.js      # Shows the budget results
├── services/
│   └── api.js               # API calls to backend
├── utils/
│   └── constants.js         # API URL constants
└── App.js
```

### Key Files to Update
1. **API Service File** - Update the base URL
2. **Budget Component** - Ensure it calls the API service
3. **Environment Config** - Add production API URL

## 🚀 Deployment Steps

### For Netlify:
1. **Update your frontend code** with the correct API URL
2. **Set environment variables** in Netlify dashboard
3. **Redeploy** your site (push to git or manual deploy)

### For Local Testing:
1. Create a `.env` file in your frontend root:
   ```
   REACT_APP_API_URL=https://packpalgo-backend.onrender.com
   # OR for Vite:
   VITE_API_URL=https://packpalgo-backend.onrender.com
   ```
2. Restart your development server

## 🔧 Quick Verification Commands

**Check if backend is running:**
```bash
curl https://packpalgo-backend.onrender.com/
```

**Test budget endpoint:**
```bash
curl -X POST https://packpalgo-backend.onrender.com/api/estimate-budget \
  -H "Content-Type: application/json" \
  -d '{"destination":"Test","travelStyle":"Budget","travelMode":"Train","people":1,"days":1}'
```

## 📞 Need Help Finding Frontend Files?

If you can't locate your frontend API calls, look for:
1. **Button click handlers** that trigger budget estimation
2. **useEffect or useState** hooks in React components
3. **API service files** or utilities
4. **Constants or config** files with URLs

Share your frontend repository or the specific files where the budget estimation happens, and I can provide more targeted fixes!

---

**Next Step:** Update your frontend code with the backend URL above and redeploy to Netlify.