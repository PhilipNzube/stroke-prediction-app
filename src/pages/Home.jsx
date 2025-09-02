import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  HealthAndSafety,
  TrendingUp,
  Psychology,
  NotificationsActive,
  Science,
  Security,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const features = [
    {
      icon: <HealthAndSafety sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'AI-Powered Prediction',
      description: 'Advanced machine learning algorithms provide accurate stroke risk assessment based on comprehensive health data.',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Personalized Insights',
      description: 'Get tailored recommendations for lifestyle changes, diet modifications, and medical monitoring.',
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Risk Analysis',
      description: 'Comprehensive analysis of multiple risk factors including age, hypertension, diabetes, and lifestyle choices.',
    },
    {
      icon: <NotificationsActive sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Early Warning System',
      description: 'Identify stroke risk factors early and take preventive measures before it\'s too late.',
    },
    {
      icon: <Science sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Evidence-Based',
      description: 'Built on extensive research and validated medical data for reliable predictions.',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Privacy First',
      description: 'Your health data is secure and confidential, with enterprise-grade security measures.',
    },
  ];

  const stats = [
    { number: '15M', label: 'Annual Strokes Worldwide' },
    { number: '5M', label: 'Stroke Deaths Annually' },
    { number: '80%', label: 'Preventable Strokes' },
    { number: '98%', label: 'Prediction Accuracy' },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant={isMobile ? 'h3' : 'h1'}
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  Predict Stroke Risk with AI
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
                  Advanced machine learning technology to assess your stroke risk and provide personalized recommendations for prevention.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/predict')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
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
                    Start Assessment
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/about')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 400,
                  }}
                >
                  <HealthAndSafety
                    sx={{
                      fontSize: { xs: 200, md: 300 },
                      opacity: 0.8,
                      filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
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
                      color: 'primary.main',
                      mb: 1,
                    }}
                  >
                    {stat.number}
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
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            component="h2"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Why Choose Our System?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                      <Box sx={{ mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          mb: 2,
                          fontWeight: 600,
                          color: 'text.primary',
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Paper
            elevation={6}
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              borderRadius: 4,
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
              Ready to Assess Your Risk?
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
              Take the first step towards better health. Our AI-powered system will analyze your risk factors and provide personalized recommendations.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/predict')}
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
              Get Started Now
            </Button>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Home;
