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

const CriteriaInput = ({ criteria, setCriteria }) => {
  const [description, setDescription] = useState('');

  const handleAddCriteria = () => {
    if (description.trim()) {
      setCriteria([...criteria, { description: description.trim() }]);
      setDescription('');
    }
  };

  const handleRemoveCriteria = (index) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Acceptance Criteria
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Criteria"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter acceptance criteria"
        />
        <Button
          variant="contained"
          onClick={handleAddCriteria}
          disabled={!description.trim()}
        >
          Add
        </Button>
      </Box>
      
      {criteria.length > 0 && (
        <List>
          {criteria.map((criterion, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => handleRemoveCriteria(index)}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText primary={`${index + 1}. ${criterion.description}`} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default CriteriaInput;