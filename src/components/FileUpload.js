import React, { useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useTheme
} from '@mui/material';
import { AttachFile, Delete } from '@mui/icons-material';

const FileUpload = ({ onFileUpload }) => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = React.useState([]);
  const theme = useTheme();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);
    onFileUpload(newFiles);
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFileUpload(newFiles);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upload Files (Optional)
      </Typography>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        style={{ display: 'none' }}
      />
      
      <Button
        variant="outlined"
        startIcon={<AttachFile />}
        onClick={handleButtonClick}
        fullWidth
        sx={{
          justifyContent: 'flex-start',
          pl: 2,
          pr: 2,
          py: 1.5,
          borderRadius: theme.shape.borderRadius,
          borderColor: theme.palette.divider,
          color: theme.palette.text.primary,
          '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.action.hover
          }
        }}
      >
        Choose Files
      </Button>
      
      {files.length > 0 && (
        <List dense sx={{ mt: 2 }}>
          {files.map((file, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => handleRemoveFile(index)}
                  size="small"
                  sx={{
                    color: theme.palette.error.main
                  }}
                >
                  <Delete />
                </IconButton>
              }
              sx={{
                bgcolor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius,
                mb: 0.5,
                pl: 1,
                pr: 6
              }}
            >
              <ListItemText
                primary={file.name}
                secondary={`${(file.size / 1024).toFixed(2)} KB${file.type ? ` • ${file.type}` : ''}`}
                primaryTypographyProps={{
                  variant: 'body2',
                  noWrap: true
                }}
                secondaryTypographyProps={{
                  variant: 'caption'
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
      
      <Typography 
        variant="caption" 
        display="block" 
        sx={{ 
          mt: 1, 
          color: theme.palette.text.secondary 
        }}
      >
        Optional: Upload any files that might contain relevant information for generating specifications
      </Typography>
    </Box>
  );
};

export default FileUpload;