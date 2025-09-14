import React from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography,
  useTheme
} from '@mui/material';

const LoadingSpinner = ({ message = "Loading...", size = 40 }) => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        p: 3
      }}
    >
      <CircularProgress 
        size={size}
        sx={{
          color: theme.palette.primary.main
        }}
      />
      {message && (
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 2,
            color: theme.palette.text.secondary
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;