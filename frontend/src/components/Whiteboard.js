// import React, { useState } from 'react';
// import axios from 'axios';
// import { Button, Typography, Box, Paper, CircularProgress, TextField, CssBaseline, Grid } from '@mui/material';
// import Sidebar from './Sidebar';
// import FileCopyIcon from '@mui/icons-material/FileCopy';
// import CheckIcon from '@mui/icons-material/Check';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import Sidebar from './Sidebar';
import axios from 'axios';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CheckIcon from '@mui/icons-material/Check';

// Function to transform the content
const transformContent = (content) => {
  const sections = content.split('#### ');

  const transformedSections = sections.map((section, index) => {
    if (section.startsWith('Text:')) {
      const lines = section.split('\n');
      const transformedLines = lines.map((line, idx) => {
        if (idx === 0) return null; // Skip the 'Text:' heading line
        if (line.trim() === 'None') return null; // Skip 'None' lines

        // Check if it's a bullet point
        if (line.startsWith('-')) {
          return (
            <ul key={`bullet-${index}-${idx}`} style={{ margin: 0, paddingLeft: '20px' }}>
              <li>{line.replace('-', '').trim()}</li>
            </ul>
          );
        } else {
          // Normal paragraph
          return (
            <Typography key={`text-${index}-${idx}`} variant="body1" component="p">
              {line.trim()}
            </Typography>
          );
        }
      });
      return transformedLines.filter(Boolean); // Filter out null/undefined items
    } else if (section.startsWith('Table:')) {
      const tableContent = section.trim().split('\n');
      if (tableContent.length > 1) {
        // Process table rows
        const tableRows = tableContent.slice(1).map((row, idx) => {
          if (row.trim() === 'None') return null; // Skip 'None' lines

          // Split table cells
          const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell !== '');
          return (
            <TableRow key={`table-row-${index}-${idx}`}>
              {cells.map((cell, cellIdx) => (
                <TableCell key={`table-cell-${index}-${idx}-${cellIdx}`}>{cell}</TableCell>
              ))}
            </TableRow>
          );
        });
        
        // Render table
        return (
          <TableContainer key={`table-${index}`} component={Paper} sx={{ marginBottom: 2 }}>
            <Table>
              <TableBody>
                {tableRows.filter(Boolean)} {/* Filter out null/undefined rows */}
              </TableBody>
            </Table>
          </TableContainer>
        );
      }
    } else if (section.startsWith('Diagram:')) {
      const lines = section.trim().split('\n');
      if (lines.length > 1 && lines[1].trim() !== 'None') {
        return (
          <Typography key={`diagram-${index}`} variant="body1" component="p">
            {lines.slice(1).join('\n').trim()}
          </Typography>
        );
      }
    }

    return null;
  });

  return transformedSections.flat(); // Flatten the array of sections
};


const Whiteboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [transformedContent, setTransformedContent] = useState([]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setSelectedFile(file); // Update selected file
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('whiteboardImage', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
      console.log(result);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(result.extractedText);
    // Optionally provide feedback that text has been copied
  };

  const handleCopy = () => {
    handleCopyToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  const handleDownloadWordFile = async () => {
    try {
      const response = await axios.post('http://localhost:5000/upload', {
        responseType: 'blob',
      });
      
      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'extracted_text.docx'; // Name of the file to download
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading Word file:', error);
    }
  };

  // const transformedContent = result && result.extractedText ? transformContent(result.extractedText) : '';

  // Use useEffect to transform content whenever result changes
  useEffect(() => {
    if (result && result.extractedText) {
      setTransformedContent(transformContent(result.extractedText));
    }
  }, [result]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container>
        <Grid item xs={2}>
          <Sidebar />
          {/* Sidebar component */}
        </Grid>
        <Grid item xs={10}>
          <Box sx={{ textAlign: 'center', marginTop: 4 }}>
            <Typography variant="h4" gutterBottom>
              Upload and Process Whiteboard Image
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <TextField
                type="file"
                onChange={handleImageChange}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ marginBottom: 2, width: '300px' }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Upload and Process'}
              </Button>
            </Box>
            {result && (
              <Box sx={{ marginTop: 4 }}>
                <Box>
                  <Paper sx={{ padding: 2, textAlign: 'left' }}>
                    <Button onClick={handleCopy} startIcon={copied ? <CheckIcon /> : <FileCopyIcon />} sx={{ mr: 2 }}>
                      {copied ? 'Copied' : 'Copy Text'}
                    </Button>
                    <Button variant="outlined"
                      color="secondary"
                      href={result.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer">
                      Download Word File
                    </Button>
                    <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                      Extracted Text
                    </Typography>
                    {/* <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{result.extractedText}</pre> */}
                    {/* <Box sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', textAlign: 'left' }}>
                      {transformedContent}
                    </Box> */}
                    {transformedContent.length > 0 && (
                      <Box sx={{ marginTop: 4 }}>
                        {transformedContent.map((item, index) => (
                          <React.Fragment key={index}>{item}</React.Fragment>
                        ))}
                      </Box>
                    )}
                  </Paper>
                </Box>
                <Box>
                  {uploadedImage && (
                    <Paper sx={{ padding: 2, textAlign: 'center' }}>
                      <Typography variant="h5" gutterBottom>
                        Uploaded Image
                      </Typography>
                      <img
                        src={uploadedImage}
                        alt="Uploaded Whiteboard"
                        style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                      />
                    </Paper>
                  )}
                </Box>
                
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Whiteboard;




{/* <Paper sx={{ padding: 2, textAlign: 'left', marginTop: 2 }}>
            <Typography variant="h5" gutterBottom>
              Extracted Graphs
            </Typography>
            <pre>{result.graphs}</pre>
          </Paper>
          <Paper sx={{ padding: 2, textAlign: 'left', marginTop: 2 }}>
            <Typography variant="h5" gutterBottom>
              Extracted Diagrams
            </Typography>
            <pre>{result.diagrams}</pre>
          </Paper>
          <Paper sx={{ padding: 2, textAlign: 'left', marginTop: 2 }}>
            <Typography variant="h5" gutterBottom>
              Extracted Tables
            </Typography>
            <pre>{result.tables}</pre>
          </Paper> */}