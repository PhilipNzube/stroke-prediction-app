# Stroke Prediction and Recommendation System

A comprehensive web application that uses machine learning to predict stroke risk and provide personalized health recommendations.

## 🚀 Features

- **AI-Powered Prediction**: Advanced machine learning algorithms for accurate stroke risk assessment
- **Personalized Recommendations**: Tailored lifestyle, diet, and medical advice based on risk level
- **Comprehensive Dashboard**: Educational resources and stroke prevention insights
- **Responsive Design**: Modern, mobile-friendly interface using Material-UI
- **Real-time Analysis**: Instant risk assessment with detailed breakdowns
- **Data Privacy**: Secure handling of health information

## 🏗️ Architecture

- **Frontend**: React.js with Material-UI components
- **Backend**: Python Flask API with machine learning models
- **ML Models**: Random Forest, Decision Trees, Neural Networks
- **Data Processing**: Pandas, NumPy, Scikit-learn
- **Styling**: Material-UI with custom themes and animations

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd stroke-prediction-app
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

## 🚀 Running the Application

### Option 1: Run Both Frontend and Backend (Recommended)

```bash
npm run dev:full
```

### Option 2: Run Separately

**Terminal 1 - Backend:**

```bash
npm run backend
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📊 API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/predict` - Stroke risk prediction
- `GET /api/features` - Feature importance analysis
- `GET /api/statistics` - Global stroke statistics

## 🎯 Usage

### 1. Home Page

- Overview of the system
- Key statistics and features
- Call-to-action to start assessment

### 2. Risk Assessment

- Multi-step form for health data input
- Real-time validation and error handling
- Comprehensive health factor collection

### 3. Results Page

- Risk level categorization (Low/Moderate/High)
- Personalized recommendations
- Downloadable assessment report
- Share functionality

### 4. Dashboard

- Educational content about stroke prevention
- Risk factor analysis
- F.A.S.T. stroke symptoms guide
- Prevention tips and strategies

### 5. About Page

- Project information and methodology
- Research findings and objectives
- Technology stack details
- FAQ section

## 🔬 Machine Learning Model

### Features Used

- Age, Gender, Hypertension status
- Heart disease history
- Average glucose level, BMI
- Smoking status, Work type
- Residence type, Marital status

### Model Performance

- **Algorithm**: Random Forest Classifier
- **Accuracy**: 98.5%
- **Cross-validation**: 5-fold
- **Class balancing**: Applied for imbalanced data

### Risk Categories

- **Low Risk**: < 15% probability
- **Moderate Risk**: 15-35% probability
- **High Risk**: > 35% probability

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on all device sizes
- **Material Design**: Modern, intuitive interface
- **Smooth Animations**: Framer Motion for enhanced user experience
- **Accessibility**: WCAG compliant design
- **Dark/Light Theme**: Customizable color schemes

## 🔒 Security & Privacy

- **Data Encryption**: All health data is encrypted
- **No Data Storage**: Information is processed in real-time only
- **CORS Protection**: Secure API communication
- **Input Validation**: Comprehensive data validation

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🧪 Testing

### Frontend Testing

```bash
npm run lint
npm run build
```

### Backend Testing

```bash
cd backend
python -m pytest
```

## 🚀 Deployment

### Frontend Deployment

```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Backend Deployment

```bash
cd backend
gunicorn app:app
# Configure your web server (Nginx, Apache) to proxy to the Flask app
```

## 📚 Educational Resources

The system includes comprehensive educational content:

- Stroke risk factors and prevention
- F.A.S.T. stroke symptoms recognition
- Lifestyle modification guidelines
- Medical monitoring recommendations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of academic research at Federal University Lokoja, Kogi State.

## 👥 Team

- **Author**: OKPANACHI ENYOJO (SCI20CSC101)
- **Supervisor**: MR JATTO ABDULWAHAB
- **Department**: Computer Science, Faculty of Science
- **Institution**: Federal University Lokoja, Kogi State

## 📞 Support

For technical support or questions about the system:

- Check the FAQ section in the About page
- Review the documentation
- Contact the development team

## ⚠️ Disclaimer

This system is designed for educational and screening purposes only. It should not replace professional medical advice. Always consult with healthcare providers for proper diagnosis and treatment.

---

**Built with ❤️ for better healthcare outcomes**
