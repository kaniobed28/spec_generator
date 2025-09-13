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
  Divider
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { Delete, Visibility, Add } from '@mui/icons-material';
import { useSpecification } from '../contexts/SpecificationContext';
import { unifiedApi } from '../services/unifiedApi';

const ComponentSpecificationList = () => {
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
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Component Specifications
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to={`/projects/${projectId}/specifications/generate`}
          >
            New Specification
          </Button>
        </Box>

        {projectSpecs.length === 0 ? (
          <Alert severity="info">
            No component specifications found. Create your first specification!
          </Alert>
        ) : (
          <List>
            {projectSpecs.map((spec) => (
              <React.Fragment key={spec.id}>
                <ListItem>
                  <ListItemText
                    primary={spec.componentName}
                    secondary={`Created: ${new Date(spec.createdAt).toLocaleDateString()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      component={Link}
                      to={`/component-specifications/${spec.id}`}
                      edge="end"
                      aria-label="view"
                      sx={{ mr: 1 }}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(spec.id)}
                      disabled={localLoading}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default ComponentSpecificationList;