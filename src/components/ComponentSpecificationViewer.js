import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { SaveAlt, Refresh } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { unifiedApi } from '../services/unifiedApi';

const ComponentSpecificationViewer = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [specification, setSpecification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [regenerating, setRegenerating] = useState(false);
  
  // Debug: Log the ID parameter
  console.log('ComponentSpecificationViewer: Received ID parameter:', id);
  console.log('ComponentSpecificationViewer: ID type:', typeof id);
  console.log('ComponentSpecificationViewer: Current URL:', window.location.href);

  useEffect(() => {
    // Fetch specification from Firebase
    const fetchSpecification = async () => {
      try {
        setLoading(true);
        setError(''); // Clear any previous errors
        
        console.log('ComponentSpecificationViewer: Fetching specification with ID:', id);
        
        // Add retry logic in case of timing issues
        let response = null;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (!response && retryCount < maxRetries) {
          if (retryCount > 0) {
            console.log(`ComponentSpecificationViewer: Retry attempt ${retryCount} for ID:`, id);
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
          response = await unifiedApi.component.get(id);
          retryCount++;
        }
        
        console.log('ComponentSpecificationViewer: Response received:', response);
        
        if (!response) {
          const errorMsg = `Component specification with ID "${id}" not found. Please check if the specification was saved correctly.`;
          console.error('ComponentSpecificationViewer:', errorMsg);
          setError(errorMsg);
          return;
        }
        
        setSpecification(response);
        console.log('ComponentSpecificationViewer: Specification set successfully');
      } catch (err) {
        const errorMsg = `Failed to load component specification. Error: ${err.message || err.userMessage || 'Unknown error'}`;
        console.error('ComponentSpecificationViewer: Error fetching component specification:', err);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (id && id !== 'undefined' && id !== 'null') {
      console.log('ComponentSpecificationViewer: Starting fetch for ID:', id);
      fetchSpecification();
    } else {
      const errorMsg = `Invalid component specification ID: "${id}". Please check the URL.`;
      console.error('ComponentSpecificationViewer:', errorMsg);
      setError(errorMsg);
      setLoading(false);
    }
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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

  const handleExportAll = () => {
    if (!specification) {
      setError('No specification to export');
      return;
    }
    
    try {
      const componentName = specification.componentName.replace(/\s+/g, '_').toLowerCase();
      
      // Export requirements
      if (specification.requirements?.content) {
        handleExport(specification.requirements.content, `${componentName}-requirements.md`);
      }
      
      // Export design
      if (specification.design?.content) {
        handleExport(specification.design.content, `${componentName}-design.md`);
      }
      
      // Export tasks
      if (specification.tasks?.content) {
        handleExport(specification.tasks.content, `${componentName}-tasks.md`);
      }
    } catch (err) {
      setError('Failed to export files. Please try again.');
      console.error('Error exporting files:', err);
    }
  };

  const handleRegenerate = async () => {
    if (!specification) {
      setError('No specification to regenerate');
      return;
    }
    
    setRegenerating(true);
    setError('');
    
    try {
      // Generate new requirements
      const requirements = await unifiedApi.ai.generateComponentRequirements(
        specification.componentName,
        specification.componentDescription || 'No description available'
      );

      // Generate new design
      const design = await unifiedApi.ai.generateComponentDesign(
        specification.componentName,
        specification.componentDescription || 'No description available',
        requirements
      );

      // Generate new tasks
      const tasks = await unifiedApi.ai.generateComponentTasks(
        specification.componentName,
        specification.componentDescription || 'No description available',
        design
      );

      // Update specification with new content
      const updatedSpec = {
        ...specification,
        requirements: {
          ...specification.requirements,
          content: requirements
        },
        design: {
          ...specification.design,
          content: design
        },
        tasks: {
          ...specification.tasks,
          content: tasks
        },
        updatedAt: new Date().toISOString()
      };

      // Save updated specification
      const result = await unifiedApi.component.update(id, updatedSpec);
      setSpecification(result);
      setSuccess('Specifications regenerated successfully!');
    } catch (err) {
      setError('Failed to regenerate specifications. Please try again.');
      console.error('Error regenerating specifications:', err);
    } finally {
      setRegenerating(false);
    }
  };

  const [success, setSuccess] = useState('');

  if (loading) {
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

  if (!specification) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">Component specification not found.</Alert>
      </Container>
    );
  }

  // Define tabs
  const tabs = [
    { label: 'Requirements', content: specification.requirements?.content },
    { label: 'Design', content: specification.design?.content },
    { label: 'Tasks', content: specification.tasks?.content }
  ];

  const currentTabContent = tabs[activeTab]?.content || '';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {specification.componentName}
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={regenerating ? <CircularProgress size={20} /> : <Refresh />}
              onClick={handleRegenerate}
              disabled={regenerating}
              sx={{ mr: 1 }}
            >
              {regenerating ? 'Regenerating...' : 'Regenerate'}
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveAlt />}
              onClick={handleExportAll}
            >
              Export All
            </Button>
          </Box>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>

        <Box sx={{ minHeight: 400, mb: 3 }}>
          {currentTabContent ? (
            <ReactMarkdown>{currentTabContent}</ReactMarkdown>
          ) : (
            <Typography>No content available for this section.</Typography>
          )}
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Requirements</Typography>
                <Typography variant="body2" color="text.secondary">
                  EARS-style acceptance criteria
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => handleExport(specification.requirements?.content, `${specification.componentName.replace(/\s+/g, '_')}-requirements.md`)}
                  disabled={!specification.requirements?.content}
                >
                  Export
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Design</Typography>
                <Typography variant="body2" color="text.secondary">
                  Technical design documentation
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => handleExport(specification.design?.content, `${specification.componentName.replace(/\s+/g, '_')}-design.md`)}
                  disabled={!specification.design?.content}
                >
                  Export
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Tasks</Typography>
                <Typography variant="body2" color="text.secondary">
                  Implementation breakdown
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => handleExport(specification.tasks?.content, `${specification.componentName.replace(/\s+/g, '_')}-tasks.md`)}
                  disabled={!specification.tasks?.content}
                >
                  Export
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ComponentSpecificationViewer;