import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const MainNavigation = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
    <AppBar 
      position="static" 
      sx={{ 
        mb: 2,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1]
      }}
    >
      <Toolbar sx={{ 
        minHeight: 64,
        px: { xs: 1, sm: 2 }
      }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 700,
            color: theme.palette.primary.main
          }}
        >
          AI Spec Generator
        </Typography>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {menuItems.map((item) => (
              <Button 
                key={item.text}
                component={Link} 
                to={item.path}
                sx={{
                  color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.secondary,
                  fontWeight: isActive(item.path) ? 600 : 400,
                  borderBottom: isActive(item.path) ? `2px solid ${theme.palette.primary.main}` : 'none',
                  borderRadius: 0,
                  py: 1,
                  px: 2,
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  }
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        )}
        
        {/* Mobile Navigation */}
        {isMobile && (
          <>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
              sx={{
                color: theme.palette.text.primary
              }}
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
              sx={{
                mt: '48px'
              }}
            >
              {menuItems.map((item) => (
                <MenuItem 
                  key={item.text}
                  component={Link} 
                  to={item.path}
                  onClick={handleMobileMenuClose}
                  selected={isActive(item.path)}
                  sx={{
                    fontWeight: isActive(item.path) ? 600 : 400,
                    color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.primary
                  }}
                >
                  {item.text}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default MainNavigation;