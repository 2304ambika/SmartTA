// ViewQuiz.js
import React, { useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, CssBaseline, Grid, Card, CardContent, Typography, Button, IconButton, TextField, Switch } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from '../Sidebar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddQuestionDialog from './AddQuestionDialog';

const ViewQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, purpose,title, date } = location.state || {};
  const [generatedQuestions, setGeneratedQuestions] = useState(questions);
//   const [editingIndex, setEditingIndex] = useState(null); // Track which question is being edited
  const [editingMode, setEditingMode] = useState(false); // Track editing mode
//   const [pptUrl, setPptUrl] = useState(null);
  const [sessionId, setSessionId] = useState(questions[0].sessionId);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  

  if (!questions) {
    return <div>No quiz selected.</div>;
  }

  const handleDelete = async (index) => {
    try {
      await axios.put(`http://localhost:5000/reject-question/${generatedQuestions[index]._id}`);
      const newQuestions = [...generatedQuestions];
      newQuestions.splice(index, 1);
      console.log("newQuestions",newQuestions);
      setGeneratedQuestions(newQuestions);
    } catch (error) {
      console.error('Error rejecting question:', error);
    } finally {
    //   setOpenSnackbar(true);
    }
  };

  const handleToggleEdit = async () => {
    // Save changes to backend if editing mode is being turned off
    if (editingMode) {
      await saveChangesToBackend();
    }
    setEditingMode(!editingMode);
  };

  const saveChangesToBackend = async () => {
    try {
      await axios.put(`http://localhost:5000/edit-questions`, generatedQuestions);
    } catch (error) {
      console.error('Error updating questions:', error);
    }
  };

  const handleChange = (event, quizIndex, questionIndex, field, optionIndex) => {
    const updatedQuestions = [...generatedQuestions];
    if (field === 'question') {
      updatedQuestions[quizIndex].questions[questionIndex][field] = event.target.value;
    } else if (field === 'options') {
      updatedQuestions[quizIndex].questions[questionIndex][field][optionIndex] = event.target.value;
    } else if (field === 'correct_options') {
      updatedQuestions[quizIndex].questions[questionIndex][field][optionIndex] = event.target.value.toUpperCase();
    }
    setGeneratedQuestions(updatedQuestions);
  };


  const handleSaveChanges = async (quizIndex) => {
    try {
      const updatedQuestion = generatedQuestions[quizIndex];
      // Make API call to update the question in the backend
      await axios.put(`http://localhost:5000/update-question/${updatedQuestion._id}`, updatedQuestion);
      // Optionally, update local state or confirm success
    } catch (error) {
      console.error('Error updating question:', error);
    } 
  };

  const handleDownloadQuestions = async () => {
    if (!sessionId) {
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:5000/download-questions/${sessionId}`, {
        responseType: 'arraybuffer'
      });
      console.log("Download response", response);
  
      // Create blob from response data
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      const url = URL.createObjectURL(blob);
  
      // Create a temporary anchor element and click it to trigger the download
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'questions.pptx';
      document.body.appendChild(anchor);
      anchor.click();
  
      // Clean up the temporary anchor element and revoke the object URL
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading questions:', error);
    }
  };

  const addQuestion = (newQuestion) => {
    setGeneratedQuestions([...generatedQuestions, newQuestion]);
  };

  const handleAddQuestion = (newQuestion) => {
    // console.log('New',newQuestion);
    // newQuestion.map(element => {
    //   console.log("NewQuestions", element);
    // });
    const formattedQuestions = newQuestion.flatMap(element => {
      if (Array.isArray(element)) {
        return element;
      }
      return [element];
    });
  
    setGeneratedQuestions((prevQuestions) => [ ...formattedQuestions,...prevQuestions]);
  };


console.log("View Questions",generatedQuestions);
return (
  <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <Grid container>
      <Grid item xs={2}>
        <Sidebar />
      </Grid>
      <Grid item xs={10}>
        <Box display="flex" sx={{ flexGrow: 1, p: 3 }} alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Button onClick={() => navigate(-1)}><ArrowBackIcon /></Button>
            <Typography variant="h4" sx={{ ml: 1 }}>{title}</Typography>
          </Box>
          <Button color="primary" onClick={handleDownloadQuestions}>Download</Button>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ flexGrow: 1, px: 3, pb: 3 }}>
          <Typography variant="h6">Question Manager {generatedQuestions.length} Questions</Typography>
          <Box display="flex" alignItems="center">
            <Switch checked={editingMode} onChange={handleToggleEdit} />
            <Typography variant="h6" sx={{ mr: 1 }}>Edit Questionnaire</Typography>
            <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)} sx={{ ml: 2 }}>Add Question</Button>
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1, px: 3, pb: 3 }}>
          {generatedQuestions.map((quiz, quizIndex) => (
            quiz.questions.map((question, questionIndex) => (
              <Card key={questionIndex} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box display={'flex'} justifyContent={'space-between'}><Box width="100%">
                {editingMode ? (
                  <Box key={quizIndex} sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>{`Q${quizIndex+1}`}</Typography>
                      <TextField
                        multiline
                        fullWidth
                        value={question.question}
                        onChange={(e) => handleChange(e, quizIndex, questionIndex, 'question')}
                      />
                      </Box>
                    ) : (
                      <Typography variant="h6">{`Q${quizIndex+1}. ${question.question}`}</Typography>
                    )}
                    {question.options.map((option, optionIndex) => (
                      editingMode ? (
                        <Box key={optionIndex} sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>{`${String.fromCharCode(65 + optionIndex)}.`}</Typography>
                          <TextField
                            key={optionIndex}
                            multiline
                            fullWidth
                            value={option}
                            onChange={(e) => handleChange(e, quizIndex, questionIndex, 'options', optionIndex)}
                            sx={{ flexGrow: 1 }}
                          />
                          </Box>
                      ) : (
                        <Typography key={optionIndex} variant="body2" sx={{ mt: 1 }}>{`${String.fromCharCode(65 + optionIndex)}. ${option}`}</Typography>
                      )
                    ))}
                    <Typography variant="body2" sx={{ mt: 1 }}>Answer:</Typography>
                    {question.correct_options.map((ans, ansIdx) => (
                      editingMode ? (
                        <TextField
                          key={ansIdx}
                          multiline
                          fullWidth
                          value={ans}
                          onChange={(e) => handleChange(e, quizIndex, questionIndex, 'correct_options', ansIdx)}
                          sx={{ mt: 1 }}
                        />
                      ) : (
                        <Typography key={ansIdx} variant="body2" sx={{ mt: 1 }}>{ans}</Typography>
                      )
                    ))}
                    </Box>
                    <Box>
                    {!editingMode && (
                      <IconButton aria-label="delete" onClick={() => handleDelete(quizIndex)} sx={{ mt: 2 }}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                    </Box>
                    </Box>
                </CardContent>
              </Card>
            ))
          ))}
        </Box>
      </Grid>
    </Grid>
    <AddQuestionDialog
      open={openAddDialog}
      handleClose={() => setOpenAddDialog(false)}
      sessionId={sessionId}
      purpose={purpose}
      title={title}
      addQuestion={handleAddQuestion}
    />
  </Box>
);
};
export default ViewQuiz;
