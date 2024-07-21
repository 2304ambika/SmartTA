// QuizLanding.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { Box, CssBaseline, Grid, Card, CardContent, Typography, Button , TextField, InputAdornment} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from '../Sidebar';
import axios from 'axios';
import CreateQuizDialog from './CreateQuizDialog'; // Import the new dialog component
import { title } from 'process';

const QuizList = ({ onSelectQuiz, onCreateQuiz }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/quizzes')
      .then(response => {
        const groupedQuizzes = groupQuizzesBySessionId(response.data);
        setQuizzes(groupedQuizzes);
      })
      .catch(error => console.error('Error fetching quizzes:', error));
  }, []);

  const groupQuizzesBySessionId = (quizzes) => {
    const grouped = quizzes.reduce((acc, quiz) => {
      if (!acc[quiz.sessionId]) {
        acc[quiz.sessionId] = {
          sessionId: quiz.sessionId,
          purpose: quiz.purpose,
          title:quiz.title,
          date: quiz.date,
          questions: [],
        };
      }
      acc[quiz.sessionId].questions.push(quiz);
      return acc;
    }, {});

    const sortedQuizzes = Object.values(grouped).sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  
    return Object.values(sortedQuizzes);
  };

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (quiz) => {
    navigate('/view', { state: { questions: quiz.questions, purpose: quiz.purpose,title:quiz.title, date: quiz.date } });
  };


  return (
    <Box >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">View Quiz & Generate using GenAI</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onCreateQuiz}
        >
          Create New Quiz
        </Button>
      </Box>
      <TextField
        label="Search Quizzes"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        padding={0}
      />
      <Box padding={1}>
      <Grid container spacing={2} >
        {filteredQuizzes.map(quiz => (
          <Grid item xs={12} sm={6} md={4} key={quiz.sessionId}>
            <Card >
              <CardContent padding={0}>
                <Typography variant="h5" component="div">{quiz.title}</Typography>
                <Typography color="text.secondary">{quiz.date}</Typography>
                <Typography variant="body2">{quiz.questions.length} Questions • {quiz.purpose}</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  // onClick={() => onSelectQuiz(quiz.sessionId)}
                  onClick={() => handleView(quiz)}
                  sx={{ marginTop: 1 }}
                >
                  View Test
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      </Box>
    </Box>
  );
};

const QuizDetail = ({ sessionId, onBack }) => {
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/quizzes/${sessionId}`)
      .then(response => setQuiz(response.data))
      .catch(error => console.error('Error fetching quiz details:', error));
  }, [sessionId]);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" component="div">{quiz.title}</Typography>
        <Typography color="text.secondary">Date: {quiz.date}</Typography>
        <Typography variant="body1">Questions Count: {quiz.questions.length}</Typography>
        {/* Render other quiz details here */}
        <Button variant="contained" color="primary" onClick={onBack} sx={{ marginTop: 3 }}>
          Back
        </Button>
      </CardContent>
    </Card>
  );
};

const QuizLanding = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // Add state for dialog visibility
  const navigate = useNavigate();

  const handleSelectQuiz = (sessionId) => {
    setSelectedQuiz(sessionId);
  };

  // const handleCreateQuiz = () => {
  //   navigate('/generate-quiz');
  // };

  const handleCreateQuiz = () => {
    setDialogOpen(true); // Open the dialog when clicking "Create New Quiz"
  };

  const handleCloseDialog = () => {
    setDialogOpen(false); // Close the dialog
  };

  const handleBack = () => {
    setSelectedQuiz(null);
    setCreatingQuiz(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Grid container>
        <Grid item xs={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={10}>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }} >
            {!selectedQuiz && !creatingQuiz && (
              <QuizList onSelectQuiz={handleSelectQuiz} onCreateQuiz={handleCreateQuiz} />
            )}
            {selectedQuiz && !creatingQuiz && (
              <QuizDetail sessionId={selectedQuiz} onBack={handleBack} />
            )}
            {/* {creatingQuiz && (
              <CreateQuiz onBack={handleBack} />
            )} */}
          </Box>
          </Grid>
      </Grid>
      <CreateQuizDialog open={dialogOpen} handleClose={handleCloseDialog} /> {/* Include the dialog */}
    </Box>
  );
};

export default QuizLanding;
