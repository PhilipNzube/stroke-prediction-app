# 🔗 **Frontend-Backend Connection Guide**

## **🎯 Overview**

This guide shows you how to connect your React frontend to your deployed Flask backend on Render.

## **📁 Files Created/Updated**

### **1. API Configuration** ✅

- **File**: `src/config/api.js`
- **Purpose**: Centralized API endpoint management
- **Features**: Auto-switches between development and production

### **2. Updated Components** ✅

- **PredictionForm**: Now uses centralized API config
- **Dashboard**: Fetches data from deployed backend
- **Results**: Downloads PDFs and shares results via deployed backend

### **3. Update Script** ✅

- **File**: `update-api-url.js`
- **Purpose**: Automatically updates production URL

## **🚀 How It Works**

### **Development Mode** (Local)

```javascript
// Automatically uses localhost:5000
const API_BASE_URL = "http://localhost:5000";
```

### **Production Mode** (Deployed)

```javascript
// Automatically uses your Render URL
const API_BASE_URL = "https://your-backend-name.onrender.com";
```

## **🔧 Step-by-Step Connection**

### **Step 1: Deploy Backend to Render**

1. Follow the Render deployment guide
2. Get your backend URL (e.g., `https://stroke-backend-123.onrender.com`)
3. Test that your backend is working

### **Step 2: Update Production URL**

```bash
# Option 1: Use the update script
node update-api-url.js

# Option 2: Manual update
# Edit src/config/api.js and change the production URL
```

### **Step 3: Deploy Frontend**

```bash
# Build for production
npm run build

# Deploy to your hosting platform (Vercel, Netlify, etc.)
```

## **🌐 Frontend Deployment Options**

### **Option 1: Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Option 2: Netlify**

```bash
# Build
npm run build

# Drag and drop dist/ folder to Netlify
```

### **Option 3: GitHub Pages**

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/your-repo",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

## **🔍 Testing the Connection**

### **1. Test Backend Health**

```bash
curl https://your-backend-name.onrender.com/api/health
```

### **2. Test Prediction Endpoint**

```bash
curl -X POST https://your-backend-name.onrender.com/api/predict \
  -H "Content-Type: application/json" \
  -d '{"age": 50, "hypertension": 0, "heart_disease": 0}'
```

### **3. Test Frontend Locally**

```bash
# Start frontend
npm run dev

# Complete a prediction form
# Check browser console for API calls
```

## **🚨 Common Issues & Fixes**

### **Issue 1: CORS Errors**

**Error**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Fix**: Your backend already has CORS configured, but if issues persist:

```python
# In backend/app.py
CORS(app, origins=['https://your-frontend-domain.com'])
```

### **Issue 2: API Timeout**

**Error**: Request takes too long or fails

**Fix**: Increase timeout in API config:

```javascript
// In src/config/api.js
timeout: 30000; // 30 seconds
```

### **Issue 3: Mixed Content**

**Error**: Frontend on HTTPS trying to call HTTP backend

**Fix**: Ensure your backend is on HTTPS (Render provides this automatically)

## **📱 Environment Variables (Alternative)**

If you prefer environment variables, create `.env` files:

### **Development** (`.env.development`)

```env
VITE_API_BASE_URL=http://localhost:5000
```

### **Production** (`.env.production`)

```env
VITE_API_BASE_URL=https://your-backend-name.onrender.com
```

Then update `src/config/api.js`:

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
```

## **✅ Connection Checklist**

- [ ] **Backend deployed** to Render ✅
- [ ] **Backend URL obtained** and tested ✅
- [ ] **API config updated** with production URL ✅
- [ ] **Frontend components updated** to use config ✅
- [ ] **Frontend deployed** to hosting platform ✅
- [ ] **Connection tested** end-to-end ✅

## **🎯 What Happens Now**

1. **Development**: Frontend calls `localhost:5000` (your local backend)
2. **Production**: Frontend calls `your-render-url.onrender.com` (deployed backend)
3. **Automatic**: No code changes needed when switching environments
4. **Centralized**: All API calls managed from one config file

## **🚀 Next Steps**

1. **Deploy your backend** to Render using the deployment guide
2. **Get your backend URL** from Render dashboard
3. **Update the production URL** in `src/config/api.js`
4. **Deploy your frontend** to Vercel/Netlify/GitHub Pages
5. **Test the complete system** end-to-end

---

**🎉 Your Stroke Prediction AI will now work from anywhere in the world!**

**💡 Pro Tip**: Use the `update-api-url.js` script to quickly switch between different backend URLs during development and testing.
