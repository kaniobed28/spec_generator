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
  Link as MuiLink
} from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SaveAlt, Refresh } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { useSpecification } from '../contexts/SpecificationContext';
import { unifiedApi } from '../services/unifiedApi';

const SpecificationViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    specifications, 
    loading, 
    error, 
    setError, 
    clearError,
    fetchProject,
    fetchComponentSpecifications
  } = useSpecification();
  const [activeTab, setActiveTab] = useState(0);
  const [specification, setSpecification] = useState(null);

  useEffect(() => {
    // Fetch specification from context or API
    const fetchSpecification = async () => {
      try {
        clearError();
        // Try to get from context first
        if (specifications[id]) {
          setSpecification(specifications[id]);
        } else {
          // Fetch from API if not in context
          const response = await unifiedApi.specification.getByProjectId(id);
          setSpecification(response);
        }
        
        // Also fetch the project and component specifications for navigation context
        await fetchProject(id);
        await fetchComponentSpecifications(id);
      } catch (err) {
        setError(err.userMessage || 'Failed to load specifications. Please try again.');
        console.error('Error fetching specifications:', err);
      }
    };

    if (id) {
      fetchSpecification();
    } else {
      setError('Invalid project ID.');
    }
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleExport = (format) => {
    if (!specification) return;
    
    const projectName = specification.title.replace(/\s+/g, '_').toLowerCase();
    
    switch (format) {
      case 'markdown':
        exportAsMarkdown(specification, projectName);
        break;
      case 'pdf':
        exportAsPDF(specification, projectName);
        break;
      case 'html':
        exportAsHTML(specification, projectName);
        break;
      case 'json':
        exportAsJSON(specification, projectName);
        break;
      default:
        alert(`Exporting as ${format} format`);
    }
  };

  const exportAsMarkdown = (spec, filename) => {
    let markdownContent = `# ${spec.title}\n\n`;
    
    // Convert Map to array for iteration
    const sectionsArray = spec.sections instanceof Map ? 
      Array.from(spec.sections.values()) : 
      Object.values(spec.sections);
    
    sectionsArray.forEach(section => {
      markdownContent += `## ${section.title}\n\n${section.content}\n\n`;
    });
    
    downloadFile(markdownContent, `${filename}.md`, 'text/markdown');
  };

  const exportAsPDF = (spec, filename) => {
    // In a real implementation, you would use a library like jsPDF
    // For now, we'll just simulate the export
    alert(`Exporting as PDF: ${filename}.pdf\n\nIn a real implementation, this would generate a PDF file.`);
  };

  const exportAsHTML = (spec, filename) => {
    // Convert Map to array for iteration
    const sectionsArray = spec.sections instanceof Map ? 
      Array.from(spec.sections.values()) : 
      Object.values(spec.sections);
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>${spec.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; }
        h2 { color: #666; border-bottom: 1px solid #eee; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>${spec.title}</h1>
    ${sectionsArray.map(section => `
        <h2>${section.title}</h2>
        <div>${section.content.replace(/\n/g, '<br>')}</div>
    `).join('')}
</body>
</html>`;
    
    downloadFile(htmlContent, `${filename}.html`, 'text/html');
  };

  const exportAsJSON = (spec, filename) => {
    const jsonContent = JSON.stringify(spec, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  };

  const downloadFile = (content, filename, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = () => {
    // Implementation for regenerating specifications
    alert('Regenerating specifications');
  };

  // Show loading indicator based on context
  if (loading.specifications || loading.general) {
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

  // Handle case where specification is null or undefined
  if (!specification) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">No specification found for this project.</Alert>
      </Container>
    );
  }

  // Handle case where specification exists but has no sections
  if (!specification.sections) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">This specification has no content.</Alert>
      </Container>
    );
  }

  // Convert Map to array for iteration
  const sectionsArray = specification.sections instanceof Map ? 
    Array.from(specification.sections.values()) : 
    Object.values(specification.sections || {});
  
  const sectionKeys = specification.sections instanceof Map ? 
    Array.from(specification.sections.keys()) : 
    Object.keys(specification.sections || {});

  // Handle case where there are no sections
  if (sectionsArray.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info">This specification has no sections.</Alert>
      </Container>
    );
  }

  const currentSection = sectionKeys[activeTab];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {specification.title}
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRegenerate}
              sx={{ mr: 1 }}
            >
              Regenerate
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveAlt />}
              onClick={() => handleExport('pdf')}
              sx={{ mr: 1 }}
            >
              Export
            </Button>
            <Button
              variant="contained"
              component={Link}
              to={`/projects/${id}/specifications`}
            >
              Component Specs
            </Button>
          </Box>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {sectionsArray.map((section, index) => (
            <Tab key={sectionKeys[index] || index} label={section?.title || 'Untitled'} />
          ))}
        </Tabs>

        <Box sx={{ mt: 3, minHeight: 400 }}>
          <ReactMarkdown>
            {specification.sections && currentSection ? 
              (specification.sections[currentSection]?.content || 
               specification.sections[sectionKeys[activeTab]]?.content || 
               'No content available') : 
              'No content available'}
          </ReactMarkdown>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => handleExport('markdown')}
            disabled={!specification}
          >
            Export as Markdown
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleExport('json')}
            disabled={!specification}
          >
            Export as JSON
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleExport('html')}
            disabled={!specification}
          >
            Export as HTML
          </Button>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2">
            Looking to create component specifications?{' '}
            <MuiLink component={Link} to={`/projects/${id}/specifications/generate`}>
              Generate Component Specifications
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SpecificationViewer;