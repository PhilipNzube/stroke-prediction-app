# 🚀 **Backend Deployment Guide**

## **Overview**

This guide covers deploying your Stroke Prediction AI backend to various hosting platforms. The backend is a Flask application that serves machine learning predictions and generates PDF reports.

## **🌐 Deployment Options**

### **Option 1: Railway (Recommended for Beginners)**

**Best for**: Quick deployment, free tier available
**Difficulty**: ⭐⭐

#### **Steps:**

1. **Sign up** at [railway.app](https://railway.app)
2. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```
3. **Login to Railway**:
   ```bash
   railway login
   ```
4. **Initialize project**:
   ```bash
   cd backend
   railway init
   ```
5. **Deploy**:
   ```bash
   railway up
   ```

#### **Environment Variables** (set in Railway dashboard):

```env
FLASK_ENV=production
PORT=5000
```

---

### **Option 2: Render (Free Tier Available)**

**Best for**: Free hosting, easy deployment
**Difficulty**: ⭐⭐

#### **Steps:**

1. **Sign up** at [render.com](https://render.com)
2. **Create new Web Service**
3. **Connect your GitHub repository**
4. **Configure service**:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT app:app`
   - **Environment**: Python 3.9+

#### **Environment Variables**:

```env
FLASK_ENV=production
PORT=5000
```

#### **Render-Specific Configuration**:

- **Root Directory**: Set to `backend` if your repo has frontend/backend structure
- **Use `render.yaml`**: For automatic configuration (recommended)
- **Start Command Fix**: Use `gunicorn --bind 0.0.0.0:$PORT app:app` (note the order)

#### **Troubleshooting Render Issues**:

1. **Red underline on `app:app`**: Use the correct gunicorn syntax order
2. **Alternative entry point**: Use `wsgi:app` instead of `app:app` if issues persist
3. **Build failures**: Ensure `requirements.txt` is in the root directory
4. **Port binding errors**: Render automatically sets `$PORT` environment variable
5. **Python version**: Specify `3.9.18` in `runtime.txt`

---

### **Option 3: Heroku (Paid)**

**Best for**: Professional deployment, extensive features
**Difficulty**: ⭐⭐⭐

#### **Steps:**

1. **Install Heroku CLI**:

   ```bash
   # Windows
   winget install --id=Heroku.HerokuCLI

   # macOS
   brew tap heroku/brew && brew install heroku
   ```

2. **Login to Heroku**:

   ```bash
   heroku login
   ```

3. **Create app**:

   ```bash
   heroku create your-stroke-app-name
   ```

4. **Add buildpacks**:

   ```bash
   heroku buildpacks:add heroku/python
   ```

5. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

---

### **Option 4: DigitalOcean App Platform**

**Best for**: Scalable, professional hosting
**Difficulty**: ⭐⭐⭐

#### **Steps:**

1. **Sign up** at [digitalocean.com](https://digitalocean.com)
2. **Create new App**
3. **Connect GitHub repository**
4. **Configure**:
   - **Source Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Run Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`

---

### **Option 5: AWS (Advanced)**

**Best for**: Enterprise, full control
**Difficulty**: ⭐⭐⭐⭐⭐

#### **Steps:**

1. **Create EC2 instance** (Ubuntu 20.04 LTS)
2. **Install dependencies**:
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv nginx
   ```
3. **Setup application**:
   ```bash
   cd /var/www
   sudo git clone <your-repo>
   cd stroke-prediction-app/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
4. **Setup systemd service**:

   ```bash
   sudo nano /etc/systemd/system/stroke-app.service
   ```

   ```ini
   [Unit]
   Description=Stroke Prediction App
   After=network.target

   [Service]
   User=ubuntu
   WorkingDirectory=/var/www/stroke-prediction-app/backend
   Environment="PATH=/var/www/stroke-prediction-app/backend/venv/bin"
   ExecStart=/var/www/stroke-prediction-app/backend/venv/bin/gunicorn app:app --bind 0.0.0.0:5000

   [Install]
   WantedBy=multi-user.target
   ```

5. **Start service**:
   ```bash
   sudo systemctl start stroke-app
   sudo systemctl enable stroke-app
   ```

---

## **🔧 Required Files for Deployment**

### **1. Procfile (for Heroku)**

Create `backend/Procfile`:

```
web: gunicorn app:app --bind 0.0.0.0:$PORT
```

### **2. Runtime.txt (for Python version)**

Create `backend/runtime.txt`:

```
python-3.9.18
```

### **3. Update requirements.txt**

Ensure your `requirements.txt` includes:

```txt
flask==2.3.3
flask-cors==4.0.0
scikit-learn==1.4.0
pandas==2.0.3
numpy==1.24.3
joblib==1.3.2
gunicorn==21.2.0
python-dotenv==1.0.0
reportlab==4.0.4
```

---

## **🌍 Environment Configuration**

### **Production Settings**

Update your `app.py` for production:

```python
if __name__ == '__main__':
    # Development
    if os.getenv('FLASK_ENV') == 'development':
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        # Production
        port = int(os.environ.get('PORT', 5000))
        app.run(host='0.0.0.0', port=port)
```

### **CORS Configuration**

For production, restrict CORS to your frontend domain:

```python
# Development
CORS(app)

# Production
CORS(app, origins=['https://yourdomain.com', 'https://www.yourdomain.com'])
```

---

## **📁 File Structure for Deployment**

```
backend/
├── app.py                 # Main Flask application
├── train_model.py         # ML training module
├── report_generator.py    # PDF report generator
├── requirements.txt       # Python dependencies
├── Procfile              # Heroku deployment file
├── runtime.txt           # Python version
├── models/               # Trained ML models
├── reports/              # Generated PDF reports
└── .env                  # Environment variables (don't commit)
```

---

## **🔒 Security Considerations**

### **1. Environment Variables**

Never commit sensitive data:

```bash
# .env file (local only)
FLASK_SECRET_KEY=your-secret-key-here
DATABASE_URL=your-database-url
API_KEYS=your-api-keys
```

### **2. CORS Restrictions**

Limit CORS to trusted domains:

```python
CORS(app, origins=['https://yourdomain.com'])
```

### **3. Rate Limiting**

Add rate limiting for production:

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)
```

---

## **📊 Monitoring & Logging**

### **1. Add Logging**

```python
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    if not os.path.exists('logs'):
        os.mkdir('logs')
    file_handler = RotatingFileHandler('logs/stroke-app.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('Stroke Prediction App startup')
```

### **2. Health Check Endpoint**

Your app already has `/api/health` - use this for monitoring.

---

## **🚀 Quick Deployment Checklist**

- [ ] **Code is working locally** ✅
- [ ] **Requirements.txt updated** ✅
- [ ] **Environment variables set** ✅
- [ ] **CORS configured for production** ✅
- [ ] **Procfile created (if using Heroku)** ✅
- [ ] **Runtime.txt created** ✅
- [ ] **Git repository clean** ✅
- [ ] **Deploy to chosen platform** ✅
- [ ] **Test deployed endpoints** ✅
- [ **Update frontend API URLs** ✅

---

## **🔗 Frontend Integration**

After deploying your backend, update your frontend to use the new API URL:

```javascript
// Update this in your frontend
const API_BASE_URL = "https://your-backend-domain.com";

// Instead of
const API_BASE_URL = "http://localhost:5000";
```

---

## **📞 Support**

If you encounter deployment issues:

1. **Check logs** in your hosting platform
2. **Verify environment variables**
3. **Test locally** with production settings
4. **Check CORS configuration**
5. **Verify Python version compatibility**

---

## **🎯 Recommended Deployment Path**

1. **Start with Railway** (easiest, free)
2. **Move to Render** (more features, still free)
3. **Scale to DigitalOcean** (when you need more resources)
4. **Enterprise: AWS/Azure** (when you need full control)

---

**Happy Deploying! 🚀**
