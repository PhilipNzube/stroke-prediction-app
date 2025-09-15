from app import app, load_or_train_model

# Initialize the model when the WSGI application starts
print("🏥 Initializing Stroke Prediction System for production...")
print("📊 Loading or training model...")

success = load_or_train_model()
if success:
    print("✅ Model ready for predictions!")
else:
    print("❌ Failed to initialize model.")

# Export the Flask app for WSGI servers
application = app

if __name__ == "__main__":
    app.run()
