import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate,useLocation, useParams } from 'react-router-dom';
import { Box, CssBaseline, Grid, Card, CardContent, Typography, Button , TextField, InputAdornment} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import StudentSidebar from '../StudentSidebar';
// import CreateQuizDialog from './CreateQuizDialog'; // Import the new dialog component
import RolloverTooltip from '../../RolloverTooltip';
import { studentQuizSearchContent } from '../../content';
import { url_backend } from '../../../constant';

const QuizList = ({ onSelectQuiz, onCreateQuiz }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const {name,emailId} = location.state || {};
  console.log("email",location.state);

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
    quiz.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlay = (quiz) => {
    navigate('/instruction', { state: { questions: quiz.questions, purpose: quiz.purpose,title:quiz.title, date: quiz.date, email:emailId,name:name } });
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Grid container>
        <Grid item xs={2}>
          <StudentSidebar />
        </Grid>
        <Grid item xs={10}>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }} >
            <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Assess Yourself {name}!</Typography>
      </Box>
      {/* <RolloverTooltip content={studentQuizSearchContent.searchField} arrow> */}
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
      {/* <RolloverTooltip content={studentQuizSearchContent.quizCard} arrow> */}
      <Grid container spacing={3}>
      
        {filteredQuizzes.map(quiz => (
          <Grid item xs={12} sm={6} md={4} key={quiz.sessionId}>
            {/* <RolloverTooltip content={studentQuizSearchContent.quizCard} arrow> */}
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">{quiz.title}</Typography>
                <Typography color="text.secondary">{quiz.date}</Typography>
                <Typography variant="body2">{quiz.questions.length} Questions • {quiz.purpose}</Typography>
                {/* <RolloverTooltip content={studentQuizSearchContent.playTestButton} arrow> */}
                <Button
                  variant="outlined"
                  color="primary"
                  // onClick={() => onSelectQuiz(quiz.sessionId)}
                  onClick={() => handlePlay(quiz)}
                  sx={{ marginTop: 2 }}
                >
                  Attempt Test
                </Button>
                {/* </RolloverTooltip> */}
              </CardContent>
            </Card>
            {/* </RolloverTooltip> */}
          </Grid>
        ))}
        
      </Grid>
      {/* </RolloverTooltip> */}
    </Box>
    </Box>
    </Grid>
    </Grid>
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

const GameLanding = () => {
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

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            {!selectedQuiz && !creatingQuiz && (
              <QuizList onSelectQuiz={handleSelectQuiz} />
            )}
            {/* {selectedQuiz && !creatingQuiz && (
              <QuizDetail sessionId={selectedQuiz} />
            )} */}
          </Box>
      </Grid>
    </Box>
  );
};

export default GameLanding;