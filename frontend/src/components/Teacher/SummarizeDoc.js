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
import RolloverTooltip from '../RolloverTooltip';
import { summaryPageContent } from '../content';
import { url_backend } from '../../constant';

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
      // Check file size (1.5MB = 1,500,000 bytes)
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
      setGeneratedContent('');
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('prompt', prompt);
  
      try {
        const response = await axios.post(url_backend+'/summary-creation', formData, {
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
            <RolloverTooltip content={summaryPageContent.generateSummary} arrow>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
              size="small"
              // sx={{ width: '200px', mt: 2 }}
            >
              Create Summary
            </Button>
            </RolloverTooltip>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
              <DialogTitle>Generate Summary</DialogTitle>
              <DialogContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Select a PDF or Word file with a maximum size of 1.5MB:
                </Typography>
                <Box mt={1} paddingBottom={1}>
                {/* <RolloverTooltip content={summaryPageContent.uploadFile} arrow> */}
                  <TextField
                    label={file ? file.name : "Select a PDF or Word file with a maximum size of 1.5MB"}
                    multiline
                    rows={3}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button component="label">
                            <CloudUploadIcon />
                            <input type="file" accept=".pdf,.doc,.docx" hidden onChange={handleFileChange} />
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/* </RolloverTooltip> */}
                </Box>
                {/* <RolloverTooltip content={summaryPageContent.wordLimit} arrow> */}
                <TextField
                  label="Word Limit"
                  type="number"
                  InputProps={{ inputProps: { min: 50, max: 10000 } }}
                  value={prompt}
                  onChange={handlePromptChange}
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                />
                {/* </RolloverTooltip> */}
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <RolloverTooltip content={summaryPageContent.copyText} arrow>
                  <Button onClick={handleCopy} startIcon={copied ? <CheckIcon /> : <FileCopyIcon />}>
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  </RolloverTooltip>
                  <RolloverTooltip content={summaryPageContent.download} arrow>
                  <Button variant="outlined" color="secondary" href={link} target="_blank" rel="noopener noreferrer">
                    Download Word File
                  </Button>
                  </RolloverTooltip>
                </Box>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {transformedContent}
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    );
  }    
  

export default SummarizeDoc;