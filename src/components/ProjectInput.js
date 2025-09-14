import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  useTheme,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserStoryInput from './UserStoryInput';
import PerspectiveInput from './PerspectiveInput';
import CriteriaInput from './CriteriaInput';
import RequirementInput from './RequirementInput';
import AICommandInput from './AICommandInput';
import { useSpecification } from '../contexts/SpecificationContext';
import { unifiedApi } from '../services/unifiedApi';
import ResponsiveContainer from './ResponsiveContainer';

const ProjectInput = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setLoading, setError, clearError, error } = useSpecification();
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    template: 'custom',
    userStories: [],
    perspectives: [],
    acceptanceCriteria: [],
    customRequirements: []
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateChange = (e) => {
    setProjectData(prev => ({
      ...prev,
      template: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    clearError();
    
    try {
      // Call the unified API to generate specifications
      const response = await unifiedApi.specification.generate({
        ...projectData
      });
      
      // Redirect to project specifications view
      navigate(`/projects/${response.project.id}`);
    } catch (err) {
      setError(err.userMessage || 'Failed to generate specifications. Please try again.');
      console.error('Error generating specifications:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAIFillFields = (aiData) => {
    // Update the project data with AI-generated fields
    setProjectData(prev => ({
      ...prev,
      name: aiData.name || prev.name,
      description: aiData.description || prev.description,
      template: aiData.template || prev.template,
      userStories: aiData.userStories || prev.userStories,
      perspectives: aiData.perspectives || prev.perspectives,
      acceptanceCriteria: aiData.acceptanceCriteria || prev.acceptanceCriteria,
      customRequirements: aiData.customRequirements || prev.customRequirements
    }));
  };

  return (
    <ResponsiveContainer maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 4 },
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[2]
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.main,
            mb: 3
          }}
        >
          Generate Project Specifications
        </Typography>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: theme.shape.borderRadius
            }}
          >
            {error}
          </Alert>
        )}
        
        <AICommandInput onFieldsFilled={handleAIFillFields} />
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                name="name"
                value={projectData.name}
                onChange={handleInputChange}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Description"
                name="description"
                value={projectData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                placeholder="Describe your project in detail..."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Template</InputLabel>
                <Select
                  value={projectData.template}
                  label="Template"
                  onChange={handleTemplateChange}
                  sx={{
                    borderRadius: '8px'
                  }}
                >
                  <MenuItem value="custom">Custom Project</MenuItem>
                  <MenuItem value="web-app">Web Application</MenuItem>
                  <MenuItem value="mobile-app">Mobile Application</MenuItem>
                  <MenuItem value="api">API Service</MenuItem>
                  <MenuItem value="data-analysis">Data Analysis</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <UserStoryInput 
                userStories={projectData.userStories} 
                setUserStories={(userStories) => setProjectData(prev => ({ ...prev, userStories }))}
              />
            </Grid>
            
            <Grid item xs={12}>
              <PerspectiveInput 
                perspectives={projectData.perspectives} 
                setPerspectives={(perspectives) => setProjectData(prev => ({ ...prev, perspectives }))}
              />
            </Grid>
            
            <Grid item xs={12}>
              <CriteriaInput 
                criteria={projectData.acceptanceCriteria} 
                setCriteria={(acceptanceCriteria) => setProjectData(prev => ({ ...prev, acceptanceCriteria }))}
              />
            </Grid>
            
            <Grid item xs={12}>
              <RequirementInput 
                requirements={projectData.customRequirements} 
                setRequirements={(customRequirements) => setProjectData(prev => ({ ...prev, customRequirements }))}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mt: 4, position: 'relative' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isGenerating}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  {isGenerating ? 'Generating Specifications...' : 'Generate Specifications'}
                </Button>
                {isGenerating && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </ResponsiveContainer>
  );
};

export default ProjectInput;