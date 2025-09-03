from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import json
from datetime import datetime, timedelta
from report_generator import generate_stroke_report

app = Flask(__name__)
CORS(app)

# Global variables for the model and encoders
model = None
label_encoders = {}
scaler = None
imputer = None
feature_names = []
model_metadata = {}

def load_or_train_model():
    """Load existing trained model or fall back to synthetic data training"""
    global model, label_encoders, scaler, imputer, feature_names, model_metadata
    
    # Get the current working directory
    current_dir = os.getcwd()
    print(f"🔍 Current working directory: {current_dir}")
    
    # Debug: List all files in current directory
    print("🔍 Files in current directory:")
    try:
        for file in os.listdir(current_dir):
            file_path = os.path.join(current_dir, file)
            if os.path.isfile(file_path):
                size = os.path.getsize(file_path)
                print(f"   📄 {file} ({size} bytes)")
            elif os.path.isdir(file_path):
                print(f"   📁 {file}/")
    except Exception as e:
        print(f"   ❌ Error listing directory: {e}")
    
    # First, try to load from models directory (look for most recent trained model)
    models_dir = 'models'
    if os.path.exists(models_dir):
        print(f"🔍 Found models directory: {os.path.abspath(models_dir)}")
        # Look for the most recent model files
        model_files = [f for f in os.listdir(models_dir) if f.endswith('_metadata.json')]
        if model_files:
            # Sort by timestamp (newest first)
            model_files.sort(reverse=True)
            latest_metadata = model_files[0]
            
            try:
                metadata_path = os.path.join(models_dir, latest_metadata)
                print(f"🔍 Loading metadata from: {os.path.abspath(metadata_path)}")
                
                with open(metadata_path, 'r') as f:
                    metadata = json.load(f)
                
                # Convert relative paths to absolute paths
                model_path = metadata['model_path']
                components_path = metadata['components_path']
                
                # If paths are relative, make them absolute
                if not os.path.isabs(model_path):
                    model_path = os.path.join(current_dir, model_path)
                if not os.path.isabs(components_path):
                    components_path = os.path.join(current_dir, components_path)
                
                print(f"🔍 Model path: {model_path}")
                print(f"🔍 Components path: {components_path}")
                
                # Check if files exist
                if not os.path.exists(model_path):
                    print(f"❌ Model file not found: {model_path}")
                    raise FileNotFoundError(f"Model file not found: {model_path}")
                if not os.path.exists(components_path):
                    print(f"❌ Components file not found: {components_path}")
                    raise FileNotFoundError(f"Components file not found: {components_path}")
                
                # Load the model and components
                model = joblib.load(model_path)
                components = joblib.load(components_path)
                
                label_encoders = components['label_encoders']
                scaler = components['scaler']
                imputer = components['imputer']
                feature_names = components['feature_names']
                model_metadata = metadata
                
                print(f"✅ Loaded trained model: {metadata['model_name']}")
                print(f"   Trained on: {metadata['timestamp']}")
                print(f"   Features: {len(feature_names)}")
                return True
                
            except Exception as e:
                print(f"⚠️  Failed to load trained model: {e}")
                print("   Falling back to synthetic data training...")
    
    # Second, try to load the model from root directory (for Render deployment)
    root_model_path = os.path.join(current_dir, 'stroke_model.joblib')
    root_components_path = os.path.join(current_dir, 'stroke_model_components.joblib')
    
    if os.path.exists(root_model_path) and os.path.exists(root_components_path):
        try:
            print(f"🔍 Found model files in root directory...")
            print(f"   Model: {root_model_path}")
            print(f"   Components: {root_components_path}")
            
            model = joblib.load(root_model_path)
            components = joblib.load(root_components_path)

            label_encoders = components['label_encoders']
            scaler = components['scaler']
            imputer = components['imputer']
            feature_names = components['feature_names']

            print(f"✅ Loaded trained model from root directory")
            print(f"   Features: {len(feature_names)}")
            return True

        except Exception as e:
            print(f"⚠️  Failed to load model from root: {e}")
    
    # Fall back to synthetic data training
    print("🔄 No trained model found. Training with synthetic data...")
    return train_synthetic_model()

