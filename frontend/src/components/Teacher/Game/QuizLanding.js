// QuizLanding.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { Box, CssBaseline, Grid, Card, CardContent, Typography, Button , TextField, InputAdornment, IconButton} from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import AddIcon from '@mui/icons-material/Add';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import Sidebar from '../Sidebar';
import axios from 'axios';
import CreateQuizDialog from './CreateQuizDialog'; // Import the new dialog component
import RolloverTooltip from '../../RolloverTooltip';
import { quizLandingTooltips } from '../../content';
import { url_backend } from '../../../constant';

const QuizList = ({ onSelectQuiz, onCreateQuiz }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(url_backend+'/api/quizzes')
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
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
  <Typography variant="h4" sx={{ mb: 2 }}>Question Bank</Typography>
  
  <Box display="flex" alignItems="center">
    <Button
      variant="contained"
      color="primary"
      onClick={onCreateQuiz}
      startIcon={<AddIcon />}
      sx={{
        borderRadius: '50px',
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
      }}
    >
      Create Questions
    </Button>
    
    {/* Info icon aligned immediately to the right of the button */}
    <RolloverTooltip content={quizLandingTooltips.createQuiz}>
      <IconButton size="small" sx={{ ml: 1 }}>
        <InfoIcon fontSize="small" />
      </IconButton>
    </RolloverTooltip>
  </Box>
</Box>
      {/* <RolloverTooltip content={quizLandingTooltips.search}> */}
        <TextField
          label="Search Question Bank"
          placeholder='Search for question banks by title'
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
        />
      {/* </RolloverTooltip> */}
      <Box sx={{ backgroundColor: '#f0f4f8',width: '100%', padding: 2, borderRadius: '8px', mt: 2 }}>
        <Grid container spacing={2}>
          {filteredQuizzes.map(quiz => (
            <Grid item xs={12} sm={6} md={4} key={quiz.sessionId}>
              <Card sx={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <CardContent sx={{ padding: 2 }}>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>{quiz.title}</Typography>
                  <Typography color="text.secondary">{quiz.date}</Typography>
                  <Typography variant="body2">{quiz.questions.length} Questions • {quiz.purpose}</Typography>
                  {/* <RolloverTooltip content={quizLandingTooltips.viewTest}> */}
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleView(quiz)}
                      sx={{
                        marginTop: 1,
                        borderRadius: '50px',
                        padding: '5px 15px',
                        fontWeight: 'bold',
                        alignSelf: 'flex-end'
                      }}
                    >
                      View Questions
                    </Button>
                  {/* </RolloverTooltip> */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

// const QuizDetail = ({ sessionId, onBack }) => {
//   const [quiz, setQuiz] = useState(null);

//   useEffect(() => {
//     axios.get(url_backend+`/api/quizzes/${sessionId}`)
//       .then(response => setQuiz(response.data))
//       .catch(error => console.error('Error fetching quiz details:', error));
//   }, [sessionId]);

//   if (!quiz) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h4" component="div">{quiz.title}</Typography>
//         <Typography color="text.secondary">Date: {quiz.date}</Typography>
//         <Typography variant="body1">Questions Count: {quiz.questions.length}</Typography>
//         {/* Render other quiz details here */}
//         <Button variant="contained" color="primary" onClick={onBack} sx={{ marginTop: 3 }}>
//           Back
//         </Button>
//       </CardContent>
//     </Card>
//   );
// };

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
            {/* {selectedQuiz && !creatingQuiz && (
              <QuizDetail sessionId={selectedQuiz} onBack={handleBack} />
            )} */}
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
