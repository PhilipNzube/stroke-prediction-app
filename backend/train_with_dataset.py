#!/usr/bin/env python3
"""
Simple script to train the stroke prediction model with your dataset
"""

import os
import sys
import pandas as pd
import numpy as np
from train_model import StrokeModelTrainer

def create_balanced_dataset(df):
    """Create a more balanced dataset by adding synthetic samples"""
    print("🔄 Creating balanced dataset...")
    
    # Check current distribution
    stroke_counts = df['stroke'].value_counts()
    print(f"📊 Current distribution: {stroke_counts.to_dict()}")
    
    # If we have both classes, check balance
    if len(stroke_counts) == 2:
        min_class_count = stroke_counts.min()
        max_class_count = stroke_counts.max()
        
        if max_class_count / min_class_count > 3:  # If imbalance is significant
            print("⚠️  Dataset is imbalanced. Creating synthetic samples...")
            
            # Get minority class samples
            minority_class = stroke_counts.idxmin()
            minority_samples = df[df['stroke'] == minority_class]
            
            # Create synthetic samples for minority class
            synthetic_samples = []
            for _ in range(max_class_count - min_class_count):
                # Randomly select a minority sample
                sample = minority_samples.sample(n=1).iloc[0]
                
                # Add some noise to numerical features
                synthetic_sample = sample.copy()
                if 'age' in df.columns:
                    synthetic_sample['age'] = max(18, min(100, sample['age'] + np.random.randint(-5, 6)))
                if 'avg_glucose_level' in df.columns:
                    synthetic_sample['avg_glucose_level'] = max(50, min(300, sample['avg_glucose_level'] + np.random.uniform(-10, 10)))
                if 'bmi' in df.columns:
                    synthetic_sample['bmi'] = max(15, min(50, sample['bmi'] + np.random.uniform(-2, 2)))
                
                synthetic_samples.append(synthetic_sample)
            
            # Combine original and synthetic data
            balanced_df = pd.concat([df, pd.DataFrame(synthetic_samples)], ignore_index=True)
            print(f"✅ Balanced dataset created: {len(balanced_df)} samples")
            print(f"📊 New distribution: {balanced_df['stroke'].value_counts().to_dict()}")
            return balanced_df
    
    print("✅ Dataset is balanced or only has one class")
    return df

def main():
    print("🏥 Stroke Model Training with Your Dataset")
    print("=" * 50)
    
    # Initialize trainer
    trainer = StrokeModelTrainer()
    
    # Check if sample dataset exists
    sample_path = "sample_dataset.csv"
    if not os.path.exists(sample_path):
        print(f"❌ Sample dataset not found at: {sample_path}")
        print("Please ensure your CSV file is in the backend directory")
        return
    
    print(f"📊 Found dataset: {sample_path}")
    
    # Load dataset
    print("\n🔄 Loading dataset...")
    df = trainer.load_dataset(sample_path, target_column='stroke')
    if df is None:
        print("❌ Failed to load dataset")
        return
    
    print(f"✅ Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
    print(f"📋 Columns: {list(df.columns)}")
    print(f"🎯 Target distribution:\n{df['stroke'].value_counts()}")
    
    # Create balanced dataset if needed
    df = create_balanced_dataset(df)
    
    # Preprocess data
    print("\n🔄 Preprocessing data...")
    X_train, X_test, y_train, y_test = trainer.preprocess_data(df, test_size=0.2)
    if X_train is None:
        print("❌ Failed to preprocess data")
        return
    
    print(f"✅ Preprocessing complete")
    print(f"   Training set: {X_train.shape[0]} samples")
    print(f"   Test set: {X_test.shape[0]} samples")
    print(f"   Features: {len(trainer.feature_names)}")
    
    # Train model (without grid search for faster training)
    print("\n🚀 Training model...")
    success = trainer.train_model(X_train, y_train, use_grid_search=False)
    if not success:
        print("❌ Failed to train model")
        return
    
    # Evaluate model
    print("\n📊 Evaluating model...")
    evaluation_results = trainer.evaluate_model(X_test, y_test)
    if evaluation_results is None:
        print("❌ Failed to evaluate model")
        return
    
    # Save model
    print("\n💾 Saving model...")
    save_results = trainer.save_model("your_stroke_model")
    if not save_results:
        print("❌ Failed to save model")
        return
    
    print(f"\n🎉 Training completed successfully!")
    print(f"📁 Model saved in: {save_results['model_path']}")
    print(f"🔧 Components saved in: {save_results['components_path']}")
    print(f"📋 Metadata saved in: {save_results['metadata_path']}")
    
    print(f"\n📈 Model Performance:")
    print(f"   Accuracy: {evaluation_results['accuracy']:.3f}")
    if 'roc_auc' in evaluation_results:
        print(f"   ROC AUC: {evaluation_results['roc_auc']:.3f}")
    if 'cv_mean' in evaluation_results:
        print(f"   CV Score: {evaluation_results['cv_mean']:.3f}")
    
    if 'warning' in evaluation_results:
        print(f"\n⚠️  {evaluation_results['warning']}")
    
    print(f"\n🔝 Top Features:")
    for feature, importance in evaluation_results['top_features'][:5]:
        print(f"   {feature}: {importance:.3f}")
    
    print(f"\n✅ Your model is now ready for predictions!")
    print(f"🌐 Restart the main app to use the trained model")

if __name__ == "__main__":
    main()
