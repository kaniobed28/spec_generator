import React, { useState } from 'react';
import {
  Container,
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
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FileUpload from './FileUpload';
import UserStoryInput from './UserStoryInput';
import PerspectiveInput from './PerspectiveInput';
import CriteriaInput from './CriteriaInput';
import RequirementInput from './RequirementInput';
import AICommandInput from './AICommandInput';
import { useSpecification } from '../contexts/SpecificationContext';
import { unifiedApi } from '../services/unifiedApi';

const ProjectInput = () => {
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
  const [files, setFiles] = useState([]);
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

  const handleFileUpload = (uploadedFiles) => {
    setFiles(uploadedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    clearError();
    
    try {
      // Call the unified API to generate specifications
      const response = await unifiedApi.specification.generate({
        ...projectData,
        files
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Project Specifications
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}
        
        <AICommandInput onFieldsFilled={handleAIFillFields} />
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Project Name"
            name="name"
            value={projectData.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Project Description"
            name="description"
            value={projectData.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
            placeholder="Describe your project in detail..."
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Template</InputLabel>
            <Select
              value={projectData.template}
              label="Template"
              onChange={handleTemplateChange}
            >
              <MenuItem value="custom">Custom Project</MenuItem>
              <MenuItem value="web-app">Web Application</MenuItem>
              <MenuItem value="mobile-app">Mobile Application</MenuItem>
              <MenuItem value="api">API Service</MenuItem>
              <MenuItem value="data-analysis">Data Analysis</MenuItem>
            </Select>
          </FormControl>
          
          <UserStoryInput 
            userStories={projectData.userStories} 
            setUserStories={(userStories) => setProjectData(prev => ({ ...prev, userStories }))}
          />
          
          <PerspectiveInput 
            perspectives={projectData.perspectives} 
            setPerspectives={(perspectives) => setProjectData(prev => ({ ...prev, perspectives }))}
          />
          
          <CriteriaInput 
            criteria={projectData.acceptanceCriteria} 
            setCriteria={(acceptanceCriteria) => setProjectData(prev => ({ ...prev, acceptanceCriteria }))}
          />
          
          <RequirementInput 
            requirements={projectData.customRequirements} 
            setRequirements={(customRequirements) => setProjectData(prev => ({ ...prev, customRequirements }))}
          />
          
          <FileUpload onFileUpload={handleFileUpload} />
          
          <Box sx={{ mt: 3, position: 'relative' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isGenerating}
              fullWidth
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
        </Box>
      </Paper>
    </Container>
  );
};

export default ProjectInput;