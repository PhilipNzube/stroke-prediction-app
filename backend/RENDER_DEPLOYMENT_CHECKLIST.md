# 🚀 **Render Deployment Checklist**

## **✅ Pre-Deployment Setup**

1. **Files Ready**:

   - ✅ `requirements.txt` - Python dependencies (Python 3.11+ compatible)
   - ✅ `runtime.txt` - Python version (3.11.9)
   - ✅ `.python-version` - Alternative Python version spec
   - ✅ `Procfile` - Gunicorn configuration
   - ✅ `render.yaml` - Render configuration
   - ✅ `wsgi.py` - Alternative entry point

2. **Repository Structure**:
   ```
   your-repo/
   ├── backend/           ← Root Directory for Render
   │   ├── app.py
   │   ├── requirements.txt
   │   ├── runtime.txt
   │   ├── Procfile
   │   ├── render.yaml
   │   └── wsgi.py
   └── frontend/
       └── src/
   ```

## **🚀 Render Deployment Steps**

### **Step 1: Create Render Account**

- Go to [render.com](https://render.com)
- Sign up with GitHub

### **Step 2: New Web Service**

- Click **"New +"** → **"Web Service"**
- Connect your GitHub repository

### **Step 3: Configure Service**

- **Name**: `stroke-prediction-backend`
- **Root Directory**: `backend` ⚠️ **IMPORTANT**
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn --bind 0.0.0.0:$PORT wsgi:app`

### **Step 4: Environment Variables**

- `FLASK_ENV`: `production`
- `PORT`: `10000` (or leave empty for auto)

### **Step 5: Deploy**

- Click **"Create Web Service"**
- Wait for build to complete (2-5 minutes)

## **🔧 Alternative Start Commands**

If you get errors, try these in order:

1. **Primary**: `gunicorn --bind 0.0.0.0:$PORT wsgi:app`
2. **Alternative**: `gunicorn --bind 0.0.0.0:$PORT app:app`
3. **Fallback**: `python wsgi.py`

## **🚨 Common Issues & Fixes**

### **Issue 1: "app:app" Red Underline**

- **Fix**: Use `wsgi:app` instead
- **Why**: Render prefers explicit entry points

### **Issue 2: Build Failures**

- **Fix**: Ensure `requirements.txt` is in `backend/` folder
- **Check**: All dependencies are compatible

### **Issue 3: Port Binding Errors**

- **Fix**: Use `$PORT` (Render sets this automatically)
- **Don't**: Hardcode port numbers

### **Issue 4: Module Not Found**

- **Fix**: Check `requirements.txt` includes all packages
- **Verify**: `reportlab`, `scikit-learn`, etc.

### **Issue 5: Python Version Compatibility**

- **Error**: `Cannot import 'setuptools.build_meta'` or build failures
- **Fix**: Use Python 3.11.9 (specified in `runtime.txt` and `.python-version`)
- **Why**: Python 3.13+ has breaking changes that affect older packages

## **✅ Post-Deployment**

1. **Test Health Check**: Visit `/api/health` endpoint
2. **Test Prediction**: Use `/api/predict` endpoint
3. **Update Frontend**: Change API URLs to your Render domain
4. **Monitor Logs**: Check Render dashboard for errors

## **🔗 Frontend Integration**

After deployment, update your frontend API calls:

```javascript
// Change from:
const response = await fetch('http://localhost:5000/api/predict', {

// To:
const response = await fetch('https://your-app-name.onrender.com/api/predict', {
```

## **📱 Quick Test Commands**

```bash
# Test locally first
cd backend
python app.py

# Test with curl
curl -X POST http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"age": 50, "hypertension": 0, "heart_disease": 0}'
```

---

**🎯 Goal**: Get your backend running on Render so users can access it from anywhere!

**💡 Pro Tip**: Use the `render.yaml` file for automatic configuration - it's much easier than manual setup!
