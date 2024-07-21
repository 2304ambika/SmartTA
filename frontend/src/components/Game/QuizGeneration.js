import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import OpenAI from "openai";
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
// import {Link} from 'react-router-dom';
// import Joyride, { STATUS } from 'react-joyride';
import mascotImage from '../../assets/img/mascot.png';
import "../../styles/components/generateQues.css";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const questionTypeOptions = [
  { value: 'multiple-choice-1', label: 'Multiple Choice (1 Correct)' },
  { value: 'multiple-choice-2', label: 'Multiple Choice (2 Correct)' },
  { value: 'multiple-choice-3', label: 'Multiple Choice (3 Correct)' },
];

const purposeOptions = [
  { value: 'quiz', label: 'Quiz' },
  { value: 'self-assessment', label: 'Self Assessment' },
];

// Instruction steps
const steps = [
  {
    instruct: 'Upload a file or paste text into the text area.',
    targetClass: 'upload-file-button',
  },
  {
    instruct: 'Specify the number of questions you want to generate.',
    targetClass: 'num-questions-field',
  },
  {
    instruct: 'Choose the types of questions.',
    targetClass: 'question-types-select',
  },
  {
    instruct: 'Select the purpose of the question generation.',
    targetClass: 'purpose-select',
  },
  {
    instruct: 'Optionally, provide an additional prompt for question generation.',
    targetClass: 'prompt-textarea',
  },
  {
    instruct: 'Click here to generate questions.',
    targetClass: 'generate-questions-button',
  },
  {
    instruct: 'Use these buttons to add, save, play, accept, delete, replace, or edit questions.',
    targetClass: 'question-actions',
  },
];

