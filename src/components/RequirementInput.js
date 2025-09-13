import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const RequirementInput = ({ requirements, setRequirements }) => {
  const [description, setDescription] = useState('');

  const handleAddRequirement = () => {
    if (description.trim()) {
      setRequirements([...requirements, { description: description.trim() }]);
      setDescription('');
    }
  };

  const handleRemoveRequirement = (index) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Custom Requirements
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Requirement"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter custom requirement"
        />
        <Button
          variant="contained"
          onClick={handleAddRequirement}
          disabled={!description.trim()}
        >
          Add
        </Button>
      </Box>
      
      {requirements.length > 0 && (
        <List>
          {requirements.map((requirement, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => handleRemoveRequirement(index)}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText primary={requirement.description} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default RequirementInput;