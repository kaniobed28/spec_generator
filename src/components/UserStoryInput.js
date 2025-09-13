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

const UserStoryInput = ({ userStories, setUserStories }) => {
  const [what, setWhat] = useState('');
  const [why, setWhy] = useState('');

  const handleAddStory = () => {
    if (what.trim() && why.trim()) {
      setUserStories([...userStories, { what: what.trim(), why: why.trim() }]);
      setWhat('');
      setWhy('');
    }
  };

  const handleRemoveStory = (index) => {
    setUserStories(userStories.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        User Stories
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="What"
          value={what}
          onChange={(e) => setWhat(e.target.value)}
          placeholder="What the user wants to achieve"
        />
        <TextField
          fullWidth
          label="Why"
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          placeholder="Why the user wants this (value/benefit)"
        />
        <Button
          variant="contained"
          onClick={handleAddStory}
          disabled={!what.trim() || !why.trim()}
        >
          Add
        </Button>
      </Box>
      
      {userStories.length > 0 && (
        <List>
          {userStories.map((story, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => handleRemoveStory(index)}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText
                primary={`As a user, I want ${story.what}`}
                secondary={`So that ${story.why}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default UserStoryInput;