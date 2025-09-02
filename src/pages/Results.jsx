import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Info,
  HealthAndSafety,
  Restaurant,
  FitnessCenter,
  Medication,
  Monitor,
  ArrowBack,
  Download,
  Share,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { usePrediction } from '../context/PredictionContext';
import { motion } from 'framer-motion';

const Results = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { results, predictionData, loading, error } = usePrediction();
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Analyzing your health data...
        </Typography>
      </Container>
    );
  }

  if (error || !results) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'No results available. Please complete the assessment first.'}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/predict')}
          startIcon={<ArrowBack />}
        >
          Go Back to Assessment
        </Button>
      </Container>
    );
  }

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low':
        return 'success';
      case 'moderate':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'info';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'low':
        return <CheckCircle />;
      case 'moderate':
        return <Warning />;
      case 'high':
        return <TrendingUp />;
      default:
        return <Info />;
    }
  };

  const getRecommendationIcon = (category) => {
    switch (category) {
      case 'lifestyle':
        return <FitnessCenter />;
      case 'diet':
        return <Restaurant />;
      case 'medical':
        return <Medication />;
      case 'monitoring':
        return <Monitor />;
      default:
        return <Info />;
    }
  };

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      
      // Prepare data for PDF generation
      const reportData = {
        stroke_probability: results.stroke_probability,
        risk_level: results.risk_level,
        risk_category: results.risk_category,
        recommendations: results.recommendations,
        userData: predictionData,
        timestamp: new Date().toISOString()
      };

      // Call the PDF generation endpoint
      const response = await fetch('http://localhost:5000/api/download-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF report');
      }

      // Get the PDF blob and download it
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stroke-risk-assessment-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download PDF report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      setSharing(true);
      
      // Prepare data for sharing
      const shareData = {
        stroke_probability: results.stroke_probability,
        risk_level: results.risk_level,
        risk_category: results.risk_category,
        recommendations: results.recommendations,
        userData: predictionData,
        timestamp: new Date().toISOString()
      };

      // Call the share endpoint
      const response = await fetch('http://localhost:5000/api/share-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shareData),
      });

      if (!response.ok) {
        throw new Error('Failed to share results');
      }

      const shareResult = await response.json();

      if (shareResult.success) {
        // Try to use native sharing first
        if (navigator.share) {
          navigator.share({
            title: 'My Stroke Risk Assessment',
            text: `My stroke risk assessment shows ${results.risk_level} risk (${results.stroke_probability}% probability).`,
            url: shareResult.share_url,
          });
        } else {
          // Fallback: copy share link to clipboard
          navigator.clipboard.writeText(shareResult.share_url);
          alert(`Results shared successfully! Share link copied to clipboard: ${shareResult.share_url}`);
        }
      } else {
        throw new Error(shareResult.error || 'Failed to share results');
      }

    } catch (error) {
      console.error('Error sharing results:', error);
      
      // Fallback to basic sharing
      if (navigator.share) {
        navigator.share({
          title: 'My Stroke Risk Assessment',
          text: `My stroke risk assessment shows ${results.risk_level} risk (${results.stroke_probability}% probability).`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(
          `My stroke risk assessment: ${results.risk_level} risk (${results.stroke_probability}% probability)`
        );
        alert('Assessment summary copied to clipboard!');
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
            Your Stroke Risk Assessment Results
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Based on your health profile, here's your personalized risk assessment and recommendations
          </Typography>
        </motion.div>
      </Box>

      {/* Risk Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            mb: 4,
            background: `linear-gradient(135deg, ${theme.palette[getRiskColor(results.risk_level)].light}15 0%, ${theme.palette[getRiskColor(results.risk_level)].main}15 100%)`,
            border: `2px solid ${theme.palette[getRiskColor(results.risk_level)].main}`,
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {React.cloneElement(getRiskIcon(results.risk_level), {
                  sx: {
                    fontSize: 40,
                    color: `${getRiskColor(results.risk_level)}.main`,
                    mr: 2,
                  },
                })}
                <Box>
                  <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
                    {results.risk_level.charAt(0).toUpperCase() + results.risk_level.slice(1)} Risk
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Risk Level Assessment
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h2" component="div" sx={{ fontWeight: 700, color: `${getRiskColor(results.risk_level)}.main` }}>
                {results.stroke_probability}%
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Probability of experiencing a stroke
              </Typography>
              <Chip
                label={results.risk_level.toUpperCase()}
                color={getRiskColor(results.risk_level)}
                size="large"
                sx={{ fontWeight: 600, fontSize: '1rem' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <HealthAndSafety
                  sx={{
                    fontSize: 120,
                    color: `${getRiskColor(results.risk_level)}.main`,
                    opacity: 0.7,
                    mb: 2,
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {results.risk_level === 'low' && 'Keep up the good work!'}
                  {results.risk_level === 'moderate' && 'Time to make some changes'}
                  {results.risk_level === 'high' && 'Immediate action required'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/predict')}
            startIcon={<ArrowBack />}
            size="large"
          >
            New Assessment
          </Button>
          <Button
            variant="outlined"
            onClick={handleDownloadReport}
            startIcon={downloading ? <CircularProgress size={20} /> : <Download />}
            size="large"
            disabled={downloading}
          >
            {downloading ? 'Generating PDF...' : 'Download Report'}
          </Button>
          <Button
            variant="outlined"
            onClick={handleShare}
            startIcon={sharing ? <CircularProgress size={20} /> : <Share />}
            size="large"
            disabled={sharing}
          >
            {sharing ? 'Sharing...' : 'Share Results'}
          </Button>
        </Box>
      </motion.div>

      {/* Recommendations Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
          Personalized Recommendations
        </Typography>
        <Grid container spacing={3}>
          {Object.entries(results.recommendations).map(([category, recommendations], index) => (
            <Grid item xs={12} md={6} key={category}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {React.cloneElement(getRecommendationIcon(category), {
                      sx: { fontSize: 32, color: 'primary.main', mr: 2 },
                    })}
                    <Typography variant="h6" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                      {category.replace('_', ' ')}
                    </Typography>
                  </Box>
                  <List dense>
                    {recommendations.map((recommendation, recIndex) => (
                      <ListItem key={recIndex} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle sx={{ fontSize: 20, color: 'success.main' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={recommendation}
                          sx={{
                            '& .MuiTypography-root': {
                              fontSize: '0.9rem',
                              lineHeight: 1.4,
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Important Notice */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Alert
          severity="info"
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': { fontSize: 32 },
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Important Notice
          </Typography>
          <Typography variant="body1">
            This assessment is for informational purposes only and should not replace professional medical advice. 
            Always consult with your healthcare provider for proper diagnosis and treatment. If you experience 
            any stroke symptoms (F.A.S.T. - Face drooping, Arm weakness, Speech difficulty, Time to call 911), 
            seek immediate medical attention.
          </Typography>
        </Alert>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <Paper elevation={2} sx={{ p: 4, mt: 4, borderRadius: 3 }}>
          <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 600 }}>
            Next Steps
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <FitnessCenter sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Implement Changes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start with the lifestyle recommendations and gradually incorporate other changes.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Monitor sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Monitor Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track your health metrics and reassess your risk in 3-6 months.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <HealthAndSafety sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Consult Doctor
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Discuss these results with your healthcare provider for personalized medical advice.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Results;
