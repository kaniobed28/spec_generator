import React, { useEffect } from 'react';
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
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Visibility, Add } from '@mui/icons-material';

const ProjectsPage = () => {
  const { projects, loading, error, fetchProjects } = useSpecification();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading.projects) {
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
            Projects
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
            No projects found. Create your first project!
          </Alert>
        ) : (
          <List>
            {projects.map((project) => (
              <ListItem key={project.id} divider>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{project.name}</span>
                      <Chip 
                        label={project.template} 
                        size="small" 
                        variant="outlined" 
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography component="span" variant="body2" color="text.primary">
                        {project.description ? project.description.substring(0, 100) + (project.description.length > 100 ? '...' : '') : 'No description'}
                      </Typography>
                      <br />
                      <Typography component="span" variant="caption" color="text.secondary">
                        Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Unknown'}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    component={Link}
                    to={`/projects/${project.id}`}
                    edge="end"
                    aria-label="view"
                  >
                    <Visibility />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default ProjectsPage;