const QuizGenerator = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [numQuestions, setNumQuestions] = useState(0);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [purpose, setPurpose] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  // const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [approvedQuestions, setApprovedQuestions] = useState([]);
  const [replacingIndex, setReplacingIndex] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // const [jsonUrl, setJsonUrl] = useState(null);
  const [pptUrl, setPptUrl] = useState(null);
  const [snackbarmessage,setSnackbarMessage] =useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [showMascot, setShowMascot] = useState(true);
  const [sessionId, setSessionId] = useState('');


  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const fileType = file.type;

    if (fileType === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let text = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          text += pageText + '\n';
        }
        setText(text);
      };
      reader.readAsArrayBuffer(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'application/msword') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const { value } = await mammoth.extractRawText({ arrayBuffer: e.target.result });
        setText(value);
      };
      reader.readAsArrayBuffer(file);
    }else {
      alert('Unsupported file type. Please upload a PDF or DOCX file.');
    }
  };

  const chunkText = (text, chunkSize = 2000) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const formatQues = (text) => {
    text = text.replace("```json", "").replace("```", "");
    const data = JSON.parse(text);
    return data;
  };

  const selectRandom = (allQuestions) => {
    const finalList = [];
    while (finalList.length < numQuestions) {
      const randomIndex = Math.floor(Math.random() * allQuestions.length);
      const randomElement = allQuestions[randomIndex];
      if (!finalList.includes(randomElement)) {
        finalList.push(randomElement);
      }
    }
    return finalList;
  };

  const response_json= [
    {
        "question": "multiple choice question",
        "options":["choice here", "choice here", "choice here", "choice here"],
        "correct_options": "correct option number(s)",
    },
]
  const handleGenerateQuestions = async () => {
    setLoading(true);
    try {
      const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const chunks = chunkText(text);
      let allQuestions = [];

      for (const chunk of chunks) {
        const response1 = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: `You are an expert MCQ maker who generates all questions with answers of specific question type(s).Output is given in JSON format with keys named as question, options, and correct_options.` },
            { role: 'user', content: `Generate ${Math.ceil(numQuestions / chunks.length)} questions along with answers from the following text:\n${chunk}\nQuestion types: ${questionTypes.map(qt => qt.label).join(', ')}\n${prompt}` }
          ],
          max_tokens: 1500,
          temperature: 0.6,
        });
        // console.log(response1.choices[0]['message']['content']);
        const questions = formatQues(response1.choices[0]['message']['content']);
        allQuestions = allQuestions.concat(questions);
      }

      const finalQuestions = selectRandom(allQuestions);
      try {
        const response = await axios.post('http://localhost:5000/save-questions', {
          questions: finalQuestions,
          purpose
        });
        console.log("response",response);
        // const x=await response.json();
        // console.log("x",x);
        setGeneratedQuestions(response.data.questions);
        setSessionId(response.data.sessionId);
        console.log("response questions",response.data.questions);
        console.log("response type1",Array.isArray(response.data));
        console.log("response type1",Array.isArray(response.data.questions));
        // if (response && response.data) {
          // Update generatedQuestions state with response data
          // generatedQuestions=response.data.questions;
          // console.log("response type",typeof(response.data.questions));
          // let x = response.data
          // setGeneratedQuestions(response);
          // console.log(x)

          // setSessionId(x.sessionId); (generatedQuestions)=>
          // console.log(x)
        // }

        console.log("gen inside res questions",generatedQuestions);
        // console.log("sessionId",sessionId);
        
        // setSnackbarMessage('Questions saved successfully');
      } catch (error) {
        console.error('Error saving questions:', error);
        // setSnackbarMessage('Error saving questions');
      } 
      // setGeneratedQuestions(finalQuestions);

    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate questions. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }

    // setLoading(true);
    
  };
  console.log("GeneratedQuestion",generatedQuestions);

  // const handleEdit = async (index, updatedQuestion)=> {
  //   // const newQuestions = [...generatedQuestions];
  //   // newQuestions[index][field] = value;
  //   // setGeneratedQuestions(newQuestions);
  //   try {
  //   const questionId = generatedQuestions[index]._id;

  //   // Update the question in the database
  //   await axios.put(`http://localhost:5000/edit-question/${questionId}`, updatedQuestion);

  //   // Update the question in the state
  //   const newQuestions = generatedQuestions.map((q, i) =>
  //     i === index ? { ...q, ...updatedQuestion } : q
  //   );

  //   setGeneratedQuestions(newQuestions);
  //   setSnackbarMessage('Question edited successfully');
  // } catch (error) {
  //   console.error('Error editing question:', error);
  //   setSnackbarMessage('Error editing question');
  // } finally {
  //   setOpenSnackbar(true);
  // }
  // };

  const handleEdit = async (quizIndex, field, value) => {
    try {
      const updatedQuestion = {
        ...generatedQuestions[quizIndex],
        [field]: value
      };

      const questionId = generatedQuestions[quizIndex]._id;

      // Update the question in the database
      await axios.put(`http://localhost:5000/edit-question/${questionId}`, updatedQuestion);

      // Update the question in the state
      const newQuestions = [...generatedQuestions];
      newQuestions[quizIndex] = updatedQuestion;
      setGeneratedQuestions(newQuestions);
    } catch (error) {
      console.error('Error editing question:', error);
      setSnackbarMessage('Error editing question');
    } finally {
      // setOpenSnackbar(true);
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleDownloadQuestions = async () => {
    if (!sessionId) {
      setSnackbarMessage('No session ID available. Save questions first.');
      setOpenSnackbar(true);
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:5000/download-questions/${sessionId}`, {
        responseType: 'arraybuffer'
      });
      console.log("Download response",response);
      // Create blob from response data
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      const url = URL.createObjectURL(blob);
  
      // Set pptUrl state to enable showing the download link
      setPptUrl(url);
  
      setSnackbarMessage('Questions downloaded successfully');
    } catch (error) {
      console.error('Error downloading questions:', error);
      setSnackbarMessage('Error downloading questions');
    } finally {
      // setOpenSnackbar(true);
    }
  };
  

  const handleAccept = async (index) => {
    console.log("Index:", index);
    console.log("Generated Questions:", generatedQuestions[index]);
    console.log("Accept id",generatedQuestions[index]._id);
    try {
      await axios.put(`http://localhost:5000/accept-question/${generatedQuestions[index]._id}`);
      setGeneratedQuestions(generatedQuestions.map((q, i) => i === index ? { ...q, status: 'accepted' } : q));
      setSnackbarMessage('Question accepted');
    } catch (error) {
      console.error('Error accepting question:', error);
      setSnackbarMessage('Error accepting question');
    } finally {
      setOpenSnackbar(true);
    }
    // setApprovedQuestions(generatedQuestions);
    // setOpenSnackbar(true);
  };

  const handleReplace = async (index) => {
    setReplacingIndex(index);

    try {
      const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const chunk = text.slice(0, 2000); // Use the first chunk of the text for generating a new question

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: "You are an expert MCQ maker who generates questions with answers and gives output in JSON format with keys named question, options, and correct_options." },
          { role: 'user', content: `Generate 1 question of type ${questionTypes.map(qt => qt.label).join(', ')} along with answers from the following text:\n${chunk}\n${prompt}` }
        ],
        max_tokens: 1500,
        temperature: 0.6,
      });

      const questions = formatQues(response.choices[0]['message']['content']);
      
      if (Object.keys(questions).length > 0) {
        const questionId = generatedQuestions[index]._id;
        
        // Send the updated question to the backend to replace the old one in the database
        try {
          const updateResponse = await axios.put(`http://localhost:5000/replace-question/${questionId}`, questions);
          console.log(updateResponse);
          const updatedQuestion = updateResponse.data.questions;
          console.log("Ques Replace",updatedQuestion);
          // Update the question in the state
          const newQuestions = [...generatedQuestions];
          console.log("newQuestions[index] ",newQuestions[index].questions[0]);
          console.log("index",index);
          newQuestions[index] = {
            ...newQuestions[index],
            questions: Array.isArray(updatedQuestion) ? updatedQuestion :[updatedQuestion]
          };
          console.log("NewQues",newQuestions);
          setGeneratedQuestions(newQuestions);
          // Update the question in the state
          // const newQuestions = [...generatedQuestions];
          // newQuestions[index] = updatedQuestion;
          
          // setGeneratedQuestions(newQuestions);
  
          setSnackbarMessage('Question replaced successfully');
        } catch (updateError) {
          console.error('Error replacing question in database:', updateError);
          setSnackbarMessage('Error replacing question in database');
        } finally {
          setOpenSnackbar(true);
        }
      } else {
        alert('Failed to generate a new question. Please try again.');
      }
    } catch (error) {
      console.error('Error generating new question:', error);
      alert('Failed to generate a new question. Please try again.');
    } finally {
      setReplacingIndex(null);
    }
      // if (Object.keys(questions).length > 0) {
      //   const newQuestions = [...generatedQuestions];
      //   newQuestions[index] = questions;
      //   setGeneratedQuestions(newQuestions);
      // } 

    // } 

  };

  const handleDelete = async (index) => {
    try {
      await axios.put(`http://localhost:5000/reject-question/${generatedQuestions[index]._id}`);
      const newQuestions = [...generatedQuestions];
      newQuestions.splice(index, 1);
      console.log("newQuestions",newQuestions);
      setGeneratedQuestions(newQuestions);
      // setGeneratedQuestions(generatedQuestions.map((q, i) => i === index ? { ...q, status: 'rejected' } : q));
      setSnackbarMessage('Question rejected');
    } catch (error) {
      console.error('Error rejecting question:', error);
      setSnackbarMessage('Error rejecting question');
    } finally {
      setOpenSnackbar(true);
    }
    // setDeletingIndex(index);
    // const newQuestions = [...generatedQuestions];
    // newQuestions.splice(index, 1);
    // setGeneratedQuestions(newQuestions);
    // setDeletingIndex(null);
  };

  const handleAddQuestion = async () => {
    const newQuestion = {
      question: '',
      options: ['', '', '', ''],
      correct_options: [''],
      status: 'none',
    };

    try {
      // Make an API call to save the new question to the backend
      const response = await axios.post('http://localhost:5000/add-question', newQuestion);
      console.log("Add response",response);
      // Update the state with the saved question, including the ID from the database
      const savedQuestion = response.data;
      // setGeneratedQuestions((prevQuestions) => [...prevQuestions, savedQuestion]);
      setGeneratedQuestions([...generatedQuestions, savedQuestion]);
      setIsEditing(true);

      setSnackbarMessage('Question added successfully');
    } catch (error) {
      console.error('Error adding question:', error);
      setSnackbarMessage('Error adding question');
    } finally {
      // setOpenSnackbar(true);
    }
  };


  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handlePlay = () => {
    navigate('/play/game', { state: { questions: generatedQuestions } });
  };

  // console.log(purposeOptions.map((option) =>`${console.log(option)}`));

  const { instruct, targetClass } = steps[currentStep];

  const handleNextStep = () => {
    // if(currentStep === steps.length-1) currentStep=currentStep+1;
    if (currentStep < steps.length-1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowMascot(false); // Hide the mascot after the last instruction
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const highlightClass = (className) => {
    if(className==="" || currentStep === steps.length-1) return '';
    return currentStep === steps.findIndex(step => step.targetClass === className) ? 'highlight' : 'blur-background';
  };

  // console.log("generated ques",generatedQuestions.map((quiz, quizIndex)=>`${console.log(quizIndex," : ",quiz)}`));

  return (
    <Container maxWidth="lg" sx={{ marginTop: 6 }}>
      <IconButton
        onClick={() => navigate('/dashboard')}
        aria-label="back to dashboard"
        sx={{ position: 'absolute', top: 16, left: 16 }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4, position: 'relative', zIndex: 1 }}
   className={highlightClass('')}>
        <Typography variant="h4" gutterBottom>Quiz Generator</Typography>
        <Box mb={3}>
          <Button className={`${highlightClass('upload-file-button')} upload-file-button`} variant="contained" component="label">
            Upload File
            <input type="file" accept=".txt,.pdf,.doc,.docx" hidden onChange={handleFileUpload} />
          </Button>
        </Box>
        <Box mb={3}>
          <TextField
            label="Upload Text"
            multiline
            rows={2}
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={highlightClass('upload-file-button')}
          />
        </Box>
        <Box mb={3}>
          <TextField
            label="Number of Questions"
            className={`num-questions-field ${highlightClass('num-questions-field')}`}
            type="number"
            InputProps={{ inputProps: { min: 1, max: 10 } }}
            fullWidth
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
          />
        </Box>
        <Box mb={3} className={highlightClass('question-types-select')}>
          <FormControl fullWidth>
            <Typography variant="h7" >Question Types:</Typography>
            <Select
              isMulti
              value={questionTypes}
              options={questionTypeOptions}
              onChange={setQuestionTypes}
            />
          </FormControl>
        </Box>
        <Box mb={3} className={`purpose-select ${highlightClass('purpose-select')}`}>
          <FormControl fullWidth>
            <InputLabel>Purpose</InputLabel>
            <MuiSelect
              value={purpose}
              onChange={(e) => setPurpose(e.target.value) } 
            >
              
              {purposeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        </Box>
        <Box mb={3}>
          <TextField
            label="Additional Prompt"
            className={`prompt-textarea ${highlightClass('prompt-textarea')}`}
            multiline
            rows={1}
            fullWidth
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </Box>
        <Button className={`generate-questions-button ${highlightClass('generate-questions-button')}`} variant="contained" color="primary" onClick={handleGenerateQuestions}>
          Generate Questions
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddQuestion}
          sx={{ marginLeft: 2 }}
          className={highlightClass('question-actions')}
        >
          Add Question
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<PlayArrowIcon />}
          sx={{ marginLeft: 2 }}
          onClick={handlePlay}
          className={highlightClass('question-actions')}
        >
          Play
        </Button>
        <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleDownloadQuestions}
            sx={{ marginLeft: 2 }}
            className={highlightClass('question-actions')}
          >
            Download
          </Button>
          {pptUrl && (
            <Box mt={2}>
              <Typography variant="body1">
                Download PPT: <a href={pptUrl} download>Download</a>
              </Typography>
            </Box>
          )}
        <Box mt={5}>
          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
              <CircularProgress />
            </Box>
          )}
          {!loading && generatedQuestions.length > 0 && (
            <Box mt={4}>
              <Typography variant="h5" gutterBottom>
                Generated Questions
              </Typography>
              {generatedQuestions.map((quiz, quizIndex) => (
                quiz.questions.map((question,questionIndex)=>(
                <Paper key={questionIndex} sx={{ padding: 2, marginTop: 2 }}>
                  {replacingIndex === quizIndex ? (
                    <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                    <h4>{`Question ${quizIndex + 1}`}</h4>
                      <TextField
                        // label={`Question ${index + 1}`}
                        fullWidth
                        multiline
                        // rows={3}
                        value={question.question}
                        InputProps={{ readOnly: !isEditing }}
                        onChange={(e) => handleEdit(quizIndex, 'question', e.target.value)}
                        sx={{ fontWeight: 'bold', fontSize: 18, marginBottom: 2 }}
                      />
                      <h4>Options</h4>
                      {question.options.map((option, optIndex) => (
                        <TextField
                          key={optIndex}
                          // label={`Option ${optIndex + 1}`}
                          fullWidth
                          multiline
                          value={`${optIndex + 1}.  ${option}`}
                          InputProps={{ readOnly: !isEditing }}
                          onChange={(e) => {
                            const newOptions = [...question.options];
                            newOptions[optIndex] = e.target.value;
                            handleEdit(quizIndex, 'options', newOptions);
                          }}
                          sx={{ backgroundColor: '#f5f5f5', marginBottom: 1 }}
                        />
                      ))}
                      <h4>Answer</h4>
                      <TextField
                        // label="Answer"
                        fullWidth
                        multiline
                        value={question.correct_options.map(option => option.replace(/,/g, '')).join('\n')}
                        // value={question.correctOptionIndex !== null ? question.options[question.correctOptionIndex] : ''}
                        // InputProps={{ readOnly: true }}
                        sx={{ backgroundColor: '#d7ffd9' }}
                        InputProps={{ readOnly: !isEditing }}
                        onChange={(e) => handleEdit(quizIndex, 'correct_options', e.target.value)}
                      />
                      <Box mt={2} display="flex" justifyContent="space-between" className="question-actions">
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<CheckIcon />}
                          onClick={() => handleAccept(quizIndex)}
                          // onClick={handleAccept}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<FindReplaceIcon />}
                          onClick={() => handleReplace(quizIndex)}
                        >
                          Replace
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(quizIndex)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="contained"
                          color={isEditing ? "secondary" : "primary"}
                          startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                          onClick={toggleEditing}
                          sx={{ marginBottom: 2 }}
                        >
                          {isEditing ? 'Stop Editing' : 'Edit'}
                        </Button>
                      </Box>
                    </>
                  )}
                </Paper>
                ))
              ))}
            </Box>
          )}
        </Box>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="success">
            Questions approved successfully!
          </Alert>
        </Snackbar>
        </Paper>
        {showMascot && (
  <Box className="mascot-container" style={{ zIndex: 10001 }}>
    <Paper className="text" style={{ padding: '10px', width: '200px', marginTop: '10px' }}>
      <Typography variant="body1">{instruct}</Typography>
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePreviousStep}
          disabled={currentStep === 0}
          style={{ marginRight: '10px' }}
        >
          Previous
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button variant="contained" color="primary" onClick={handleNextStep}>
            Next
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleNextStep}>
            Finish
          </Button>
        )}
      </Box>
    </Paper>
    <img src={mascotImage} alt="Mascot" />
  </Box>
)}
      
    </Container>
  );
};

export default QuizGenerator;