import React, { useEffect, useState } from 'react';
import { useSpecification } from '../contexts/SpecificationContext';
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
  CircularProgress, 
  Alert,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Visibility, Add } from '@mui/icons-material';
import { unifiedApi } from '../services/unifiedApi';

const ComponentsPage = () => {
  const { 
    projects, 
    componentSpecifications,
    loading: contextLoading, 
    error: contextError, 
    fetchProjects 
  } = useSpecification();
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  };

  // Get components for selected project from context
  const projectComponents = selectedProject ? (componentSpecifications[selectedProject] || []) : [];

  if (contextLoading.projects) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (contextError) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{contextError}</Alert>
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
            to="/"
          >
            New Project
          </Button>
        </Box>

        {projects.length === 0 ? (
          <Alert severity="info">
            No projects found. Create your first project to generate component specifications!
          </Alert>
        ) : (
          <>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Project</InputLabel>
              <Select
                value={selectedProject}
                label="Select Project"
                onChange={handleProjectChange}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                    <Chip 
                      label={project.template} 
                      size="small" 
                      variant="outlined" 
                      sx={{ ml: 1 }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {contextLoading.componentSpecifications ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <CircularProgress />
              </Box>
            ) : contextError ? (
              <Alert severity="error">{contextError}</Alert>
            ) : selectedProject ? (
              projectComponents.length === 0 ? (
                <Alert severity="info">
                  No component specifications found for this project.{' '}
                  <Button 
                    component={Link} 
                    to={`/projects/${selectedProject}/specifications/generate`}
                    size="small"
                  >
                    Generate your first component specification!
                  </Button>
                </Alert>
              ) : (
                <List>
                  {projectComponents.map((component) => (
                    <ListItem key={component.id} divider>
                      <ListItemText
                        primary={component.componentName}
                        secondary={`Created: ${new Date(component.createdAt).toLocaleDateString()}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          component={Link}
                          to={`/component-specifications/${component.id}`}
                          edge="end"
                          aria-label="view"
                        >
                          <Visibility />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )
            ) : (
              <Alert severity="info">
                Please select a project to view component specifications.
              </Alert>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ComponentsPage;