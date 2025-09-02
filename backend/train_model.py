import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler, StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score
from sklearn.impute import SimpleImputer
import joblib
import os
import json
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class StrokeModelTrainer:
    def __init__(self):
        self.model = None
        self.label_encoders = {}
        self.scaler = None
        self.imputer = None
        self.feature_names = []
        self.training_history = []
        
    def load_dataset(self, file_path, target_column='stroke'):
        """Load and validate CSV dataset"""
        try:
            df = pd.read_csv(file_path)
            print(f"✅ Dataset loaded successfully: {df.shape[0]} rows, {df.shape[1]} columns")
            
            # Validate target column
            if target_column not in df.columns:
                raise ValueError(f"Target column '{target_column}' not found in dataset")
            
            # Check for required columns (common stroke prediction features)
            expected_features = ['age', 'gender', 'hypertension', 'heart_disease', 'avg_glucose_level', 'bmi']
            missing_features = [col for col in expected_features if col not in df.columns]
            
            if missing_features:
                print(f"⚠️  Warning: Missing expected features: {missing_features}")
            
            return df
            
        except Exception as e:
            print(f"❌ Error loading dataset: {str(e)}")
            return None
    
    def preprocess_data(self, df, target_column='stroke', test_size=0.2, random_state=42):
        """Preprocess the dataset for training"""
        try:
            print("🔄 Starting data preprocessing...")
            
            # Separate features and target
            X = df.drop(columns=[target_column])
            y = df[target_column]
            
            # Store feature names
            self.feature_names = X.columns.tolist()
            
            # Identify categorical and numerical columns
            categorical_cols = X.select_dtypes(include=['object', 'category']).columns.tolist()
            numerical_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
            
            print(f"📊 Categorical features: {categorical_cols}")
            print(f"📊 Numerical features: {numerical_cols}")
            
            # Handle missing values
            if X.isnull().any().any():
                print("🔧 Handling missing values...")
                
                # Impute categorical columns with mode
                if categorical_cols:
                    cat_imputer = SimpleImputer(strategy='most_frequent')
                    X[categorical_cols] = cat_imputer.fit_transform(X[categorical_cols])
                
                # Impute numerical columns with median
                if numerical_cols:
                    num_imputer = SimpleImputer(strategy='median')
                    X[numerical_cols] = num_imputer.fit_transform(X[numerical_cols])
                    self.imputer = num_imputer
            
            # Encode categorical variables
            if categorical_cols:
                print("🔧 Encoding categorical variables...")
                for col in categorical_cols:
                    le = LabelEncoder()
                    X[col] = le.fit_transform(X[col].astype(str))
                    self.label_encoders[col] = le
            
            # Split the data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=test_size, random_state=random_state, stratify=y
            )
            
            # Scale numerical features
            if numerical_cols:
                print("🔧 Scaling numerical features...")
                self.scaler = StandardScaler()
                X_train[numerical_cols] = self.scaler.fit_transform(X_train[numerical_cols])
                X_test[numerical_cols] = self.scaler.transform(X_test[numerical_cols])
            
            print("✅ Data preprocessing completed successfully!")
            return X_train, X_test, y_train, y_test
            
        except Exception as e:
            print(f"❌ Error in preprocessing: {str(e)}")
            return None, None, None, None
    
    def train_model(self, X_train, y_train, use_grid_search=True):
        """Train the Random Forest model with optional hyperparameter tuning"""
        try:
            print("🚀 Starting model training...")
            
            if use_grid_search:
                print("🔍 Performing hyperparameter tuning with GridSearchCV...")
                
                # Define parameter grid for Random Forest
                param_grid = {
                    'n_estimators': [100, 200, 300],
                    'max_depth': [10, 20, None],
                    'min_samples_split': [2, 5, 10],
                    'min_samples_leaf': [1, 2, 4],
                    'class_weight': ['balanced', 'balanced_subsample']
                }
                
                # Initialize base model
                base_rf = RandomForestClassifier(random_state=42)
                
                # Perform grid search with cross-validation
                grid_search = GridSearchCV(
                    base_rf, param_grid, cv=5, scoring='accuracy', n_jobs=-1, verbose=1
                )
                
                grid_search.fit(X_train, y_train)
                
                # Get best model
                self.model = grid_search.best_estimator_
                
                print(f"✅ Best parameters found: {grid_search.best_params_}")
                print(f"✅ Best cross-validation score: {grid_search.best_score_:.4f}")
                
            else:
                print("🔧 Training with default parameters...")
                self.model = RandomForestClassifier(
                    n_estimators=200,
                    max_depth=20,
                    min_samples_split=5,
                    min_samples_leaf=2,
                    class_weight='balanced',
                    random_state=42
                )
                self.model.fit(X_train, y_train)
            
            print("✅ Model training completed successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Error in training: {str(e)}")
            return False
    
    def evaluate_model(self, X_test, y_test):
        """Evaluate the trained model"""
        try:
            print("📊 Evaluating model performance...")
            
            # Check if we have multiple classes
            unique_classes = np.unique(y_test)
            print(f"📋 Unique classes in test set: {unique_classes}")
            
            if len(unique_classes) < 2:
                print("⚠️  Warning: Only one class found in test set. This will limit evaluation metrics.")
                print("   Consider using a more balanced dataset or adjusting the train/test split.")
                
                # Basic evaluation for single class
                y_pred = self.model.predict(X_test)
                accuracy = accuracy_score(y_test, y_pred)
                
                # Create a simple evaluation result
                evaluation_results = {
                    'accuracy': accuracy,
                    'roc_auc': 0.5,  # Default for single class
                    'cv_mean': accuracy,
                    'cv_std': 0.0,
                    'classification_report': {'accuracy': accuracy},
                    'confusion_matrix': [[len(y_test), 0], [0, 0]],
                    'feature_importance': dict(zip(self.feature_names, self.model.feature_importances_)),
                    'top_features': sorted(dict(zip(self.feature_names, self.model.feature_importances_)).items(), key=lambda x: x[1], reverse=True)[:10],
                    'timestamp': datetime.now().isoformat(),
                    'warning': 'Single class dataset - limited evaluation metrics'
                }
                
                print(f"✅ Basic evaluation completed for single class dataset")
                print(f"   Accuracy: {accuracy:.4f}")
                return evaluation_results
            
            # Normal evaluation for multiple classes
            # Make predictions
            y_pred = self.model.predict(X_test)
            y_pred_proba = self.model.predict_proba(X_test)[:, 1]
            
            # Calculate metrics
            accuracy = accuracy_score(y_test, y_pred)
            roc_auc = roc_auc_score(y_test, y_pred_proba)
            
            # Cross-validation score
            # Adjust CV folds based on dataset size
            n_samples = len(y_test)
            if n_samples < 10:
                cv_folds = 2
            elif n_samples < 20:
                cv_folds = 3
            else:
                cv_folds = 5
                
            print(f"📊 Using {cv_folds}-fold cross-validation for {n_samples} test samples")
            
            try:
                cv_scores = cross_val_score(self.model, X_test, y_test, cv=cv_folds, scoring='accuracy')
            except Exception as cv_error:
                print(f"⚠️  Cross-validation failed: {cv_error}")
                print("   Using simple accuracy instead")
                cv_scores = np.array([accuracy])
            
            # Generate detailed report
            classification_rep = classification_report(y_test, y_pred, output_dict=True)
            conf_matrix = confusion_matrix(y_test, y_pred)
            
            # Feature importance
            feature_importance = dict(zip(self.feature_names, self.model.feature_importances_))
            top_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)[:10]
            
            # Store evaluation results
            evaluation_results = {
                'accuracy': accuracy,
                'roc_auc': roc_auc,
                'cv_mean': cv_scores.mean(),
                'cv_std': cv_scores.std(),
                'classification_report': classification_rep,
                'confusion_matrix': conf_matrix.tolist(),
                'feature_importance': feature_importance,
                'top_features': top_features,
                'timestamp': datetime.now().isoformat()
            }
            
            # Print results
            print(f"\n📈 Model Performance Metrics:")
            print(f"   Accuracy: {accuracy:.4f}")
            print(f"   ROC AUC: {roc_auc:.4f}")
            print(f"   CV Score: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
            
            print(f"\n🔝 Top 10 Most Important Features:")
            for feature, importance in top_features:
                print(f"   {feature}: {importance:.4f}")
            
            print(f"\n📋 Classification Report:")
            print(classification_report(y_test, y_pred))
            
            return evaluation_results
            
        except Exception as e:
            print(f"❌ Error in evaluation: {str(e)}")
            return None
    
    def save_model(self, model_name='stroke_model'):
        """Save the trained model and preprocessing components"""
        try:
            print("💾 Saving model and components...")
            
            # Create models directory if it doesn't exist
            os.makedirs('models', exist_ok=True)
            
            # Generate timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            
            # Save model
            model_path = f"models/{model_name}_{timestamp}.joblib"
            joblib.dump(self.model, model_path)
            
            # Save preprocessing components
            components = {
                'label_encoders': self.label_encoders,
                'scaler': self.scaler,
                'imputer': self.imputer,
                'feature_names': self.feature_names,
                'model_path': model_path
            }
            
            components_path = f"models/{model_name}_components_{timestamp}.joblib"
            joblib.dump(components, components_path)
            
            # Save training metadata
            metadata = {
                'model_name': model_name,
                'timestamp': timestamp,
                'feature_names': self.feature_names,
                'model_path': model_path,
                'components_path': components_path,
                'training_history': self.training_history
            }
            
            metadata_path = f"models/{model_name}_metadata_{timestamp}.json"
            with open(metadata_path, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            print(f"✅ Model saved successfully!")
            print(f"   Model: {model_path}")
            print(f"   Components: {components_path}")
            print(f"   Metadata: {metadata_path}")
            
            return {
                'model_path': model_path,
                'components_path': components_path,
                'metadata_path': metadata_path
            }
            
        except Exception as e:
            print(f"❌ Error saving model: {str(e)}")
            return None
    
    def load_saved_model(self, model_path, components_path):
        """Load a previously saved model"""
        try:
            print("📂 Loading saved model...")
            
            self.model = joblib.load(model_path)
            components = joblib.load(components_path)
            
            self.label_encoders = components['label_encoders']
            self.scaler = components['scaler']
            self.imputer = components['imputer']
            self.feature_names = components['feature_names']
            
            print("✅ Model loaded successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Error loading model: {str(e)}")
            return False

def main():
    """Main training function for command line usage"""
    print("🏥 Stroke Prediction Model Trainer")
    print("=" * 50)
    
    # Initialize trainer
    trainer = StrokeModelTrainer()
    
    # Example usage (replace with your CSV file path)
    csv_file = input("Enter the path to your CSV dataset: ").strip()
    
    if not os.path.exists(csv_file):
        print("❌ File not found!")
        return
    
    # Load dataset
    df = trainer.load_dataset(csv_file)
    if df is None:
        return
    
    # Display dataset info
    print(f"\n📊 Dataset Information:")
    print(f"   Shape: {df.shape}")
    print(f"   Columns: {list(df.columns)}")
    print(f"   Target distribution:\n{df['stroke'].value_counts()}")
    
    # Preprocess data
    X_train, X_test, y_train, y_test = trainer.preprocess_data(df)
    if X_train is None:
        return
    
    # Train model
    use_grid_search = input("\nUse GridSearchCV for hyperparameter tuning? (y/n): ").lower().strip() == 'y'
    success = trainer.train_model(X_train, y_train, use_grid_search)
    
    if not success:
        return
    
    # Evaluate model
    evaluation_results = trainer.evaluate_model(X_test, y_test)
    if evaluation_results is None:
        return
    
    # Save model
    model_name = input("\nEnter model name (default: stroke_model): ").strip() or 'stroke_model'
    save_results = trainer.save_model(model_name)
    
    if save_results:
        print(f"\n🎉 Training completed successfully!")
        print(f"Your model is ready for use in the prediction system.")

if __name__ == "__main__":
    main()
