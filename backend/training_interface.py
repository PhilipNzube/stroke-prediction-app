from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import pandas as pd
from train_model import StrokeModelTrainer
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Global trainer instance
trainer = StrokeModelTrainer()

@app.route('/')
def training_interface():
    """Serve the training interface"""
    return render_template('training.html')

@app.route('/api/analyze', methods=['POST'])
def analyze_dataset():
    """Analyze uploaded CSV dataset"""
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'No file uploaded'})
        
        file = request.files['file']
        target_column = request.form.get('target_column', 'stroke')
        
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'})
        
        # Save file temporarily
        temp_path = f"temp_{file.filename}"
        file.save(temp_path)
        
        # Analyze dataset
        df = trainer.load_dataset(temp_path, target_column)
        if df is None:
            os.remove(temp_path)
            return jsonify({'success': False, 'error': 'Failed to load dataset'})
        
        # Get dataset info
        dataset_info = {
            'shape': df.shape,
            'columns': df.columns.tolist(),
            'target_distribution': df[target_column].value_counts().to_dict(),
            'missing_values': df.isnull().sum().to_dict(),
            'data_types': df.dtypes.to_dict()
        }
        
        # Clean up
        os.remove(temp_path)
        
        return jsonify({
            'success': True,
            'dataset_info': dataset_info
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/train', methods=['POST'])
def train_model():
    """Train the model with uploaded dataset"""
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'No file uploaded'})
        
        file = request.files['file']
        target_column = request.form.get('target_column', 'stroke')
        test_size = int(request.form.get('test_size', 20)) / 100
        use_grid_search = request.form.get('use_grid_search', 'true').lower() == 'true'
        model_name = request.form.get('model_name', 'stroke_model')
        
        # Save file temporarily
        temp_path = f"temp_{file.filename}"
        file.save(temp_path)
        
        # Load and preprocess dataset
        df = trainer.load_dataset(temp_path, target_column)
        if df is None:
            os.remove(temp_path)
            return jsonify({'success': False, 'error': 'Failed to load dataset'})
        
        X_train, X_test, y_train, y_test = trainer.preprocess_data(df, target_column, test_size)
        if X_train is None:
            os.remove(temp_path)
            return jsonify({'success': False, 'error': 'Failed to preprocess data'})
        
        # Train model
        success = trainer.train_model(X_train, y_train, use_grid_search)
        if not success:
            os.remove(temp_path)
            return jsonify({'success': False, 'error': 'Failed to train model'})
        
        # Evaluate model
        evaluation_results = trainer.evaluate_model(X_test, y_test)
        if evaluation_results is None:
            os.remove(temp_path)
            return jsonify({'success': False, 'error': 'Failed to evaluate model'})
        
        # Save model
        save_results = trainer.save_model(model_name)
        if not save_results:
            os.remove(temp_path)
            return jsonify({'success': False, 'error': 'Failed to save model'})
        
        # Clean up
        os.remove(temp_path)
        
        return jsonify({
            'success': True,
            'results': evaluation_results,
            'save_info': save_results
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    print("🚀 Starting Stroke Model Training Interface...")
    print("📱 Access the training interface at: http://localhost:5001")
    print("🔧 This interface is for developers to train models with real datasets")
    app.run(debug=True, host='0.0.0.0', port=5001)
