// import React, { useState } from 'react';
// import axios from 'axios';

// const ContentCreation = () => {
//   const [file, setFile] = useState(null);
//   const [prompt, setPrompt] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [outputType, setOutputType] = useState('ppt'); // Can be 'ppt' or 'summary'
//   const [generatedContent, setGeneratedContent] = useState('');
//   const [pptUrl, setPptUrl] = useState(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handlePromptChange = (e) => {
//     setPrompt(e.target.value);
//   };

//   const handleOutputTypeChange = (e) => {
//     setOutputType(e.target.value);
//   };

//   const handleGenerateContent = async () => {
//     if (!file) {
//       alert('Please provide a file.');
//       return;
//     }

//     setIsLoading(true);
//     setGeneratedContent('');

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('prompt', prompt);
//     formData.append('outputType', outputType);

//     try {
//       const response = await axios.post('http://localhost:5000/content-creation', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (outputType === 'ppt') {
//         // const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
//         // const url = URL.createObjectURL(blob);
//         setPptUrl(response.data.pptUrl);
//         console.log(response.data.pptUrl);
//         setGeneratedContent(response.data.pptUrl);
//       } else {
//         setGeneratedContent(response.data.summary);
//       }
//     } catch (error) {
//       console.error('Error generating content:', error);
//       alert('Failed to generate content. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>Content Creation</h1>
//       <div>
//         <label>Upload document:</label>
//         <input type="file" onChange={handleFileChange} accept=".pdf,.docx" />
//       </div>
//       <div>
//         <label>Prompt:</label>
//         <textarea value={prompt} onChange={handlePromptChange} />
//       </div>
//       <div>
//         <label>Output Type:</label>
//         <select value={outputType} onChange={handleOutputTypeChange}>
//           <option value="ppt">PPT</option>
//           <option value="summary">Summary</option>
//         </select>
//       </div>
//       <button onClick={handleGenerateContent} disabled={isLoading}>
//         {isLoading ? 'Generating...' : 'Generate Content'}
//       </button>
//       {outputType === 'ppt' && generatedContent && (
//         <div>
//           <a href={`http://localhost:5000${pptUrl}`} download="generated_presentation.pptx">
//             Download Generated Presentation
//           </a>
//         </div>
//       )}
//       {outputType === 'summary' && generatedContent && (
//         <div>
//           <h2>Generated Summary</h2>
//           <p>{generatedContent}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ContentCreation;

import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';

const ContentCreation = () => {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [outputType, setOutputType] = useState('ppt');
  const [generatedContent, setGeneratedContent] = useState('');
  const [pptUrl, setPptUrl] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleOutputTypeChange = (e) => {
    setOutputType(e.target.value);
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
    formData.append('outputType', outputType);

    try {
      const response = await axios.post('http://localhost:5000/content-creation', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (outputType === 'ppt') {
        // const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
        // const url = URL.createObjectURL(blob);
        setPptUrl(response.data.pptUrl);
        console.log(response.data.pptUrl);
        setGeneratedContent(response.data.pptUrl);
      } else {
        console.log("Response",response.data);
        setGeneratedContent(response.data.summary);
        console.log("Summary",generatedContent);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Content Creation
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <input
              accept=".pdf,.docx"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
                {file ? file.name : 'Upload Document'}
              </Button>
            </label>
          </FormControl>
          <TextField
            label="Prompt"
            multiline
            rows={4}
            fullWidth
            value={prompt}
            onChange={handlePromptChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="output-type-label">Output Type</InputLabel>
            <Select
              labelId="output-type-label"
              value={outputType}
              onChange={handleOutputTypeChange}
              label="Output Type"
            >
              <MenuItem value="ppt">PPT</MenuItem>
              <MenuItem value="summary">Summary</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateContent}
            disabled={isLoading}
            fullWidth
            startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {isLoading ? 'Generating...' : 'Generate Content'}
          </Button>
        </Box>
      </Paper>

      {outputType === 'ppt' && pptUrl && (
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
      {outputType === 'summary' && generatedContent && (
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6">Generated Summary</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
          {generatedContent.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default ContentCreation;
