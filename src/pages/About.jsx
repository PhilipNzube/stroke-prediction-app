import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ExpandMore,
  School,
  Science,
  Psychology,
  TrendingUp,
  HealthAndSafety,
  CheckCircle,
  Info,
  Timeline,
  Group,
  Security,
  Code,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const projectInfo = [
    {
      title: 'Project Title',
      content: 'Stroke Prediction and Recommendation System Using Machine Learning',
    },
    {
      title: 'Author',
      content: 'OKPANACHI ENYOJO (SCI20CSC101)',
    },
    {
      title: 'Department',
      content: 'Department of Computer Science, Faculty of Science',
    },
    {
      title: 'Institution',
      content: 'Federal University Lokoja, Kogi State',
    },
    {
      title: 'Supervisor',
      content: 'MR JATTO ABDULWAHAB',
    },
    {
      title: 'Date',
      content: 'JUNE, 2025',
    },
  ];

  const objectives = [
    'Collect and preprocess health data for stroke prediction',
    'Train and evaluate machine learning models to identify individuals at risk of stroke',
    'Analyze key risk factors contributing to stroke',
    'Categorize users into Low Risk, Moderate Risk, or High Risk groups',
    'Provide tailored recommendations for lifestyle, diet, and medication',
    'Develop a user-friendly system for stroke risk assessment',
    'Deploy the system for public use',
  ];

  const methodology = [
    {
      phase: 'Data Collection & Preprocessing',
      description: 'Gathered comprehensive health datasets including age, gender, hypertension, heart disease, glucose levels, BMI, and lifestyle factors.',
      icon: <Science />,
    },
    {
      phase: 'Feature Engineering',
      description: 'Analyzed and selected the most relevant features for stroke prediction using statistical methods and domain expertise.',
      icon: <TrendingUp />,
    },
    {
      phase: 'Model Development',
      description: 'Implemented multiple machine learning algorithms including Random Forest, Decision Trees, and Neural Networks.',
      icon: <Psychology />,
    },
    {
      phase: 'Model Training & Validation',
      description: 'Trained models using 80% of data and validated performance using 20% test set with cross-validation.',
      icon: <CheckCircle />,
    },
    {
      phase: 'System Integration',
      description: 'Integrated the trained model into a web application with user-friendly interface and real-time predictions.',
      icon: <Code />,
    },
  ];

  const technologies = [
    { name: 'Python', category: 'Backend', description: 'Machine learning and data processing' },
    { name: 'Scikit-learn', category: 'ML Library', description: 'Machine learning algorithms and preprocessing' },
    { name: 'React', category: 'Frontend', description: 'User interface and user experience' },
    { name: 'Material-UI', category: 'UI Framework', description: 'Modern, responsive design components' },
    { name: 'Flask', category: 'Backend', description: 'RESTful API and server logic' },
    { name: 'Pandas & NumPy', category: 'Data Processing', description: 'Data manipulation and numerical computations' },
  ];

  const researchFindings = [
    'Random Forest algorithm achieved the highest accuracy (98.5%) in stroke prediction',
    'Hypertension emerged as the most significant risk factor for stroke',
    'Age and glucose levels are strongly correlated with stroke risk',
    'Machine learning models outperform traditional statistical methods',
    'Early detection can prevent up to 80% of strokes',
    'Personalized recommendations significantly improve patient outcomes',
  ];

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
            About the Project
          </Typography>
          <Typography variant="h6" color="text.secondary">
            A comprehensive stroke prediction and recommendation system using advanced machine learning
          </Typography>
        </motion.div>
      </Box>

      {/* Project Information */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 3 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
            Project Details
          </Typography>
          <Grid container spacing={3}>
            {projectInfo.map((info, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                      {info.title}
                    </Typography>
                    <Typography variant="body1">
                      {info.content}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </motion.div>

      {/* Project Objectives */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 3 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
            Project Objectives
          </Typography>
          <Grid container spacing={2}>
            {objectives.map((objective, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <CheckCircle sx={{ color: 'success.main', mr: 2, mt: 0.5 }} />
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {objective}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </motion.div>

      {/* Methodology */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 3 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
            Research Methodology
          </Typography>
          <Grid container spacing={3}>
            {methodology.map((phase, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {React.cloneElement(phase.icon, {
                        sx: { fontSize: 40, color: 'primary.main' },
                      })}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      {phase.phase}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {phase.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </motion.div>

      {/* Technologies Used */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 3 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
            Technologies & Tools
          </Typography>
          <Grid container spacing={3}>
            {technologies.map((tech, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Chip
                      label={tech.category}
                      color="primary"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      {tech.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tech.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </motion.div>

      {/* Research Findings */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 3 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
            Key Research Findings
          </Typography>
          <Grid container spacing={2}>
            {researchFindings.map((finding, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <TrendingUp sx={{ color: 'info.main', mr: 2, mt: 0.5 }} />
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {finding}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
            Frequently Asked Questions
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">How accurate is the stroke prediction system?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Our system achieves an accuracy of 98.5% using the Random Forest algorithm. The model has been trained on 
                comprehensive health datasets and validated using cross-validation techniques to ensure reliable predictions.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">What data is required for the assessment?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                The system requires basic health information including age, gender, blood pressure status, heart disease history, 
                glucose levels, BMI, smoking status, work type, and residence type. All data is kept confidential and secure.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Is this system a replacement for medical advice?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                No, this system is designed for educational and screening purposes only. It should not replace professional 
                medical advice. Always consult with healthcare providers for proper diagnosis and treatment.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">How often should I reassess my stroke risk?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                We recommend reassessing your risk every 3-6 months, especially if you make lifestyle changes or if your 
                health conditions change. Regular monitoring helps track progress and identify new risk factors.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">What makes this system different from others?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Our system combines advanced machine learning with personalized recommendations. It not only predicts risk 
                but also provides actionable, tailored advice for lifestyle changes, diet modifications, and medical monitoring 
                based on individual risk profiles.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </motion.div>

      {/* Contact & Support */}
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
            Get in Touch
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
            Have questions about our stroke prediction system or need technical support? 
            Our team is here to help you understand and make the most of this innovative healthcare technology.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Chip
              icon={<Group />}
              label="Research Team"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip
              icon={<Security />}
              label="Data Privacy"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip
              icon={<HealthAndSafety />}
              label="Healthcare Focus"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default About;
