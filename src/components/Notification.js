import React from 'react';
import { 
  Alert, 
  Snackbar,
  useTheme
} from '@mui/material';

const Notification = ({ 
  open, 
  onClose, 
  message, 
  severity = "info",
  autoHideDuration = 6000 
}) => {
  const theme = useTheme();

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        mb: 8
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ 
          width: '100%',
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[4]
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;