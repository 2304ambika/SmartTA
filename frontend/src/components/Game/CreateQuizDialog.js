// // QuizList.js
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box, Grid, Card, CardContent, Typography, Button, TextField, InputAdornment } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import axios from 'axios';

// const QuizList = ({ onCreateQuiz }) => {
//   const [quizzes, setQuizzes] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/quizzes')
//       .then(response => {
//         const groupedQuizzes = groupQuizzesBySessionId(response.data);
//         setQuizzes(groupedQuizzes);
//       })
//       .catch(error => console.error('Error fetching quizzes:', error));
//   }, []);

//   const groupQuizzesBySessionId = (quizzes) => {
//     const grouped = quizzes.reduce((acc, quiz) => {
//       if (!acc[quiz.sessionId]) {
//         acc[quiz.sessionId] = {
//           sessionId: quiz.sessionId,
//           purpose: quiz.purpose,
//           date: quiz.date,
//           questions: [],
//         };
//       }
//       acc[quiz.sessionId].questions.push(quiz);
//       return acc;
//     }, {});

//     return Object.values(grouped);
//   };

//   const filteredQuizzes = quizzes.filter(quiz =>
//     quiz.purpose.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleView = (quiz) => {
//     navigate('/view', { state: { questions: quiz.questions, purpose: quiz.purpose, date: quiz.date } });
//   };

//   return (
//     <Box>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//         <Typography variant="h4">Generate Quiz</Typography>
//         <Button variant="contained" color="primary" onClick={onCreateQuiz}>
//           Create New Quiz
//         </Button>
//       </Box>
//       <TextField
//         label="Search Quizzes"
//         variant="outlined"
//         fullWidth
//         margin="normal"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <SearchIcon />
//             </InputAdornment>
//           ),
//         }}
//       />
//       <Grid container spacing={3}>
//         {filteredQuizzes.map(quiz => (
//           <Grid item xs={12} sm={6} md={4} key={quiz.sessionId}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h5" component="div">{quiz.purpose}</Typography>
//                 <Typography color="text.secondary">{quiz.date}</Typography>
//                 <Typography variant="body2">{quiz.questions.length} Questions • {quiz.purpose}</Typography>
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   onClick={() => handleView(quiz)}
//                   sx={{ marginTop: 2 }}
//                 >
//                   View Test
//                 </Button>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default QuizList;
// --------------------------------------------------------------------
// import React, { useState } from 'react';
// import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

// const CreateQuizDialog = ({ open, handleClose }) => {
//   // Add form elements or any additional content here
//   return (
//     <Dialog open={open} onClose={handleClose}>
//       <DialogTitle>Create New Quiz</DialogTitle>
//       <DialogContent>
//         {/* Add your form elements or content here */}
//         <Typography>Form elements or content go here...</Typography>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose}>Cancel</Button>
//         <Button onClick={handleClose} color="primary">Create</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CreateQuizDialog;

import React, { useState } from 'react';
import OpenAI from "openai";
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import {
  Box,
  Button, 
  Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl,
  MenuItem,
  InputLabel, 
  TextField, 
  Typography, 
  Select, Checkbox, ListItemText,
  Tab, Tabs, 
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
// import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
// import Select from 'react-select';

// Set the workerSrc to the location of the pdf.worker.js file
// GlobalWorkerOptions.workerSrc = '/path/to/pdf.worker.js';

const questionTypeOptions = [
  { value: 'Single Choice', label: 'Single Choice' },
  { value: 'Multiple Choice', label: 'Multiple Choice' },
];

const purposeOptions = [
  { value: 'quiz', label: 'Quiz' },
  { value: 'self-assessment', label: 'Self Assessment' },
];

const CreateQuizDialog = ({ open, handleClose }) => {
  const [quizTitle, setQuizTitle] = useState('');
  // const [content, setContent] = useState('');
  const [numQuestions, setNumQuestions] = useState(1);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [purpose, setPurpose] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [text, setText] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null); // Add state for file

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile); // Store the file in state

    const fileType = selectedFile?.type;
    if (fileType === 'application/pdf' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'application/msword') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target.result;
        setText(fileContent);
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      alert('Unsupported file type. Please upload a PDF or Word document.');
    }
  };

  const handleGenerateQuestions = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('numQuestions', numQuestions);
      formData.append('questionTypes', JSON.stringify(questionTypes));
      formData.append('title', title);
      formData.append('purpose', purpose);

      if (tabValue === 1) {
        if (file) {
          formData.append('file', file); // Append the file from state
        } else {
          throw new Error('No file selected for upload.');
        }
      }

      const response = await axios.post('http://localhost:5000/generate-quiz', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { questions, sessionId } = response.data;
      console.log('Generated Questions:', questions);
      console.log('Session ID:', sessionId);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = () => {
    // Implement quiz creation logic here
    console.log({
      quizTitle,
      questionTypes,
      numQuestions,
      text
    });
    handleClose();
  };


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleQuestionTypeChange = (event) => {
    setQuestionTypes(event.target.value);
  };

  const resetForm = () => {
    setQuizTitle('');
    setQuestionTypes([]);
    setNumQuestions(1);
    setPurpose('');
    setText('');
    setTabValue(0); // Reset the tab to the initial value
    handleClose(); // Close the dialog
    setTitle('');
    setFile(null); // Reset the file state
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Generate New Quiz</DialogTitle>
      <DialogContent>
      <Typography>You can create a new quiz by copying text or uploading a file, simply choose your preferred method to generate the content.</Typography>
      <Box marginBottom={0}>
      <Tabs value={tabValue} onChange={handleTabChange} marginBottom={0} paddingBottom={1} aria-label="basic tabs example">
        <Tab label="Use Text" />
        <Tab label="Upload File" />
      </Tabs>
      {tabValue === 0 && (
        <Box mt={1} paddingBottom={1}>
          <TextField
            label="Paste your text here"
            multiline
            rows={3}
            variant="outlined"
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Box>
      )}
      {tabValue === 1 && (
        <Box mt={1} paddingBottom={1}>
          <TextField
            label={file?file.name:"Select a PDF or Word file with a maximum size of 1.5MB"}
            multiline
            rows={3}
            variant="outlined"
            fullWidth
            // value={file?file.name:''}
            onChange={(e) => setText(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button component="label">
                    <FileUploadOutlinedIcon />
                    <input type="file" accept=".pdf,.doc,.docx" hidden onChange={handleFileUpload} />
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
      </Box>
      {/* <Box gap={2}> */}
        <Box display="flex" justifyContent='space-between' flexDirection="row" gap={2} paddingBottom={1}>
        <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Number of Questions"
            type="number"
            variant="outlined"
            InputProps={{ inputProps: { min: 1, max: 10 } }}
            fullWidth
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
          />
          </Box>
          <Box display="flex" justifyContent='space-between' flexDirection="row" gap={2}>
          <FormControl fullWidth>
      <InputLabel id="question-types-label">Question Types</InputLabel>
      <Select
        labelId="question-types-label"
        id="question-types-select"
        multiple
        value={questionTypes}
        onChange={handleQuestionTypeChange}
        renderValue={(selected) => selected.join(', ')}
      >
        {questionTypeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={questionTypes.indexOf(option.value) > -1} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
          <FormControl fullWidth>
            <InputLabel>Purpose</InputLabel>
            <Select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value) } 
            >
              
              {purposeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>         
        </Box>
        {/* </Box> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={resetForm}>Cancel</Button>
        <Button onClick={handleGenerateQuestions} color="primary">{loading ? <CircularProgress size={24} /> : 'Create'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateQuizDialog;
