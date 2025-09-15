#!/usr/bin/env python3
"""
Startup script for Render deployment
This ensures the model is loaded before the server starts
"""

import os
import sys
from app import app, load_or_train_model

def main():
    print("🏥 Starting Stroke Prediction System...")
    print(f"🔍 Python version: {sys.version}")
    print(f"🔍 Current working directory: {os.getcwd}")
    
    # Initialize the model
    print("📊 Loading or training model...")
    success = load_or_train_model()
    
    if success:
        print("✅ Model ready for predictions!")
        print("🌐 Starting Flask server...")
        
        # Get port from environment variable (Render sets this)
        port = int(os.environ.get('PORT', 10000))
        print(f"🚀 Server starting on port {port}")
        
        # Run the app
        app.run(host='0.0.0.0', port=port, debug=False)
    else:
        print("❌ Failed to initialize model. Exiting...")
        sys.exit(1)

if __name__ == '__main__':
    main()
