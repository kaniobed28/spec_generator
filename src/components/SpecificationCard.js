import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  useTheme
} from '@mui/material';

const SpecificationCard = ({ 
  title, 
  content, 
  onExport, 
  onView, 
  exportFilename,
  showViewButton = true,
  showExportButton = true 
}) => {
  const theme = useTheme();

  const handleExport = () => {
    if (onExport && exportFilename) {
      onExport(content, exportFilename);
    }
  };

  return (
    <Card 
      variant="outlined"
      sx={{
        borderRadius: theme.shape.borderRadius,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.main
          }}
        >
          {title}
        </Typography>
        <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            fontSize: '0.8rem',
            fontFamily: 'Roboto, monospace',
            color: theme.palette.text.secondary
          }}>
            {content}
          </pre>
        </Box>
      </CardContent>
      <CardActions>
        {showExportButton && (
          <Button 
            size="small" 
            onClick={handleExport}
            disabled={!content}
            sx={{
              fontWeight: 500
            }}
          >
            Export
          </Button>
        )}
        {showViewButton && onView && (
          <Button 
            size="small" 
            onClick={onView}
            sx={{
              fontWeight: 500
            }}
          >
            View
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default SpecificationCard;