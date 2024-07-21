import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Tabs, Tab, Box, CircularProgress, 
  Typography, IconButton,
  FormControl,MenuItem,InputLabel,
  Select, Checkbox, ListItemText,
} from '@mui/material';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import OpenAI from 'openai';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';


const questionTypeOptions = [
    { value: 'Single Choice', label: 'Single Choice' },
    { value: 'Multiple Choice', label: 'Multiple Choice' },
  ];


const AddQuestionDialog = ({ open, handleClose, sessionId,purpose,title, addQuestion }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptions, setCorrectOptions] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [questionNumber, setQuestionNumber] = useState('');
  const [questionTypes, setQuestionTypes] = useState([]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddCorrectOption = () => {
    setCorrectOptions([...correctOptions, '']);
  };

  const handleCorrectOptionChange = (index, value) => {
    const newCorrectOptions = [...correctOptions];
    newCorrectOptions[index] = value;
    setCorrectOptions(newCorrectOptions);
  };

  const handleRemoveCorrectOption = (index) => {
    const newCorrectOptions = correctOptions.filter((_, idx) => idx !== index);
    setCorrectOptions(newCorrectOptions);
  };

  const handleQuestionTypeChange = (event) => {
    setQuestionTypes(event.target.value);
  };

  const handleSaveQuestion = async () => {
    if (correctOptions.some(opt => opt === '')) {
      alert('Please fill out all correct options.');
      return;
    }
    setLoading(true);
    try {
      const capitalizedCorrectOptions = correctOptions.map(opt => opt.toUpperCase()); // Capitalize correct options

      const newQuestion = {
        question,
        options,
        correct_options: capitalizedCorrectOptions,
      };
      const response = await axios.post('http://localhost:5000/add-question', { questions: [newQuestion],sessionId,purpose,title });
      console.log('Manually',response.data);
      addQuestion(response.data);
      handleClose();
    } catch (error) {
      console.error('Error adding question:', error);
    } finally {
      setLoading(false);
    }
  };

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
      formData.append('numQuestions', questionNumber);
      formData.append('questionTypes', JSON.stringify(questionTypes));
      formData.append('title', title);
      formData.append('purpose', purpose);
      formData.append('sessionId', sessionId);

      if (tabIndex === 1) {
        if (file) {
          formData.append('file', file); // Append the file from state
        } else {
          throw new Error('No file selected for upload.');
        }
      }

      const response = await axios.post('http://localhost:5000/generate-question', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // if (Array.isArray(response.data)) {
      //   response.data.forEach(question => {
      //     addQuestion(question);
      //   });
      // }
      console.log("Response",response);
      addQuestion(response.data.questions);
      // console.log(response.data);
      handleClose();
      // console.log('Generated Questions:', questions);
      // console.log('Session ID:', sessionId);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Question</DialogTitle>
      <DialogContent>
        <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)}>
          <Tab label="Manual" />
          <Tab label="Upload File" />
        </Tabs>
        {tabIndex === 0 && (
          <>
          <Typography>You can add your own created question. For answer enter A/B/C/D.</Typography>
            <TextField
              label="Question"
              fullWidth
              variant="outlined"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              sx={{ mt: 2 }}
            />
            {options.map((option, index) => (
              <TextField
                key={index}
                label={`Option ${index + 1}`}
                fullWidth
                variant="outlined"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                sx={{ mt: 2 }}
              />
              // <TextField
              //   key={index}
              //   label={`Option ${String.fromCharCode(65 + index)}`}
              //   fullWidth
              //   variant="outlined"
              //   value={option}
              //   onChange={(e) => {
              //     const newOptions = [...options];
              //     newOptions[index] = e.target.value;
              //     setOptions(newOptions);
              //   }}
              //   sx={{ mt: 2 }}
              // />
            ))}
            <Typography variant="body2" sx={{ mt: 2 }}>Correct Answers:</Typography>
            {correctOptions.map((correctOption, index) => (
              <Box key={index} display="flex" alignItems="center">
                <TextField
                  label={`Answer ${index + 1}`}
                  fullWidth
                  variant="outlined"
                  value={correctOption}
                  onChange={(e) => handleCorrectOptionChange(index, e.target.value)}
                  sx={{ mt: 2 }}
                />
                {index > 0 && (
                  <IconButton onClick={() => handleRemoveCorrectOption(index)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button onClick={handleAddCorrectOption} variant="contained" sx={{ mt: 2 }}>Add Answer</Button>
          </>
          // <TextField
          //     label="Correct Option(s)"
          //     fullWidth
          //     variant="outlined"
          //     value={correctOptions.join(',')}
          //     onChange={(e) => setCorrectOptions(e.target.value.split(','))}
          //     sx={{ mt: 2 }}
          //   />
          // </>
        )}
        {tabIndex === 1 && (
          <>
          <Typography>Upload Pdf or Word of maximum 1.5 MB and fill details to generate and add new question.</Typography>
            <input
              type="file"
              accept=".doc,.docx,.pdf"
              onChange={handleFileUpload}
              style={{ marginTop: '16px' }}
            />
            <Box paddingBottom={2}>
            <TextField
              label="Number of Questions"
              fullWidth
              type='number'
              InputProps={{ inputProps: { min: 1, max: 5 } }}
              variant="outlined"
              value={questionNumber}
              onChange={(e) => setQuestionNumber(e.target.value)}
              sx={{ mt: 2 }}
            />
            </Box>
            <Box>
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
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {tabIndex === 0 ? (
          <Button onClick={handleSaveQuestion} color="primary">
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        ) : (
          <Button onClick={handleGenerateQuestions} color="primary">
            {loading ? <CircularProgress size={24} /> : 'Generate'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddQuestionDialog;
