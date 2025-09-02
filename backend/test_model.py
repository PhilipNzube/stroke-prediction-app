#!/usr/bin/env python3
"""
Test script to check model status and identify issues
"""

import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app import model, feature_names, label_encoders, scaler, model_metadata
    
    print("🔍 Model Status Check")
    print("=" * 50)
    
    # Check model
    print(f"📊 Model loaded: {model is not None}")
    if model is not None:
        print(f"   Type: {type(model)}")
        try:
            print(f"   Features expected: {getattr(model, 'n_features_in_', 'Unknown')}")
            print(f"   Classes: {getattr(model, 'n_classes_', 'Unknown')}")
        except Exception as e:
            print(f"   Error getting model details: {e}")
    else:
        print("   ❌ No model loaded!")
    
    # Check feature names
    print(f"\n📋 Feature names: {len(feature_names) if feature_names else 0}")
    if feature_names:
        print(f"   Features: {feature_names}")
    else:
        print("   ❌ No feature names set!")
    
    # Check encoders
    print(f"\n🔧 Label encoders: {len(label_encoders) if label_encoders else 0}")
    if label_encoders:
        for feature, encoder in label_encoders.items():
            print(f"   {feature}: {type(encoder)}")
    else:
        print("   ❌ No label encoders!")
    
    # Check scaler
    print(f"\n⚖️  Scaler: {scaler is not None}")
    if scaler:
        print(f"   Type: {type(scaler)}")
    else:
        print("   ❌ No scaler!")
    
    # Check metadata
    print(f"\n📁 Model metadata: {model_metadata is not None}")
    if model_metadata:
        print(f"   Model name: {model_metadata.get('model_name', 'Unknown')}")
        print(f"   Timestamp: {model_metadata.get('timestamp', 'Unknown')}")
    
    print("\n" + "=" * 50)
    
    if model is None or not feature_names:
        print("❌ CRITICAL ISSUES FOUND!")
        print("   - Model not loaded or feature names missing")
        print("   - This will cause prediction errors")
        print("\n🔧 SOLUTION: Train a model first using:")
        print("   python train_with_dataset.py")
    else:
        print("✅ Model appears to be properly loaded!")
        print("   - Try making a prediction to test")
        
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're in the backend directory")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
