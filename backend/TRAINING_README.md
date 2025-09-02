# 🏥 Stroke Model Training System

## Overview

This system provides a professional interface for developers to train stroke prediction models using real CSV datasets. It includes both a command-line training module and a web-based training interface.

## 🚀 Quick Start

### 1. Start the Training Interface

```bash
cd backend
python training_interface.py
```

Access the training interface at: **http://localhost:5001**

### 2. Start the User Prediction Interface

```bash
cd backend
python app.py
```

Access the user interface at: **http://localhost:5000**

## 📊 Training with Real Data

### Supported Dataset Format

Your CSV should contain the following columns (or similar):

| Column              | Type        | Description           | Example Values                                         |
| ------------------- | ----------- | --------------------- | ------------------------------------------------------ |
| `age`               | numeric     | Patient age           | 45, 67, 23                                             |
| `gender`            | categorical | Patient gender        | "Male", "Female"                                       |
| `hypertension`      | binary      | Hypertension status   | 0 (No), 1 (Yes)                                        |
| `heart_disease`     | binary      | Heart disease status  | 0 (No), 1 (Yes)                                        |
| `ever_married`      | categorical | Marital status        | "Yes", "No"                                            |
| `work_type`         | categorical | Employment type       | "Private", "Self-employed", "Govt_job", "children"     |
| `Residence_type`    | categorical | Living area           | "Urban", "Rural"                                       |
| `avg_glucose_level` | numeric     | Average glucose level | 120.5, 89.2                                            |
| `bmi`               | numeric     | Body Mass Index       | 25.6, 32.1                                             |
| `smoking_status`    | categorical | Smoking habits        | "never smoked", "formerly smoked", "smokes", "Unknown" |
| `stroke`            | binary      | Target variable       | 0 (No stroke), 1 (Stroke)                              |

### Dataset Requirements

- **Minimum size**: 1000+ samples recommended
- **Format**: CSV with headers
- **Encoding**: UTF-8
- **Missing values**: Will be handled automatically
- **Target column**: Must be named `stroke` (or specify custom name)

## 🔧 Training Process

### Step 1: Upload Dataset

1. Click "Choose File" and select your CSV dataset
2. Verify the target column name (default: `stroke`)
3. Click "Analyze Dataset" to validate

### Step 2: Configure Training

1. **Test Size**: Percentage of data for testing (10-40%)
2. **Hyperparameter Tuning**:
   - **Yes**: Uses GridSearchCV for optimal parameters (slower but better)
   - **No**: Uses default parameters (faster)
3. **Model Name**: Custom name for your trained model

### Step 3: Start Training

- Click "Start Training"
- Monitor progress in the interface
- View results when complete

## 📈 Training Results

The system provides comprehensive evaluation metrics:

- **Accuracy**: Overall prediction accuracy
- **ROC AUC**: Area under ROC curve
- **Cross-Validation Score**: Average performance across folds
- **Feature Importance**: Top 10 most important features

## 💾 Model Storage

Trained models are automatically saved in the `models/` directory with:

- **Model file**: `{name}_{timestamp}.joblib`
- **Components**: `{name}_components_{timestamp}.joblib`
- **Metadata**: `{name}_metadata_{timestamp}.json`

## 🎯 Command Line Training

For advanced users, you can also train models directly from the command line:

```bash
cd backend
python train_model.py
```

This will prompt you for:

- CSV file path
- Target column name
- Hyperparameter tuning preference
- Model name

## 🔄 Model Updates

### Automatic Loading

The prediction system automatically loads the most recent trained model.

### Manual Model Selection

To use a specific model, update the `models/` directory or modify the loading logic in `app.py`.

## 📋 Example Datasets

### Kaggle Stroke Dataset

Download from: [Stroke Prediction Dataset](https://www.kaggle.com/datasets/fedesoriano/stroke-prediction-dataset)

### Custom Dataset

Create your own dataset following the format above. Ensure your data includes:

- Relevant medical features
- Proper data types
- Consistent encoding
- Adequate sample size

## 🚨 Troubleshooting

### Common Issues

1. **File Upload Errors**

   - Ensure file is CSV format
   - Check file size (< 100MB recommended)
   - Verify file encoding

2. **Training Failures**

   - Check dataset format
   - Ensure target column exists
   - Verify sufficient data samples

3. **Memory Issues**
   - Reduce dataset size
   - Use smaller test size
   - Disable hyperparameter tuning

### Performance Tips

- **Large Datasets**: Use 20% test size for faster training
- **Hyperparameter Tuning**: Enable only for final models
- **Feature Selection**: Remove irrelevant columns before training

## 🔒 Security & Privacy

- **Data Storage**: Temporary files are automatically cleaned up
- **Model Security**: Models are stored locally only
- **Privacy**: No data is transmitted externally

## 📚 Advanced Features

### Custom Preprocessing

Modify `train_model.py` to add:

- Custom feature engineering
- Additional algorithms
- Ensemble methods
- Cross-validation strategies

### Model Comparison

Train multiple models and compare:

- Performance metrics
- Feature importance
- Training time
- Model complexity

## 🤝 Support

For technical support or questions:

1. Check the error messages in the console
2. Verify dataset format and requirements
3. Review the training logs
4. Check system requirements and dependencies

## 📋 System Requirements

- **Python**: 3.8+
- **Memory**: 4GB+ RAM recommended
- **Storage**: 1GB+ free space
- **Dependencies**: See `requirements.txt`

---

**Note**: This training system is designed for developers and researchers. Always validate your models before clinical use.
