import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Grid, Card, CardContent, Typography, Button, Checkbox, Radio, FormControlLabel, Avatar, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { url_backend } from '../../../constant';

const PlayTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, purpose, title, date, email, name } = location.state || {};
  const [generatedQuestions, setGeneratedQuestions] = useState(questions || []);
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const storedAnswers = localStorage.getItem('selectedAnswers');
    return storedAnswers ? JSON.parse(storedAnswers) : {};
  });
  const selectedAnswersRef = useRef(selectedAnswers);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  useEffect(() => {
    const totalQuestions = generatedQuestions.reduce((sum, quiz) => sum + quiz.questions.length, 0);
    setTimeLeft(totalQuestions * 60 + 60); // 1 minute per question + 1 additional minute

    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          handleTimerFinish();
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [generatedQuestions]);

  useEffect(() => {
    localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers));
  }, [selectedAnswers]);

  const handleOptionChange = (quizIndex, questionIndex, optionIndex) => {
    const updated = { ...selectedAnswers };

    if (!updated[quizIndex]) updated[quizIndex] = {};
    if (!updated[quizIndex][questionIndex]) updated[quizIndex][questionIndex] = [];

    if (generatedQuestions[quizIndex].questions[questionIndex].correct_options.length > 1) {
      const index = updated[quizIndex][questionIndex].indexOf(optionIndex);
      if (index === -1) {
        updated[quizIndex][questionIndex].push(optionIndex);
      } else {
        updated[quizIndex][questionIndex].splice(index, 1);
      }
    } else {
      updated[quizIndex][questionIndex] = [optionIndex];
    }

    setSelectedAnswers(updated);
    console.log('Sel', updated);
  };

  const handleTimerFinish = () => {
    console.log('Timer finished, selected answers:', selectedAnswersRef.current);
    handleSubmit(selectedAnswersRef.current);
  };

  const indexToLetter = (index) => String.fromCharCode(65 + index); // 65 is the ASCII code for 'A'

  const handleSubmit = async (answers = selectedAnswersRef.current) => {
    clearInterval(timerRef.current);
    const totalQuestions = generatedQuestions.reduce((sum, quiz) => sum + quiz.questions.length, 0);
    const timeTaken = totalQuestions * 60 + 60 - timeLeft;
    let correctAnswers = 0;
    const reviewData = generatedQuestions.map((quiz, quizIndex) => {
      return quiz.questions.map((question, questionIndex) => {
        const selectedIndices = answers[quizIndex]?.[questionIndex] || [];
        const selectedOptions = selectedIndices.map(index => indexToLetter(index));
        const correctOptions = question.correct_options;
        const correct = selectedOptions.sort().toString() === correctOptions.sort().toString();
        if (correct) correctAnswers++;
        console.log('SelectedAns',selectedAnswers);
        console.log('Selected',selectedIndices);
        console.log('Correct',correctOptions);
        return {
          question: question.question,
          options: question.options,
          selectedOptions,
          correctOptions,
          isCorrect: correct
        };
      });
    });

    const score = correctAnswers;

    try {
      await axios.post(url_backend + '/api/scores', {
        sessionId: generatedQuestions[0].sessionId,
        email,
        score,
        totalQuestions,
        timeTaken
      });

      navigate('/review', { state: { reviewData, score, totalQuestions, timeTaken, purpose, title, email, name } });
    } catch (error) {
      console.error('Error saving score:', error);
    } finally {
      // Clear selectedAnswers state after successful submission
      setSelectedAnswers({});

      // Clear localStorage for selectedAnswers
      localStorage.removeItem('selectedAnswers');
    }
  };

  if (!questions) {
    return <div>No quiz selected.</div>;
  }

  const handleBack = () => {
    navigate(-1, { state: { questions, purpose, title, date, email, name } });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
      <Container>
        <Box display="flex" sx={{ flexGrow: 1, mb: 3 }} alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Typography variant="h4" sx={{ ml: 2 }}>{title}</Typography>
          </Box>
          <Box display="flex">
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, fontSize: 24 }}>{name ? name.charAt(0).toUpperCase() : 'U'}</Avatar>
            <Typography variant="h6" sx={{ ml: 2 }}>Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</Typography>
          </Box>
        </Box>
        
        <Box sx={{ flexGrow: 1 }}>
          {generatedQuestions.map((quiz, quizIndex) => (
            quiz.questions.map((question, questionIndex) => (
              <Card key={questionIndex} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">Q{quizIndex + 1}: {question.question}</Typography>
                  <Box sx={{ mt: 2 }}>
                    {question.options.map((option, optionIndex) => (
                      <Box key={optionIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <FormControlLabel
                          control={
                            question.correct_options.length > 1 ? (
                              <Checkbox
                                checked={selectedAnswers[quizIndex]?.[questionIndex]?.includes(optionIndex) || false}
                                onChange={() => handleOptionChange(quizIndex, questionIndex, optionIndex)}
                              />
                            ) : (
                              <Radio
                                checked={selectedAnswers[quizIndex]?.[questionIndex]?.[0] === optionIndex}
                                onChange={() => handleOptionChange(quizIndex, questionIndex, optionIndex)}
                              />
                            )
                          }
                          label={`${String.fromCharCode(65 + optionIndex)}. ${option}`}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))
          ))}
        </Box>
        <Box display="flex" justifyContent="center" sx={{ flexGrow: 1 }}>
          <Button variant="contained" color="primary" onClick={() => handleSubmit(selectedAnswers)}>Submit</Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PlayTest;
