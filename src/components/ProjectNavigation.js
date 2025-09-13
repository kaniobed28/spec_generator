import React, { useEffect } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Box,
  useTheme,
  useMediaQuery,
  Typography
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { Description, ListAlt, Settings } from '@mui/icons-material';
import { Toolbar } from '@mui/material';
import { useSpecification } from '../contexts/SpecificationContext';

const drawerWidth = 240;

const ProjectNavigation = () => {
  const { id: projectId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentProject, fetchProject } = useSpecification();

  // Fetch project details when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId]);

  const menuItems = [
    {
      text: 'Overview',
      icon: <Description />,
      path: `/projects/${projectId}`
    },
    {
      text: 'Component Specifications',
      icon: <ListAlt />,
      path: `/projects/${projectId}/specifications`
    },
    {
      text: 'Settings',
      icon: <Settings />,
      path: `/projects/${projectId}/settings`
    }
  ];

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="project navigation"
    >
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            mt: { md: 8 },
            height: { md: 'calc(100% - 64px)' }
          },
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <Toolbar /> {/* Spacer for the app bar */}
        <Box sx={{ overflow: 'auto', p: 2 }}>
          {/* Project Info */}
          {currentProject && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" noWrap>
                {currentProject.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {currentProject.template}
              </Typography>
            </Box>
          )}
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                component={Link} 
                to={item.path}
                sx={{ 
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)'
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.12)'
                  }
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </Box>
  );
};

export default ProjectNavigation;