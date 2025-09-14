import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  Grid
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { Delete, Visibility, Add } from '@mui/icons-material';
import { useSpecification } from '../contexts/SpecificationContext';
import { unifiedApi } from '../services/unifiedApi';
import SpecificationCard from './SpecificationCard';

const ComponentSpecificationList = () => {
  const theme = useTheme();
  const { id: projectId } = useParams();
  const { 
    componentSpecifications, 
    loading, 
    error, 
    setError, 
    clearError,
    fetchComponentSpecifications,
    fetchProject
  } = useSpecification();
  
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    const fetchSpecifications = async () => {
      try {
        clearError();
        // Fetch both project and component specifications for context
        await fetchProject(projectId);
        await fetchComponentSpecifications(projectId);
      } catch (err) {
        setError(err.userMessage || 'Failed to load component specifications. Please try again.');
        console.error('Error fetching component specifications:', err);
      }
    };

    if (projectId) {
      fetchSpecifications();
    }
  }, [projectId]);

  const handleDelete = async (specId) => {
    setLocalLoading(true);
    try {
      await unifiedApi.component.delete(specId);
      // Refresh the list
      await fetchComponentSpecifications(projectId);
    } catch (err) {
      setError(err.userMessage || 'Failed to delete component specification. Please try again.');
      console.error('Error deleting component specification:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleExport = (content, filename) => {
    if (!content) {
      setError('No content to export');
      return;
    }
    
    try {
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export file. Please try again.');
      console.error('Error exporting file:', err);
    }
  };

  // Get specifications for this project from context
  const projectSpecs = componentSpecifications[projectId] || [];

  if (loading.componentSpecifications || localLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert 
          severity="error"
          sx={{ 
            borderRadius: theme.shape.borderRadius
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3 },
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[2]
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main
            }}
          >
            Component Specifications
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to={`/projects/${projectId}/specifications/generate`}
            sx={{
              py: 1,
              px: 2,
              borderRadius: '8px',
              fontWeight: 600,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)'
              }
            }}
          >
            New Specification
          </Button>
        </Box>

        {projectSpecs.length === 0 ? (
          <Alert 
            severity="info"
            sx={{ 
              borderRadius: theme.shape.borderRadius
            }}
          >
            No component specifications found. Create your first specification!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {projectSpecs.map((spec) => (
              <Grid item xs={12} md={6} lg={4} key={spec.id}>
                <SpecificationCard
                  title={spec.componentName}
                  content={spec.requirements?.content || spec.design?.content || spec.tasks?.content || 'No content available'}
                  exportFilename={`${spec.componentName}-specification.md`}
                  onExport={handleExport}
                  onView={() => window.location.href = `#/component-specifications/${spec.id}`}
                  showViewButton={true}
                  showExportButton={true}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default ComponentSpecificationList;