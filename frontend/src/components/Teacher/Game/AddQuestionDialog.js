import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Tabs, Tab, Box, CircularProgress, 
  Typography, IconButton,Divider,InputAdornment,
  FormControl,MenuItem,InputLabel,
  Select, Checkbox, ListItemText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add as AddIcon } from '@mui/icons-material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import axios from 'axios';
import RolloverTooltip from '../../RolloverTooltip';
import { addQuestionTooltips } from '../../content';
import { url_backend } from '../../../constant';


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
      const response = await axios.post(url_backend+'/add-question', { questions: [newQuestion],sessionId,purpose,title });
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

    // Check file size (1.5MB = 1,500,000 bytes)
    if (selectedFile.size > 1500000) {
      alert('File size exceeds 1.5MB. Please upload a smaller file.');
      return;
    }
    
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

      const response = await axios.post(url_backend+'/generate-question', formData, {
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
      {/* <RolloverTooltip content={addQuestionTooltips.useTab} arrow> */}
        <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)}>
          <Tab label="Manual" />
          <Tab label="Upload File" />
        </Tabs>
        {/* </RolloverTooltip> */}
        {tabIndex === 0 && (
          <>
          <Typography>You can add your own created question. For answer enter A/B/C/D.</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Question</Typography>
            {/* <RolloverTooltip content={addQuestionTooltips.questionInput} arrow> */}
            <TextField
              label="Question"
              fullWidth
              variant="outlined"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              sx={{ mt: 2 }}
            />
            {/* </RolloverTooltip> */}
            {/* <RolloverTooltip content={addQuestionTooltips.optionInput} arrow> */}
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
            ))}
            {/* </RolloverTooltip> */}
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>Answer(s)</Typography>
            {/* <RolloverTooltip content={addQuestionTooltips.answerInput} arrow> */}
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
                  <IconButton onClick={() => handleRemoveCorrectOption(index)} sx={{ mt: 2, ml: 1 }}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            {/* </RolloverTooltip> */}
            <RolloverTooltip content={addQuestionTooltips.addAnswerButton} arrow>
            <Button onClick={handleAddCorrectOption} variant="contained" sx={{ mt: 2, borderRadius: '50px' }} startIcon={<AddIcon />}>Add Answer</Button>
            </RolloverTooltip>
          </>
        )}
        {tabIndex === 1 && (
          <>
            <Typography>Upload PDF or Word file with a maximum size of 1.5MB and fill details to generate and add new question.</Typography>
            <Box mt={1} paddingBottom={1}>
            {/* <RolloverTooltip content={addQuestionTooltips.fileInput} arrow> */}
              <TextField
                label={file ? file.name : "Select a PDF or Word file with a maximum size of 1.5MB"}
                multiline
                rows={3}
                variant="outlined"
                fullWidth
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
              {/* </RolloverTooltip> */}
            </Box>
            <Box paddingBottom={2}>
            {/* <RolloverTooltip content={addQuestionTooltips.numQuestionsInput} arrow> */}
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
              {/* </RolloverTooltip> */}
            </Box>
            <Box>
            {/* <RolloverTooltip content={addQuestionTooltips.questionTypesSelect} arrow> */}
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
              {/* </RolloverTooltip> */}
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
}  

export default AddQuestionDialog;
