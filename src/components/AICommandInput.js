import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { GoogleGenerativeAI } from "@google/generative-ai";

const AICommandInput = ({ onFieldsFilled }) => {
  const [command, setCommand] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!command.trim()) {
      setError('Please enter a command to generate specifications');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Initialize Google Generative AI with API key
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || 'your-default-api-key');
      // Use the correct model name
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      // Create a prompt to extract project details from the user's command
      const prompt = `Based on the following project idea, extract and organize the information into structured fields:
"${command}"

Please provide the response in the following JSON format:
{
  "name": "A short, descriptive project name based on the idea",
  "description": "A detailed project description based on the idea",
  "template": "The most appropriate template from: custom, web-app, mobile-app, api, data-analysis",
  "userStories": [
    {
      "what": "What the user wants to achieve",
      "why": "Why the user wants this"
    }
  ],
  "perspectives": [
    {
      "role": "User role or stakeholder type",
      "viewpoint": "Perspective or concern of this role"
    }
  ],
  "acceptanceCriteria": [
    {
      "description": "Acceptance criterion description"
    }
  ],
  "customRequirements": [
    {
      "description": "Custom requirement description"
    }
  ]
}

Only provide the JSON response with no additional text or formatting.`;

      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{.*\}/s);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);
        
        // Notify parent component to fill the form fields
        if (onFieldsFilled) {
          onFieldsFilled(jsonData);
        }
      } else {
        throw new Error('Could not extract JSON from AI response');
      }
    } catch (err) {
      setError('Failed to generate project details. Please try again.');
      console.error('Error generating project details:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box sx={{ mt: 2, p: 3, border: '1px dashed #1976d2', borderRadius: 2, backgroundColor: '#f5f9ff' }}>
      <Typography variant="h6" gutterBottom>
        AI Project Details Generator
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Describe your project idea and let AI fill the form fields below. You can then review and edit before generating specifications.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          label="Describe your project idea"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="E.g., Create a task management app with user authentication and team collaboration features"
          multiline
          rows={3}
          disabled={isGenerating}
        />
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={isGenerating || !command.trim()}
          sx={{ minWidth: 120, height: 'fit-content', alignSelf: 'flex-start' }}
        >
          {isGenerating ? <CircularProgress size={24} /> : 'Fill Form'}
        </Button>
      </Box>
      
      <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#1976d2' }}>
        AI will populate the form fields below. Review and edit as needed before clicking "Generate Specifications".
      </Typography>
    </Box>
  );
};

export default AICommandInput;