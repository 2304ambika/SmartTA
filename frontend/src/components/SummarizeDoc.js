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
    Grid,
    CssBaseline,
    InputAdornment,
    Dialog, DialogTitle, DialogContent, DialogActions
  } from '@mui/material';
  import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
  import CloudUploadIcon from '@mui/icons-material/CloudUpload';
  import SaveIcon from '@mui/icons-material/Save';
import Sidebar from './Sidebar';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CheckIcon from '@mui/icons-material/Check';

// Function to transform the content
const transformContent = (content) => {
  const lines = content.split('\n');
  const transformedLines = [];

  lines.forEach((line, index) => {
    if (line.startsWith('**')) {
      // Remove the double asterisks and make it a bold heading
      transformedLines.push(
        <Typography key={`heading-${index}`} variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
          {line.replace(/\*\*/g, '').trim()}
        </Typography>
      );
    } else if (line.startsWith('-')) {
      // Remove the dash and make it a bullet point
      transformedLines.push(
        <ul key={`bullet-${index}`} style={{ margin: 0, paddingLeft: '20px' }}>
          <li>{line.replace('-', '').trim()}</li>
        </ul>
      );
    } else {
      // Normal line
      transformedLines.push(
        <Typography key={`line-${index}`} variant="body1" component="p">
          {line}
        </Typography>
      );
    }
  });

  return transformedLines;
};
const SummarizeDoc = () => {
    const [file, setFile] = useState(null);
    const [prompt, setPrompt] = useState(1000);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');
    const [copied, setCopied] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [link,setLink]=useState('');
  
    const handleOpenDialog = () => {
      setDialogOpen(true);
    };
  
    const handleCloseDialog = () => {
      // setDialogOpen(false);
      if (!isLoading) {
        setDialogOpen(false);
      }
    };

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
      setGeneratedContent('');
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('prompt', prompt);
  
      try {
        const response = await axios.post('http://localhost:5000/summary-creation', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
          console.log("Response",response.data);
          setGeneratedContent(response.data.summary);
          setLink(response.data.downloadLink);
          console.log("Summary",generatedContent);

      } catch (error) {
        console.error('Error generating content:', error);
        alert('Failed to generate content. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const handleGenerateAndClose = () => {
      handleGenerateContent();
      // handleCloseDialog();
    };

    const handleCopyToClipboard = () => {
      navigator.clipboard.writeText(generatedContent);
      // Optionally provide feedback that text has been copied
    };
  
    const handleCopy = () => {
      handleCopyToClipboard();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    };

    const transformedContent = transformContent(generatedContent);

    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Grid container>
          <Grid item xs={2}>
            <Sidebar />
          </Grid>
          <Grid item xs={10} sx={{ display: 'flex', flexDirection: 'column', pl: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Generate Summary
            </Typography>
            <Typography sx={{ mb: 2 }}>
              Click on Create Summary and upload the file that you want to summarize and specify the word limit.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
              Create Summary
            </Button>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
              <DialogTitle>Generate Summary</DialogTitle>
              <DialogContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Select a PDF or Word file with a maximum size of 1.5MB:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <input
                  accept=".pdf,.docx"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                  <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
                    {file ? file.name : 'Upload File'}
                  </Button>
                </label>
              </Box>
                {/* <FormControl fullWidth sx={{ mb: 2 }}>
                  <input
                    accept=".pdf,.docx"
                    style={{ display: 'none' }}
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload">
                    <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
                      {file ? file.name : 'Select a PDF or Word file'}
                    </Button>
                  </label>
                </FormControl> */}
                <TextField
                  label="Word Limit"
                  type="number"
                  InputProps={{ inputProps: { min: 50, max: 10000 } }}
                  value={prompt}
                  onChange={handlePromptChange}
                  variant="outlined"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleGenerateAndClose} color="primary" variant="contained" startIcon={<SaveIcon />} disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Generate'}
                </Button>
              </DialogActions>
            </Dialog>
            {generatedContent && (
              <Paper sx={{ p: 3, mt: 2 }}>
                  <Button onClick={handleCopy} startIcon={copied ? <CheckIcon /> : <FileCopyIcon />} sx={{  alignItems:'right',mt: 2 }}>
                    {copied ? 'Copied' : ''}
                  </Button>
                  <Button variant="outlined"
                      color="secondary"
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer">
                      Download Word File
                    </Button>
                {/* </Box> */}
                {/* <Typography variant="body1" sx={{ mt: 2 }}>
                  {generatedContent.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </Typography> */}
                <Typography variant="body1" sx={{ mt: 2 }}>
                {transformedContent}
              </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    );
  };
  

export default SummarizeDoc;