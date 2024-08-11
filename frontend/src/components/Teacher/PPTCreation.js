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
import RolloverTooltip from '../RolloverTooltip';
import { pptCreationContent } from '../content';
import { url_backend } from '../../constant';

const PPTCreation = () => {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [pptUrl, setPptUrl] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0].size > 1500000) {
      alert('File size exceeds 1.5MB. Please upload a smaller file.');
      return;
    }
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
      const response = await axios.post(url_backend+'/ppt-creation', formData, {
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
            {/* <RolloverTooltip content={pptCreationContent.fileUploadButton} arrow> */}
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
          {/* </RolloverTooltip> */}
          {/* <RolloverTooltip content={pptCreationContent.slideCountField} arrow> */}
          <TextField
              label="Slide Count Limit"
              // fullWidth
              type="number"
              InputProps={{ inputProps: { min: 1, max: 10 } }}
              value={prompt}
              onChange={handlePromptChange}
              variant="outlined"
              
            />
            {/* </RolloverTooltip> */}
            </Box>
            {/* <RolloverTooltip content={pptCreationContent.generatePPTButton} arrow> */}
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
            {/* </RolloverTooltip> */}
            {pptUrl && (
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6">Generated Presentation</Typography>
            {/* <RolloverTooltip content={pptCreationContent.downloadPPTButton} arrow> */}
            <Button
              href={url_backend+`${pptUrl}`}
              download="generated_presentation.pptx"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Download Generated Presentation
            </Button>
            {/* </RolloverTooltip> */}
          </Paper>
        )}
        </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PPTCreation;
