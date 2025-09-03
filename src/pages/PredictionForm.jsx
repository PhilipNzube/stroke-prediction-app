import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person,
  Favorite,
  Work,
  Home,
  SmokingRooms,
  HealthAndSafety,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { usePrediction } from '../context/PredictionContext';
import axios from 'axios';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';

const steps = ['Personal Information', 'Health Conditions', 'Lifestyle & Work'];

const PredictionForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { setLoading, setError, setResults, setPredictionData } = usePrediction();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    hypertension: '',
    heart_disease: '',
    ever_married: '',
    work_type: '',
    Residence_type: '',
    avg_glucose_level: '',
    bmi: '',
    smoking_status: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      if (!formData.age) newErrors.age = 'Age is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.ever_married) newErrors.ever_married = 'Marital status is required';
    } else if (step === 1) {
      if (!formData.hypertension) newErrors.hypertension = 'Hypertension status is required';
      if (!formData.heart_disease) newErrors.heart_disease = 'Heart disease status is required';
      if (!formData.avg_glucose_level) newErrors.avg_glucose_level = 'Average glucose level is required';
      if (!formData.bmi) newErrors.bmi = 'BMI is required';
    } else if (step === 2) {
      if (!formData.work_type) newErrors.work_type = 'Work type is required';
      if (!formData.Residence_type) newErrors.Residence_type = 'Residence type is required';
      if (!formData.smoking_status) newErrors.smoking_status = 'Smoking status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    try {
      setLoading(true);
      setError(null);

      // Convert string values to appropriate types
      const processedData = {
        ...formData,
        age: parseInt(formData.age),
        hypertension: parseInt(formData.hypertension),
        heart_disease: parseInt(formData.heart_disease),
        avg_glucose_level: parseFloat(formData.avg_glucose_level),
        bmi: parseFloat(formData.bmi),
      };

      setPredictionData(processedData);

      const response = await axios.post(buildApiUrl(API_ENDPOINTS.PREDICT), processedData);
      setResults(response.data);
      navigate('/results');
    } catch (error) {
      console.error('Prediction error:', error);
      setError(error.response?.data?.error || 'Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                error={!!errors.age}
                helperText={errors.age}
                InputProps={{ inputProps: { min: 18, max: 120 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.gender}>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  label="Gender"
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
              {errors.gender && <Typography color="error" variant="caption">{errors.gender}</Typography>}
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset" error={!!errors.ever_married}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Have you ever been married?</Typography>
                <RadioGroup
                  row
                  value={formData.ever_married}
                  onChange={(e) => handleInputChange('ever_married', e.target.value)}
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
              {errors.ever_married && <Typography color="error" variant="caption">{errors.ever_married}</Typography>}
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset" error={!!errors.hypertension}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Do you have hypertension?</Typography>
                <RadioGroup
                  row
                  value={formData.hypertension}
                  onChange={(e) => handleInputChange('hypertension', e.target.value)}
                >
                  <FormControlLabel value="0" control={<Radio />} label="No" />
                  <FormControlLabel value="1" control={<Radio />} label="Yes" />
                </RadioGroup>
              </FormControl>
              {errors.hypertension && <Typography color="error" variant="caption">{errors.hypertension}</Typography>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset" error={!!errors.heart_disease}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Do you have heart disease?</Typography>
                <RadioGroup
                  row
                  value={formData.heart_disease}
                  onChange={(e) => handleInputChange('heart_disease', e.target.value)}
                >
                  <FormControlLabel value="0" control={<Radio />} label="No" />
                  <FormControlLabel value="1" control={<Radio />} label="Yes" />
                </RadioGroup>
              </FormControl>
              {errors.heart_disease && <Typography color="error" variant="caption">{errors.heart_disease}</Typography>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Average Glucose Level (mg/dL)"
                type="number"
                value={formData.avg_glucose_level}
                onChange={(e) => handleInputChange('avg_glucose_level', e.target.value)}
                error={!!errors.avg_glucose_level}
                helperText={errors.avg_glucose_level || "Normal range: 70-140 mg/dL"}
                InputProps={{ inputProps: { min: 50, max: 500, step: 0.1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="BMI (Body Mass Index)"
                type="number"
                value={formData.bmi}
                onChange={(e) => handleInputChange('bmi', e.target.value)}
                error={!!errors.bmi}
                helperText={errors.bmi || "Normal range: 18.5-24.9"}
                InputProps={{ inputProps: { min: 15, max: 60, step: 0.1 } }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.work_type}>
                <InputLabel>Work Type</InputLabel>
                <Select
                  value={formData.work_type}
                  label="Work Type"
                  onChange={(e) => handleInputChange('work_type', e.target.value)}
                >
                  <MenuItem value="Private">Private</MenuItem>
                  <MenuItem value="Self-employed">Self-employed</MenuItem>
                  <MenuItem value="Govt_job">Government Job</MenuItem>
                  <MenuItem value="children">Children/Student</MenuItem>
                </Select>
              </FormControl>
              {errors.work_type && <Typography color="error" variant="caption">{errors.work_type}</Typography>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.Residence_type}>
                <InputLabel>Residence Type</InputLabel>
                <Select
                  value={formData.Residence_type}
                  label="Residence Type"
                  onChange={(e) => handleInputChange('Residence_type', e.target.value)}
                >
                  <MenuItem value="Urban">Urban</MenuItem>
                  <MenuItem value="Rural">Rural</MenuItem>
                </Select>
              </FormControl>
              {errors.Residence_type && <Typography color="error" variant="caption">{errors.Residence_type}</Typography>}
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.smoking_status}>
                <InputLabel>Smoking Status</InputLabel>
                <Select
                  value={formData.smoking_status}
                  label="Smoking Status"
                  onChange={(e) => handleInputChange('smoking_status', e.target.value)}
                >
                  <MenuItem value="never smoked">Never Smoked</MenuItem>
                  <MenuItem value="formerly smoked">Formerly Smoked</MenuItem>
                  <MenuItem value="smokes">Currently Smokes</MenuItem>
                  <MenuItem value="Unknown">Unknown</MenuItem>
                </Select>
              </FormControl>
              {errors.smoking_status && <Typography color="error" variant="caption">{errors.smoking_status}</Typography>}
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 0: return <Person />;
      case 1: return <HealthAndSafety />;
      case 2: return <Work />;
      default: return <Person />;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
            Stroke Risk Assessment
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Please provide accurate information about your health and lifestyle. This will help our AI system 
            provide the most accurate stroke risk assessment and personalized recommendations.
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel icon={getStepIcon(index)}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4, mb: 4 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={Object.keys(errors).length > 0}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                Get Prediction
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={Object.keys(errors).length > 0}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>

        {/* Progress indicator */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Step {activeStep + 1} of {steps.length}
          </Typography>
        </Box>
      </Paper>

      {/* Information Cards */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <HealthAndSafety sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Health Data Privacy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your health information is encrypted and secure. We never share your data with third parties.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Favorite sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                AI-Powered Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our machine learning model analyzes multiple risk factors to provide accurate predictions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <SmokingRooms sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Personalized Recommendations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get tailored advice based on your specific risk factors and health profile.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PredictionForm;