def train_synthetic_model():
    """Train model with synthetic data (fallback)"""
    global model, label_encoders, scaler, feature_names
    
    # Create synthetic stroke dataset based on the research paper
    np.random.seed(42)
    n_samples = 5110
    
    # Generate synthetic data
    data = {
        'id': range(1, n_samples + 1),
        'gender': np.random.choice(['Male', 'Female'], n_samples),
        'age': np.random.normal(65, 15, n_samples).clip(18, 100).astype(int),
        'hypertension': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
        'heart_disease': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
        'ever_married': np.random.choice(['Yes', 'No'], n_samples, p=[0.7, 0.3]),
        'work_type': np.random.choice(['Private', 'Self-employed', 'Govt_job', 'children'], n_samples, p=[0.6, 0.2, 0.15, 0.05]),
        'Residence_type': np.random.choice(['Urban', 'Rural'], n_samples, p=[0.6, 0.4]),
        'avg_glucose_level': np.random.normal(120, 40, n_samples).clip(50, 300),
        'bmi': np.random.normal(28, 8, n_samples).clip(15, 50),
        'smoking_status': np.random.choice(['formerly smoked', 'never smoked', 'smokes', 'Unknown'], n_samples, p=[0.2, 0.6, 0.15, 0.05])
    }
    
    df = pd.DataFrame(data)
    
    # Create stroke target based on risk factors
    stroke_prob = (
        (df['age'] > 65) * 0.3 +
        (df['hypertension'] == 1) * 0.4 +
        (df['heart_disease'] == 1) * 0.35 +
        (df['avg_glucose_level'] > 140) * 0.25 +
        (df['bmi'] > 30) * 0.2 +
        (df['smoking_status'] == 'smokes') * 0.3 +
        (df['gender'] == 'Male') * 0.1
    )
    
    df['stroke'] = (np.random.random(n_samples) < stroke_prob).astype(int)
    
    # Handle missing values
    df['bmi'] = df['bmi'].fillna(df['bmi'].mean())
    
    # Prepare features - exclude 'id' column
    categorical_features = ['gender', 'ever_married', 'work_type', 'Residence_type', 'smoking_status']
    numerical_features = ['age', 'hypertension', 'heart_disease', 'avg_glucose_level', 'bmi']
    
    # Encode categorical variables
    for feature in categorical_features:
        le = LabelEncoder()
        df[feature] = le.fit_transform(df[feature])
        label_encoders[feature] = le
    
    # Prepare X and y - exclude 'id' column
    X = df[numerical_features + categorical_features]
    y = df['stroke']
    feature_names = X.columns.tolist()
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Scale numerical features
    scaler = StandardScaler()
    X_train_scaled = X_train.copy()
    X_test_scaled = X_test.copy()
    
    X_train_scaled[numerical_features] = scaler.fit_transform(X_train[numerical_features])
    X_test_scaled[numerical_features] = scaler.transform(X_test[numerical_features])
    
    # Train Random Forest model
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"✅ Synthetic model trained with accuracy: {accuracy:.3f}")
    print(f"📊 Features used: {feature_names}")
    
    return True

def preprocess_input(data):
    """Preprocess input data for prediction"""
    try:
        # Create a DataFrame with the input data
        input_df = pd.DataFrame([data])
        
        # Ensure feature_names is set
        if not feature_names:
            print("❌ Error: feature_names not set")
            return None
        
        # Remove 'id' column if it exists in input data (not needed for prediction)
        if 'id' in input_df.columns:
            print("🔧 Removing 'id' column from input data")
            input_df = input_df.drop(columns=['id'])
        
        # Handle missing values if imputer is available
        if imputer is not None:
            numerical_cols = [col for col in feature_names if col in ['age', 'hypertension', 'heart_disease', 'avg_glucose_level', 'bmi']]
            if numerical_cols:
                input_df[numerical_cols] = imputer.transform(input_df[numerical_cols])
        
        # Encode categorical variables
        for feature, encoder in label_encoders.items():
            if feature in input_df.columns:
                # Handle unseen categories
                try:
                    input_df[feature] = encoder.transform(input_df[feature])
                except ValueError:
                    # If category not seen during training, use most frequent
                    print(f"⚠️  Warning: Unseen category for {feature}, using default")
                    input_df[feature] = 0
        
        # Ensure all required features are present
        for feature in feature_names:
            if feature not in input_df.columns:
                print(f"⚠️  Warning: Missing feature {feature}, using default value 0")
                input_df[feature] = 0  # Default value
        
        # Reorder columns to match training data
        input_df = input_df[feature_names]
        
        # Scale numerical features
        numerical_features = [col for col in feature_names if col in ['age', 'hypertension', 'heart_disease', 'avg_glucose_level', 'bmi']]
        if scaler is not None and numerical_features:
            input_df[numerical_features] = scaler.transform(input_df[numerical_features])
        
        print(f"✅ Preprocessing successful. Input shape: {input_df.shape}")
        return input_df
        
    except Exception as e:
        print(f"❌ Error in preprocessing: {e}")
        return None

