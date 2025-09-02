#!/usr/bin/env python3
"""
Quick test script to verify the trained model works
"""

import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app import model, feature_names, label_encoders, scaler
    
    print("🔍 Quick Model Test")
    print("=" * 40)
    
    # Check if model is loaded
    if model is None:
        print("❌ No model loaded!")
        print("Run: python train_with_dataset.py")
        exit(1)
    
    print("✅ Model loaded successfully")
    print(f"📊 Model type: {type(model)}")
    print(f"📋 Features: {len(feature_names)}")
    print(f"🔧 Encoders: {len(label_encoders)}")
    print(f"⚖️  Scaler: {scaler is not None}")
    
    # Test prediction with sample data
    print("\n🧪 Testing prediction...")
    
    # Sample input data (similar to what users will input)
    test_data = {
        'age': 45,
        'gender': 'Male',
        'hypertension': 0,
        'heart_disease': 0,
        'ever_married': 'Yes',
        'work_type': 'Private',
        'Residence_type': 'Urban',
        'avg_glucose_level': 95.0,
        'bmi': 24.5,
        'smoking_status': 'never smoked'
    }
    
    print(f"📊 Test input: {test_data}")
    
    # Import the preprocessing function
    from app import preprocess_input
    
    # Preprocess the test data
    processed_data = preprocess_input(test_data)
    if processed_data is None:
        print("❌ Preprocessing failed!")
        exit(1)
    
    print(f"✅ Preprocessing successful")
    print(f"📊 Processed shape: {processed_data.shape}")
    
    # Make prediction
    try:
        prediction_proba = model.predict_proba(processed_data)[0]
        stroke_probability = prediction_proba[1] * 100
        
        print(f"🎯 Prediction successful!")
        print(f"📊 Stroke probability: {stroke_probability:.2f}%")
        
        if stroke_probability < 15:
            risk_level = 'low'
        elif stroke_probability < 35:
            risk_level = 'moderate'
        else:
            risk_level = 'high'
            
        print(f"⚠️  Risk level: {risk_level}")
        
    except Exception as e:
        print(f"❌ Prediction failed: {e}")
        exit(1)
    
    print("\n✅ All tests passed! Model is ready for use.")
    print("🌐 You can now start the main app: python app.py")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're in the backend directory")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
