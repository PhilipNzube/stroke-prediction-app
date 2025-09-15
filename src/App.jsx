import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PredictionForm from './pages/PredictionForm';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import { PredictionProvider } from './context/PredictionContext';
import './responsive.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: 'clamp(2rem, 5vw, 2.5rem)',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: 'clamp(1.75rem, 4vw, 2rem)',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 500,
      fontSize: 'clamp(1.5rem, 3.5vw, 1.75rem)',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 500,
      fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      fontSize: 'clamp(1rem, 2vw, 1.125rem)',
      lineHeight: 1.4,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (min-width: 600px)': {
            paddingLeft: '24px',
            paddingRight: '24px',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PredictionProvider>
        <Router>
          <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            width: '100%',
            overflowX: 'hidden'
          }}>
            <Navbar />
            <Box 
              component="main" 
              sx={{ 
                flexGrow: 1, 
                py: { xs: 2, sm: 3, md: 4 },
                px: { xs: 1, sm: 2 },
                width: '100%',
                maxWidth: '100vw',
                overflowX: 'hidden'
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/predict" element={<PredictionForm />} />
                <Route path="/results" element={<Results />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </PredictionProvider>
    </ThemeProvider>
  );
}

export default App;