def get_recommendations(risk_level, features):
    """Generate personalized recommendations based on risk level and features"""
    recommendations = {
        'lifestyle': [],
        'diet': [],
        'medical': [],
        'monitoring': []
    }
    
    if risk_level == 'high':
        recommendations['lifestyle'].extend([
            'Immediate consultation with healthcare provider required',
            'Quit smoking immediately',
            'Reduce alcohol consumption',
            'Start regular exercise program (30 minutes daily)',
            'Manage stress through meditation or therapy'
        ])
        recommendations['diet'].extend([
            'Reduce sodium intake to less than 1500mg daily',
            'Increase consumption of fruits, vegetables, and whole grains',
            'Limit saturated fats and processed foods',
            'Consider DASH diet plan'
        ])
        recommendations['medical'].extend([
            'Regular blood pressure monitoring (daily)',
            'Blood glucose monitoring if diabetic',
            'Cholesterol level checks every 3 months',
            'Consider preventive medications as prescribed'
        ])
        recommendations['monitoring'].extend([
            'Weekly blood pressure checks',
            'Monthly doctor visits',
            'Immediate medical attention for any stroke symptoms'
        ])
    
    elif risk_level == 'moderate':
        recommendations['lifestyle'].extend([
            'Quit smoking within 3 months',
            'Moderate alcohol consumption',
            'Regular exercise (20-30 minutes, 3-4 times weekly)',
            'Stress management techniques'
        ])
        recommendations['diet'].extend([
            'Reduce sodium intake to less than 2000mg daily',
            'Balanced diet with emphasis on heart-healthy foods',
            'Limit processed foods and added sugars'
        ])
        recommendations['medical'].extend([
            'Blood pressure monitoring weekly',
            'Regular check-ups every 6 months',
            'Monitor blood glucose if diabetic'
        ])
        recommendations['monitoring'].extend([
            'Monthly blood pressure checks',
            'Quarterly doctor visits'
        ])
    
    else:  # low risk
        recommendations['lifestyle'].extend([
            'Maintain current healthy lifestyle',
            'Regular exercise (30 minutes, 5 times weekly)',
            'Avoid smoking and excessive alcohol'
        ])
        recommendations['diet'].extend([
            'Maintain balanced, heart-healthy diet',
            'Regular meal timing',
            'Stay hydrated'
        ])
        recommendations['medical'].extend([
            'Annual health check-ups',
            'Monitor blood pressure monthly'
        ])
        recommendations['monitoring'].extend([
            'Annual comprehensive health assessment'
        ])
    
    # Add specific recommendations based on individual features
    if features.get('hypertension') == 1:
        recommendations['medical'].append('Focus on blood pressure control through medication and lifestyle')
    
    if features.get('heart_disease') == 1:
        recommendations['medical'].append('Cardiac rehabilitation program recommended')
    
    if features.get('smoking_status') == 'smokes':
        recommendations['lifestyle'].append('Smoking cessation program strongly recommended')
    
    if features.get('bmi', 0) > 30:
        recommendations['diet'].append('Weight management program with registered dietitian')
    
    return recommendations

