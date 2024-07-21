import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { lightGreen, red } from '@mui/material/colors';

const ReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reviewData, score, totalQuestions, timeTaken, purpose, title, email, name } = location.state || {};

  console.log("Review data",reviewData);
  if (!reviewData) {
    return <div>No review data available.</div>;
  }

  const handleBack = () => {
    navigate("/game-landing", { state: { email, name } });
  };

  let feedbackMessage = '';
  if (score === totalQuestions) {
    feedbackMessage = `🎉 Excellent job, ${name}! You got all the questions correct! Keep up the great work!`;
  } else if (score >= totalQuestions / 2) {
    feedbackMessage = `👍 Well done, ${name}! You're doing great! Keep practicing to improve even more!`;
  } else {
    feedbackMessage = `💪 Keep going, ${name}! Practice makes perfect! You'll get there with more effort!`;
  }

  const getOptionColor = (isCorrect, isSelected) => {
    if (isCorrect && isSelected) {
      return "#00e676"; // Correct and selected
    } else if (isSelected) {
      return 'red'; // Incorrect and selected
    } else if (isCorrect) {
      return 'blue'; // Correct but not selected
    } else {
      return 'inherit'; // Default color
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Button onClick={handleBack}><ArrowBackIcon /></Button>
              <Typography variant="h4">{title}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h5' align="center">{feedbackMessage}</Typography>
            <Typography variant="h6" align="center">Score: {score} / {totalQuestions}</Typography>
            <Typography variant="h6" align="center">Time Taken: {Math.floor(timeTaken / 60)}:{String(timeTaken % 60).padStart(2, '0')}</Typography>
            {/* <Typography variant="h6" align="right">Wrong Selected in Red, Correct Selected in Green, and Correct Non-Selected Answer in Blue</Typography> */}
            <Box display={'flex'} justifyContent={'space-around'} textAlign={'right'}>
            <Typography variant="h6" align="right" color={'red'}><b>Wrong Selected</b></Typography>
            <Typography variant="h6" align="right" color={"#00e676"}><b>Correct Selected</b></Typography>
            <Typography variant="h6" align="right" color={'blue'}><b>Correct Non-Selected Answer</b></Typography>
            </Box>
          </Grid>
          
          {reviewData.map((quiz, quizIndex) => (
            quiz.map((question, questionIndex) => (
              <Grid item xs={12} key={questionIndex}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">Q{quizIndex + 1}: {question.question}</Typography>
                    {question.options.map((option, optionIndex) => {
                       const optionLetter = String.fromCharCode(65 + optionIndex); // Convert index to letter
                       const isCorrect = question.correctOptions.includes(optionLetter); // Check against correct option letters
                       const isSelected = question.selectedOptions.includes(optionLetter); // Check against selected option letters
                       const color = getOptionColor(isCorrect, isSelected);
                       return (
                        <Typography key={optionIndex} variant="body1" sx={{ color, cursor: 'pointer' }}>
                          {String.fromCharCode(65 + optionIndex)}. {option}
                        </Typography>
                      );
                    })}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ReviewPage;
