import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Menu as MenuIcon } from '@mui/icons-material';

const MainNavigation = () => {
  const location = useLocation();
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const isActive = (path) => {
    // Special handling for projects and components pages
    if (path === '/projects') {
      return location.pathname === '/projects';
    }
    if (path === '/components') {
      return location.pathname === '/components';
    }
    return location.pathname === path;
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Projects', path: '/projects' },
    { text: 'Components', path: '/components' }
  ];

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AI Spec Generator
        </Typography>
        
        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {menuItems.map((item) => (
            <Button 
              key={item.text}
              color="inherit" 
              component={Link} 
              to={item.path}
              variant={isActive(item.path) ? "outlined" : "text"}
            >
              {item.text}
            </Button>
          ))}
        </Box>
        
        {/* Mobile Navigation */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="navigation menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={mobileMenuAnchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
          >
            {menuItems.map((item) => (
              <MenuItem 
                key={item.text}
                component={Link} 
                to={item.path}
                onClick={handleMobileMenuClose}
                selected={isActive(item.path)}
              >
                {item.text}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MainNavigation;