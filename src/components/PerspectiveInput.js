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

const PerspectiveInput = ({ perspectives, setPerspectives }) => {
  const [role, setRole] = useState('');
  const [viewpoint, setViewpoint] = useState('');

  const handleAddPerspective = () => {
    if (role.trim() && viewpoint.trim()) {
      setPerspectives([...perspectives, { role: role.trim(), viewpoint: viewpoint.trim() }]);
      setRole('');
      setViewpoint('');
    }
  };

  const handleRemovePerspective = (index) => {
    setPerspectives(perspectives.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Perspectives
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="User role or stakeholder type"
        />
        <TextField
          fullWidth
          label="Viewpoint"
          value={viewpoint}
          onChange={(e) => setViewpoint(e.target.value)}
          placeholder="Perspective or concern of this role"
        />
        <Button
          variant="contained"
          onClick={handleAddPerspective}
          disabled={!role.trim() || !viewpoint.trim()}
        >
          Add
        </Button>
      </Box>
      
      {perspectives.length > 0 && (
        <List>
          {perspectives.map((perspective, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => handleRemovePerspective(index)}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText
                primary={`As a ${perspective.role}`}
                secondary={perspective.viewpoint}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default PerspectiveInput;