@app.route('/api/predict', methods=['POST'])
def predict_stroke():
    """Predict stroke risk based on input data"""
    try:
        print("🔍 Starting prediction request...")
        data = request.json
        print(f"📊 Received data: {data}")
        
        # Check if model is loaded
        if model is None:
            print("❌ Model not loaded")
            return jsonify({'error': 'Model not loaded'}), 500
        
        print(f"✅ Model loaded: {type(model)}")
        print(f"📋 Feature names: {feature_names}")
        
        # Validate required fields
        required_fields = ['age', 'gender', 'hypertension', 'heart_disease', 'ever_married', 
                         'work_type', 'Residence_type', 'avg_glucose_level', 'bmi', 'smoking_status']
        
        for field in required_fields:
            if field not in data:
                print(f"❌ Missing field: {field}")
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        print("✅ All required fields present")
        
        # Preprocess input data
        print("🔄 Preprocessing data...")
        processed_data = preprocess_input(data)
        if processed_data is None:
            print("❌ Preprocessing failed")
            return jsonify({'error': 'Failed to preprocess input data'}), 500
        
        print(f"✅ Preprocessing successful. Data shape: {processed_data.shape}")
        print(f"📊 Processed data columns: {processed_data.columns.tolist()}")
        print(f"📊 Processed data values: {processed_data.values}")
        
        # Make prediction
        print("🎯 Making prediction...")
        try:
            prediction_proba = model.predict_proba(processed_data)[0]
            print(f"✅ Prediction successful: {prediction_proba}")
        except Exception as pred_error:
            print(f"❌ Prediction error: {pred_error}")
            print(f"❌ Model type: {type(model)}")
            print(f"❌ Model features: {getattr(model, 'n_features_in_', 'Unknown')}")
            print(f"❌ Input features: {len(processed_data.columns)}")
            raise pred_error
        
        stroke_probability = prediction_proba[1] * 100
        print(f"📊 Stroke probability: {stroke_probability:.2f}%")
        
        # Determine risk level
        if stroke_probability < 15:
            risk_level = 'low'
        elif stroke_probability < 35:
            risk_level = 'moderate'
        else:
            risk_level = 'high'
        
        print(f"🎯 Risk level: {risk_level}")
        
        # Get recommendations
        print("💡 Getting recommendations...")
        recommendations = get_recommendations(risk_level, data)
        
        # Prepare response
        response = {
            'stroke_probability': round(stroke_probability, 2),
            'risk_level': risk_level,
            'risk_category': {
                'low': stroke_probability < 15,
                'moderate': 15 <= stroke_probability < 35,
                'high': stroke_probability >= 35
            },
            'recommendations': recommendations,
            'timestamp': datetime.now().isoformat(),
            'model_info': {
                'type': 'trained' if model_metadata else 'synthetic',
                'features_used': feature_names,
                'last_updated': model_metadata.get('timestamp', 'N/A') if model_metadata else 'N/A'
            }
        }
        
        # Convert boolean values to strings for JSON serialization
        response['risk_category'] = {
            'low': str(response['risk_category']['low']).lower(),
            'moderate': str(response['risk_category']['moderate']).lower(),
            'high': str(response['risk_category']['high']).lower()
        }
        
        print("✅ Prediction completed successfully")
        return jsonify(response)
    
    except Exception as e:
        print(f"❌ Prediction error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        model_status = {
            'loaded': model is not None,
            'type': str(type(model)) if model else 'None',
            'feature_count': len(feature_names) if feature_names else 0,
            'feature_names': feature_names if feature_names else [],
            'has_scaler': scaler is not None,
            'has_encoders': len(label_encoders) > 0 if label_encoders else False,
            'encoder_features': list(label_encoders.keys()) if label_encoders else [],
            'model_metadata': model_metadata if model_metadata else None
        }
        
        if model is not None:
            try:
                model_status['n_features_in'] = getattr(model, 'n_features_in_', 'Unknown')
                model_status['n_classes'] = getattr(model, 'n_classes_', 'Unknown')
                model_status['feature_importances'] = len(model.feature_importances_) if hasattr(model, 'feature_importances_') else 'Unknown'
            except Exception as e:
                model_status['model_details_error'] = str(e)
        
        return jsonify({
            'status': 'healthy',
            'model_loaded': model is not None,
            'model_type': 'trained' if model_metadata else 'synthetic',
            'features_count': len(feature_names) if feature_names else 0,
            'timestamp': datetime.now().isoformat(),
            'model_details': model_status
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        })

