import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  useTheme
} from '@mui/material';
import { ComponentSpecification } from '../models/ComponentSpecification';
import { useSpecification } from '../contexts/SpecificationContext';
import { unifiedApi } from '../services/unifiedApi';
import { useNavigate, useParams } from 'react-router-dom';
import AccessibleButton from './AccessibleButton';
import ResponsiveContainer from './ResponsiveContainer';
import SpecificationCard from './SpecificationCard';

const ComponentSpecificationGenerator = () => {
  const theme = useTheme();
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { 
    loading, 
    error: contextError, 
    setError, 
    clearError,
    createComponentSpecification
  } = useSpecification();
  
  const [componentData, setComponentData] = useState({
    componentName: '',
    componentDescription: ''
  });
  const [projectSpecification, setProjectSpecification] = useState(null);
  const [generatedSpecs, setGeneratedSpecs] = useState({
    requirements: '',
    design: '',
    tasks: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');

  // Fetch project specification when component mounts
  useEffect(() => {
    const fetchProjectSpecification = async () => {
      if (projectId) {
        try {
          const spec = await unifiedApi.specification.getByProjectId(projectId);
          setProjectSpecification(spec);
        } catch (err) {
          console.error('Error fetching project specification:', err);
          setError('Failed to fetch project specification. Generating component specifications without project context.');
        }
      }
    };
    
    fetchProjectSpecification();
  }, [projectId, setError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComponentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateComponentData = () => {
    const spec = new ComponentSpecification({
      componentName: componentData.componentName,
      projectId: projectId,
      componentDescription: componentData.componentDescription
    });
    
    const validation = spec.validate();
    
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return false;
    }
    
    return true;
  };

  const handleGenerateSpecifications = async () => {
    if (!validateComponentData()) {
      return;
    }

    setIsGenerating(true);
    clearError();
    setSuccess('');

    try {
      // Generate requirements with project context
      const requirements = await unifiedApi.ai.generateComponentRequirements(
        componentData.componentName,
        componentData.componentDescription,
        projectSpecification
      );

      // Generate design with project context
      const design = await unifiedApi.ai.generateComponentDesign(
        componentData.componentName,
        componentData.componentDescription,
        requirements,
        projectSpecification
      );

      // Generate tasks with project context
      const tasks = await unifiedApi.ai.generateComponentTasks(
        componentData.componentName,
        componentData.componentDescription,
        design,
        projectSpecification
      );

      setGeneratedSpecs({
        requirements,
        design,
        tasks
      });

      setSuccess('Specifications generated successfully!');
    } catch (err) {
      setError(err.userMessage || 'Failed to generate specifications. Please try again.');
      console.error('Error generating specifications:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Enhanced ID validation and extraction function
  const extractIdFromResult = (result) => {
    if (!result) {
      return null;
    }
    
    // Direct ID property
    if (result.id) {
      return result.id;
    }
    
    // Alternative ID properties that might be used
    if (result._id) {
      return result._id;
    }
    
    if (result.specId) {
      return result.specId;
    }
    
    // Check if result is a Firebase document snapshot
    if (result.ref && result.ref.id) {
      return result.ref.id;
    }
    
    // Check if result has a data property with ID
    if (result.data && typeof result.data === 'function') {
      const data = result.data();
      if (data && data.id) {
        return data.id;
      }
    }
    
    return null;
  };

  const handleSaveSpecifications = async () => {
    if (!generatedSpecs.requirements || !generatedSpecs.design || !generatedSpecs.tasks) {
      setError('Please generate specifications first');
      return;
    }

    // Validate before saving
    const specData = {
      componentName: componentData.componentName,
      projectId: projectId,
      projectSpecificationId: projectSpecification?.id || '',
      componentDescription: componentData.componentDescription,
      requirements: {
        content: generatedSpecs.requirements,
        format: 'ears'
      },
      design: {
        content: generatedSpecs.design,
        architecture: '',
        diagrams: []
      },
      tasks: {
        content: generatedSpecs.tasks,
        breakdown: []
      }
    };
    
    console.log('ComponentSpecificationGenerator: Creating spec with data:', specData);
    
    const spec = new ComponentSpecification(specData);
    console.log('ComponentSpecificationGenerator: Created spec object:', spec);
    
    const validation = spec.validate();
    console.log('ComponentSpecificationGenerator: Validation result:', validation);
    
    if (!validation.isValid) {
      const errorMsg = validation.errors.join(', ');
      console.error('ComponentSpecificationGenerator: Validation failed:', errorMsg);
      setError(errorMsg);
      return;
    }

    setIsSaving(true);
    clearError();
    setSuccess('');

    try {
      // Save using context function which uses unified API
      const specObject = spec.toObject();
      console.log('ComponentSpecificationGenerator: Calling createComponentSpecification with:', specObject);
      
      const result = await createComponentSpecification(specObject);
      console.log('ComponentSpecificationGenerator: Received result:', result);
      console.log('ComponentSpecificationGenerator: Result type:', typeof result);
      console.log('ComponentSpecificationGenerator: Result keys:', Object.keys(result || {}));
      
      // Enhanced ID validation with fallback mechanisms
      if (!result) {
        throw new Error('Failed to create specification - no result returned from Firebase');
      }
      
      // Extract ID using multiple methods
      const extractedId = extractIdFromResult(result);
      console.log('ComponentSpecificationGenerator: Extracted ID:', extractedId);
      
      if (!extractedId) {
        console.error('ComponentSpecificationGenerator: ID check failed. Result:', JSON.stringify(result, null, 2));
        throw new Error('Failed to create specification - no ID found in result');
      }
      
      // Ensure the result object has the ID property for navigation
      const resultWithId = {
        ...result,
        id: extractedId
      };
      
      setSuccess('Specifications saved successfully!');
      console.log('ComponentSpecificationGenerator: Saved specification:', resultWithId);
      console.log('ComponentSpecificationGenerator: Navigating to:', `/component-specifications/${extractedId}`);
      
      // Verify the specification was saved by trying to fetch it
      try {
        const verification = await unifiedApi.component.get(extractedId);
        if (!verification) {
          console.warn('ComponentSpecificationGenerator: Verification failed - specification not found immediately after creation');
        } else {
          console.log('ComponentSpecificationGenerator: Verification successful - specification exists');
        }
      } catch (verifyErr) {
        console.warn('ComponentSpecificationGenerator: Verification error:', verifyErr);
      }
      
      // Navigate directly to the created specification
      setTimeout(() => {
        navigate(`/component-specifications/${extractedId}`);
      }, 1500); // Increased timeout to allow for Firebase consistency
    } catch (err) {
      const errorMsg = err.userMessage || err.message || 'Failed to save specifications. Please try again.';
      console.error('ComponentSpecificationGenerator: Error saving specifications:', err);
      setError(errorMsg);
    } finally {
      setIsSaving(false);
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

  return (
    <ResponsiveContainer maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
          Component Specification Generator
        </Typography>
        
        {/* Show when project context is being used */}
        {projectSpecification && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 2,
              borderRadius: theme.shape.borderRadius
            }}
          >
            Generating specifications with project context: {projectSpecification.title || 'Untitled Project'}
          </Alert>
        )}
        
        {/* Show when project context is not available */}
        {!projectSpecification && projectId && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 2,
              borderRadius: theme.shape.borderRadius
            }}
          >
            No project specification found. Generating specifications without project context.
          </Alert>
        )}
        
        {(contextError) && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: theme.shape.borderRadius
            }}
          >
            {contextError}
          </Alert>
        )}
        
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 2,
              borderRadius: theme.shape.borderRadius
            }}
          >
            {success}
          </Alert>
        )}
        
        <Box component="form" sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Component Name"
                name="componentName"
                value={componentData.componentName}
                onChange={handleInputChange}
                required
                variant="outlined"
                helperText="Alphanumeric characters, spaces, and hyphens only (max 100 characters)"
                error={contextError && contextError.includes('Component name')}
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
                label="Component Description"
                name="componentDescription"
                value={componentData.componentDescription}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
                placeholder="Describe the component in detail (10-1000 characters)..."
                variant="outlined"
                error={contextError && contextError.includes('Component description')}
                helperText={`${componentData.componentDescription.length}/1000 characters`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <AccessibleButton
                variant="contained"
                size="large"
                onClick={handleGenerateSpecifications}
                disabled={isGenerating || loading.general}
                fullWidth
              >
                {isGenerating || loading.general ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                    Generating Specifications...
                  </>
                ) : (
                  'Generate Specifications'
                )}
              </AccessibleButton>
            </Grid>
          </Grid>
        </Box>
        
        {/* Generated Specifications Preview */}
        {generatedSpecs.requirements || generatedSpecs.design || generatedSpecs.tasks ? (
          <Box sx={{ mt: 4 }}>
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 2,
                color: theme.palette.text.primary
              }}
            >
              Generated Specifications
            </Typography>
            
            <Grid container spacing={3}>
              {/* Requirements Card */}
              <Grid item xs={12} md={4}>
                <SpecificationCard
                  title="Requirements"
                  content={generatedSpecs.requirements}
                  exportFilename={`${componentData.componentName}-requirements.md`}
                  onExport={handleExport}
                  showExportButton={true}
                />
              </Grid>
              
              {/* Design Card */}
              <Grid item xs={12} md={4}>
                <SpecificationCard
                  title="Design"
                  content={generatedSpecs.design}
                  exportFilename={`${componentData.componentName}-design.md`}
                  onExport={handleExport}
                  showExportButton={true}
                />
              </Grid>
              
              {/* Tasks Card */}
              <Grid item xs={12} md={4}>
                <SpecificationCard
                  title="Tasks"
                  content={generatedSpecs.tasks}
                  exportFilename={`${componentData.componentName}-tasks.md`}
                  onExport={handleExport}
                  showExportButton={true}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <AccessibleButton
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSaveSpecifications}
                disabled={isSaving || loading.general}
                sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 } }}
              >
                {isSaving || loading.general ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                    Saving...
                  </>
                ) : (
                  'Save Specifications'
                )}
              </AccessibleButton>
              <AccessibleButton
                variant="outlined"
                size="large"
                onClick={() => navigate(`/projects/${projectId}/specifications`)}
              >
                Cancel
              </AccessibleButton>
            </Box>
          </Box>
        ) : null}
      </Paper>
    </ResponsiveContainer>
  );
};

export default ComponentSpecificationGenerator;