import React from 'react';
import { Button, useTheme } from '@mui/material';

const AccessibleButton = ({ 
  children, 
  onClick, 
  variant = "contained", 
  color = "primary", 
  ...props 
}) => {
  const theme = useTheme();

  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      sx={{
        py: 1.5,
        px: 3,
        borderRadius: theme.shape.borderRadius,
        fontWeight: 600,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)'
        },
        '&:focus': {
          outline: `3px solid ${theme.palette.primary.main}`,
          outlineOffset: '2px'
        }
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default AccessibleButton;