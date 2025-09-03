import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  HealthAndSafety,
  Warning,
  CheckCircle,
  Info,
  Favorite,
  Psychology,
  NotificationsActive,
  Science,
  Security,
  School,
  Timeline,
  Assessment,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { motion } from 'framer-motion';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [statistics, setStatistics] = useState(null);
  const [featureImportance, setFeatureImportance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, featuresResponse] = await Promise.all([
          axios.get(buildApiUrl(API_ENDPOINTS.STATISTICS)),
          axios.get(buildApiUrl(API_ENDPOINTS.FEATURES)),
        ]);
        
        setStatistics(statsResponse.data);
        setFeatureImportance(featuresResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const globalStats = [
    { label: 'Annual Strokes', value: '15M', color: 'error.main' },
    { label: 'Annual Deaths', value: '5M', color: 'error.dark' },
    { label: 'Disability Rate', value: '50%', color: 'warning.main' },
    { label: 'Preventable', value: '80%', color: 'success.main' },
  ];

  const riskFactors = [
    { factor: 'Hypertension', impact: 'Most significant', color: 'error.main' },
    { factor: 'Age', impact: 'Doubles every decade after 55', color: 'warning.main' },
    { factor: 'Diabetes', impact: 'Increases risk 2-4x', color: 'warning.main' },
    { factor: 'Smoking', impact: 'Doubles stroke risk', color: 'error.main' },
    { factor: 'Obesity', impact: 'Increases risk 1.5-2x', color: 'warning.main' },
  ];

  const preventionTips = [
    'Control blood pressure regularly',
    'Manage diabetes effectively',
    'Quit smoking immediately',
    'Maintain healthy weight',
    'Exercise 30 minutes daily',
    'Eat heart-healthy diet',
    'Limit alcohol consumption',
    'Manage stress levels',
    'Get regular check-ups',
    'Know stroke symptoms (F.A.S.T.)',
  ];

  const strokeSymptoms = [
    { symptom: 'F', description: 'Face drooping', action: 'Ask person to smile' },
    { symptom: 'A', description: 'Arm weakness', action: 'Ask person to raise both arms' },
    { symptom: 'S', description: 'Speech difficulty', action: 'Ask person to repeat simple phrase' },
    { symptom: 'T', description: 'Time to call 911', action: 'Call emergency services immediately' },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  // Prepare feature importance data for chart
  const featureChartData = featureImportance?.top_features?.map(([feature, importance]) => ({
    feature: feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    importance: (importance * 100).toFixed(1),
  })) || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
            Stroke Prevention Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Comprehensive insights and educational resources for stroke prevention
          </Typography>
        </motion.div>
      </Box>

      {/* Global Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
          Global Stroke Statistics
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {globalStats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                }}
              >
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: stat.color,
                    mb: 1,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Feature Importance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 3 }}>
          <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 600 }}>
            Key Risk Factors Importance
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Importance']} />
                <Bar dataKey="importance" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </motion.div>

      {/* Risk Factors and Prevention */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Paper elevation={3} sx={{ p: 4, height: '100%', borderRadius: 3 }}>
              <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Warning sx={{ mr: 2, color: 'warning.main' }} />
                Major Risk Factors
              </Typography>
              <List>
                {riskFactors.map((risk, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <TrendingUp sx={{ color: risk.color }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={risk.factor}
                      secondary={risk.impact}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Paper elevation={3} sx={{ p: 4, height: '100%', borderRadius: 3 }}>
              <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ mr: 2, color: 'success.main' }} />
                Prevention Tips
              </Typography>
              <List>
                {preventionTips.map((tip, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={tip}
                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* F.A.S.T. Stroke Symptoms */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 3 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
            Know the Signs: F.A.S.T.
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
            Remember these warning signs and act quickly. Time is critical in stroke treatment.
          </Typography>
          <Grid container spacing={3}>
            {strokeSymptoms.map((symptom, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.primary.main}15 100%)`,
                    border: `2px solid ${theme.palette.primary.main}`,
                  }}
                >
                  <Typography
                    variant="h1"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      color: 'primary.main',
                      mb: 2,
                      fontSize: { xs: '3rem', md: '4rem' },
                    }}
                  >
                    {symptom.symptom}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {symptom.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {symptom.action}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </motion.div>

      {/* Educational Resources */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
            Educational Resources
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent sx={{ p: 3 }}>
                  <School sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Understanding Stroke
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Learn about different types of stroke, causes, and risk factors.
                  </Typography>
                  <Button variant="outlined" size="small">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent sx={{ p: 3 }}>
                  <Timeline sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Prevention Timeline
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Age-based prevention strategies and health milestones.
                  </Typography>
                  <Button variant="outlined" size="small">
                    View Timeline
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent sx={{ p: 3 }}>
                  <Assessment sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Risk Assessment
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Take our comprehensive stroke risk assessment.
                  </Typography>
                  <Button variant="contained" size="small">
                    Start Assessment
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 4, md: 6 },
            textAlign: 'center',
            borderRadius: 4,
            mt: 6,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              mb: 3,
              fontWeight: 600,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Take Control of Your Health
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              lineHeight: 1.6,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            Knowledge is power. Understanding your stroke risk factors and taking preventive measures 
            can significantly reduce your chances of experiencing a stroke.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 600,
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'grey.100',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Assess Your Risk Now
          </Button>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Dashboard;