@app.route('/api/features', methods=['GET'])
def get_feature_importance():
    """Get feature importance from the model"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    importance = model.feature_importances_
    feature_importance = dict(zip(feature_names, importance.tolist()))
    
    return jsonify({
        'feature_importance': feature_importance,
        'top_features': sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)[:10]
    })

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get stroke statistics and insights"""
    return jsonify({
        'global_statistics': {
            'annual_strokes_worldwide': '15 million',
            'stroke_deaths_annually': '5 million',
            'stroke_disability_rate': '50% of survivors',
            'preventable_strokes': '80%'
        },
        'risk_factors': {
            'hypertension': 'Most significant risk factor',
            'age': 'Risk doubles every decade after 55',
            'diabetes': 'Increases risk by 2-4 times',
            'smoking': 'Doubles stroke risk',
            'obesity': 'Increases risk by 1.5-2 times'
        },
        'prevention_tips': [
            'Control blood pressure',
            'Manage diabetes',
            'Quit smoking',
            'Maintain healthy weight',
            'Exercise regularly',
            'Eat heart-healthy diet'
        ]
    })

@app.route('/api/model-info', methods=['GET'])
def get_model_info():
    """Get information about the currently loaded model"""
    if model is None:
        return jsonify({'error': 'No model loaded'}), 500
    
    return jsonify({
        'model_type': 'trained' if model_metadata else 'synthetic',
        'features': feature_names,
        'feature_count': len(feature_names),
        'metadata': model_metadata if model_metadata else None,
        'last_updated': model_metadata.get('timestamp', 'N/A') if model_metadata else 'N/A'
    })

@app.route('/api/download-report', methods=['POST'])
def download_report():
    """Generate and download a PDF report for prediction results"""
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Generate PDF report
        report_result = generate_stroke_report(data)
        
        if not report_result['success']:
            return jsonify({'error': report_result['error']}), 500
        
        # Return the PDF file
        return send_file(
            report_result['file_path'],
            as_attachment=True,
            download_name=report_result['filename'],
            mimetype='application/pdf'
        )
        
    except Exception as e:
        print(f"❌ Error generating report: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/share-results', methods=['POST'])
def share_results():
    """Share results via email or generate shareable link"""
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Generate a unique share ID
        import hashlib
        import time
        
        share_data = f"{data.get('stroke_probability', 0)}_{data.get('risk_level', 'unknown')}_{time.time()}"
        share_id = hashlib.md5(share_data.encode()).hexdigest()[:8]
        
        # Store shared results (in production, use a database)
        shared_results = {
            'share_id': share_id,
            'data': data,
            'timestamp': datetime.now().isoformat(),
            'expires_at': (datetime.now() + timedelta(days=7)).isoformat()  # Expires in 7 days
        }
        
        # In production, store this in a database
        # For now, we'll just return the share ID
        share_url = f"https://yourdomain.com/share/{share_id}"
        
        return jsonify({
            'success': True,
            'share_id': share_id,
            'share_url': share_url,
            'expires_at': shared_results['expires_at'],
            'message': 'Results shared successfully'
        })
        
    except Exception as e:
        print(f"❌ Error sharing results: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/share/<share_id>', methods=['GET'])
def get_shared_results(share_id):
    """Get shared results by share ID"""
    try:
        # In production, retrieve from database
        # For now, return a message
        return jsonify({
            'message': 'Shared results endpoint',
            'share_id': share_id,
            'note': 'This would retrieve shared results from database in production'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🏥 Initializing Stroke Prediction System...")
    print("📊 Loading or training model...")
    
    success = load_or_train_model()
    if success:
        print("✅ Model ready for predictions!")
        print("🌐 Starting Flask server...")
        print("📱 User interface available at: http://localhost:5000")
        print("🔧 Training interface available at: http://localhost:5001")
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        print("❌ Failed to initialize model. Exiting...")
