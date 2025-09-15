import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  HealthAndSafety as HealthIcon,
  Assessment as AssessmentIcon,
  Home as HomeIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Predict Stroke', path: '/predict', icon: <AssessmentIcon /> },
    { text: 'Dashboard', path: '/dashboard', icon: <AssessmentIcon /> },
    { text: 'About', path: '/about', icon: <InfoIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box sx={{ width: { xs: 280, sm: 300 }, maxWidth: '85vw' }}>
      <Box sx={{ 
        p: 2, 
        textAlign: 'center', 
        borderBottom: 1, 
        borderColor: 'divider' 
      }}>
        <HealthIcon sx={{ 
          fontSize: { xs: 32, sm: 40 }, 
          color: 'primary.main', 
          mb: 1 
        }} />
        <Typography 
          variant="h6" 
          color="primary"
          sx={{
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          Stroke Predictor
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={isActive(item.path)}
            sx={{
              py: 1.5,
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
            }}
          >
            <Box sx={{ 
              mr: 2, 
              color: isActive(item.path) ? 'primary.main' : 'inherit',
              display: 'flex',
              alignItems: 'center'
            }}>
              {item.icon}
            </Box>
            <ListItemText
              primary={item.text}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: isActive(item.path) ? 600 : 400,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <HealthIcon sx={{ 
              mr: 1, 
              fontSize: { xs: 24, sm: 28, md: 32 },
              display: { xs: 'none', sm: 'block' }
            }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                '&:hover': { opacity: 0.8 },
              }}
              onClick={() => navigate('/')}
            >
              Stroke Predictor
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 0.5, sm: 1 },
              flexWrap: 'wrap'
            }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    fontWeight: isActive(item.path) ? 600 : 400,
                    backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                    padding: { xs: '6px 8px', sm: '8px 12px' },
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: { xs: 280, sm: 300 },
            maxWidth: '85vw'
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
