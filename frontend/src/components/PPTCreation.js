import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  FormControl,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  CssBaseline,
  Grid,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import Sidebar from './Sidebar';

const PPTCreation = () => {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [pptUrl, setPptUrl] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };


  const handleGenerateContent = async () => {
    if (!file) {
      alert('Please provide a file.');
      return;
    }

    setIsLoading(true);
    // setGeneratedContent('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('prompt', prompt);

    try {
      const response = await axios.post('http://localhost:5000/ppt-creation', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      
        // const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
        // const url = URL.createObjectURL(blob);
        setPptUrl(response.data.pptUrl);
        console.log(response.data.pptUrl);
        // setGeneratedContent(response.data.pptUrl);
      
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Grid container>
        <Grid item xs={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={10} sx={{ display: 'flex', flexDirection: 'column', pl: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
          Create PPT
        </Typography>
        <Typography>You can create PPT an uploaded file for the specified number of slides.</Typography>
        <Grid item xs={10} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <FormControl fullWidth sx={{ mr: 2 }}>
              <input
                accept=".pdf,.docx"
                style={{ display: 'none' }}
                id="file-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
                  {file ? file.name : 'Select a PDF or Word file with a maximum size of 1.5MB'}
                </Button>
              </label>
          </FormControl>
          <TextField
              label="Slide Count Limit"
              // fullWidth
              type="number"
              InputProps={{ inputProps: { min: 1, max: 10 } }}
              value={prompt}
              onChange={handlePromptChange}
              variant="outlined"
              
            />
            </Box>
        <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateContent}
              disabled={isLoading}
              // fullWidth
              startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {isLoading ? 'Generating...' : 'Generate PPT'}
            </Button>
            {pptUrl && (
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6">Generated Presentation</Typography>
            <Button
              href={`http://localhost:5000${pptUrl}`}
              download="generated_presentation.pptx"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Download Generated Presentation
            </Button>
          </Paper>
        )}
        </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PPTCreation;
