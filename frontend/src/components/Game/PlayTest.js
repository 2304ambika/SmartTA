// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { Box, Grid, Card, CardContent, Typography, Button, Checkbox, Radio, FormControlLabel, TextField } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// const PlayTest = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { questions, purpose, date } = location.state || {};
//   const [generatedQuestions, setGeneratedQuestions] = useState(questions);
//   const [sessionId, setSessionId] = useState(questions[0].sessionId);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [isReview, setIsReview] = useState(false);
//   const [score, setScore] = useState(null);
//   const [email, setEmail] = useState('');

//   useEffect(() => {
//     const totalQuestions = generatedQuestions.reduce((sum, quiz) => sum + quiz.questions.length, 0);
//     setTimeLeft(totalQuestions * 60 + 60); // 1 minute per question + 1 additional minute

//     const timer = setInterval(() => {
//       setTimeLeft(prevTime => {
//         if (prevTime <= 1) {
//           clearInterval(timer);
//           handleSubmit();
//         }
//         return prevTime - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [generatedQuestions]);

//   const handleOptionChange = (quizIndex, questionIndex, optionIndex) => {
//     setSelectedAnswers(prev => {
//       const updated = { ...prev };
//       if (!updated[quizIndex]) updated[quizIndex] = {};
//       if (!updated[quizIndex][questionIndex]) updated[quizIndex][questionIndex] = [];
//       if (generatedQuestions[quizIndex].questions[questionIndex].correct_options.length>1) {
//         if (updated[quizIndex][questionIndex].includes(optionIndex)) {
//           updated[quizIndex][questionIndex] = updated[quizIndex][questionIndex].filter(opt => opt !== optionIndex);
//         } else {
//           updated[quizIndex][questionIndex].push(optionIndex);
//         }
//       } else {
//         updated[quizIndex][questionIndex] = [optionIndex];
//       }
//       console.log("Updated",updated);
//       return updated;
//     });
//   };

//   const handleSubmit = () => {
//     setIsReview(true);
//     let correctAnswers = 0;
//     generatedQuestions.forEach((quiz, quizIndex) => {
//       quiz.questions.forEach((question, questionIndex) => {
//         const selectedIndices = selectedAnswers[quizIndex]?.[questionIndex] || [];
//         const selectedOptions = selectedIndices.map(index => question.options[index]);
//         console.log("selected ans",selectedOptions);
//         const correct = question.correct_options.sort().toString() === selectedOptions.sort().toString();
//         console.log("correct ans",question.correct_options.sort().toString());
//         if (correct) correctAnswers++;
//       });
//     });
//     setScore(correctAnswers);
//     // Save the score to the database
//     axios.post('http://localhost:5000/api/scores', {
//       sessionId,
//       email,
//       score: correctAnswers,
//       totalQuestions: generatedQuestions.reduce((sum, quiz) => sum + quiz.questions.length, 0),
//       timeTaken: totalQuestions * 60 + 60 - timeLeft,
//     });
//   };

//   if (!questions) {
//     return <div>No quiz selected.</div>;
//   }

//   const totalQuestions = generatedQuestions.reduce((sum, quiz) => sum + quiz.questions.length, 0);

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <Grid container>
//         <Box display="flex" sx={{ flexGrow: 1, p: 3 }} alignItems="center" justifyContent="space-between">
//           <Box display="flex" alignItems="center">
//             <Button onClick={() => navigate(-1)}><ArrowBackIcon/></Button>
//             <Typography variant="h4">{purpose}</Typography>
//           </Box>
//           {/* <TextField
//             label="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             sx={{ ml: 2 }}
//           /> */}
//           <Typography variant="h6">Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</Typography>
//         </Box>
//         <Box sx={{ flexGrow: 1, p: 3 }}>
//           {isReview ? (
//             <Box>
//               <Typography variant="h4">Review</Typography>
//               <Typography variant="h6">Score: {score} / {totalQuestions}</Typography>
//               <Typography variant="h6">Time Taken: {Math.floor((totalQuestions * 60 + 60 - timeLeft) / 60)}:{String((totalQuestions * 60 + 60 - timeLeft) % 60).padStart(2, '0')}</Typography>
//               {generatedQuestions.map((quiz, quizIndex) => (
//                 quiz.questions.map((question, questionIndex) => (
//                   <Card key={questionIndex} variant="outlined" sx={{ mb: 2 }}>
//                     <CardContent>
//                       <Typography variant="h6">Q{questionIndex + 1}: {question.question}</Typography>
//                       {question.options.map((option, optionIndex) => (
//                         <Typography key={optionIndex} variant="body1" sx={{
//                           color: question.correct_options.includes(optionIndex) ? 'green' :
//                             (selectedAnswers[quizIndex]?.[questionIndex]?.includes(optionIndex) ? 'red' : 'inherit'),
//                           backgroundColor: question.correct_options.includes(optionIndex) && !selectedAnswers[quizIndex]?.[questionIndex]?.includes(optionIndex) ? 'grey' : 'inherit'
//                         }}>
//                           {String.fromCharCode(65 + optionIndex)}. {option}
//                         </Typography>
//                       ))}
//                     </CardContent>
//                   </Card>
//                 ))
//               ))}
//             </Box>
//           ) : (
//             generatedQuestions.map((quiz, quizIndex) => (
//               quiz.questions.map((question, questionIndex) => (
//                 <Card key={questionIndex} variant="outlined" sx={{ mb: 2 }}>
//                   <CardContent>
//                     <Typography variant="h6">Q{questionIndex + 1}: {question.question}</Typography>
//                     {question.options.map((option, optionIndex) => (
//                       <FormControlLabel
//                         key={optionIndex}
//                         control={
//                           question.correct_options.length > 1 ? (
//                             <Checkbox
//                               checked={selectedAnswers[quizIndex]?.[questionIndex]?.includes(optionIndex) || false}
//                               onChange={() => handleOptionChange(quizIndex, questionIndex, optionIndex)}
//                             />
//                           ) : (
//                             <Radio
//                               checked={selectedAnswers[quizIndex]?.[questionIndex]?.[0] === optionIndex}
//                               onChange={() => handleOptionChange(quizIndex, questionIndex, optionIndex)}
//                             />
//                           )
//                         }
//                         label={`${String.fromCharCode(65 + optionIndex)}. ${option}`}
//                       />
//                     ))}
//                   </CardContent>
//                 </Card>
//               ))
//             ))
//           )}
//         </Box>
//         {!isReview && (
//           <Box display="flex" justifyContent="center" sx={{ flexGrow: 1, p: 3 }}>
//             <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
//           </Box>
//         )}
//       </Grid>
//     </Box>
//   );
// };

// export default PlayTest;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Grid, Card, CardContent, Typography, Button, Checkbox, Radio, FormControlLabel, Avatar, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const PlayTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, purpose,title, date, email, name } = location.state || {};
  const [generatedQuestions, setGeneratedQuestions] = useState(questions || []);
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const storedAnswers = localStorage.getItem('selectedAnswers');
    return storedAnswers ? JSON.parse(storedAnswers) : {};
  });
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

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

  const handleOptionChange = async(quizIndex, questionIndex, optionIndex) => {
    // setSelectedAnswers(prev => {
    //   const updated = { ...prev };
    //   if (!updated[quizIndex]) updated[quizIndex] = {};
    //   if (!updated[quizIndex][questionIndex]) updated[quizIndex][questionIndex] = [];
    //   if (generatedQuestions[quizIndex].questions[questionIndex].correct_options.length > 1) {
    //     if (updated[quizIndex][questionIndex].includes(optionIndex)) {
    //       updated[quizIndex][questionIndex] = updated[quizIndex][questionIndex].filter(opt => opt !== optionIndex);
    //     } else {
    //       updated[quizIndex][questionIndex].push(optionIndex);
    //     }
    //   } else {
    //     updated[quizIndex][questionIndex] = [optionIndex];
    //   }
    //   console.log('Sel',selectedAnswers);
    //   return updated;
    // });
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
    console.log('Sel',selectedAnswers);
  };

  const handleTimerFinish = () => {
    console.log('selected',selectedAnswers);
    handleSubmit();
  };

  const indexToLetter = (index) => String.fromCharCode(65 + index); // 65 is the ASCII code for 'A'

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    const totalQuestions = generatedQuestions.reduce((sum, quiz) => sum + quiz.questions.length, 0);
    const timeTaken = totalQuestions * 60 + 60 - timeLeft;
    let correctAnswers = 0;
    const reviewData = generatedQuestions.map((quiz, quizIndex) => {
      return quiz.questions.map((question, questionIndex) => {
        const selectedIndices = selectedAnswers[quizIndex]?.[questionIndex] || [];
        const selectedOptions = selectedIndices.map(index => indexToLetter(index));
        const correctOptions = question.correct_options;
        const correct = selectedOptions.sort().toString() === correctOptions.sort().toString();
        if (correct) correctAnswers++;
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
      await axios.post('http://localhost:5000/api/scores', {
        sessionId: generatedQuestions[0].sessionId,
        email,
        score,
        totalQuestions,
        timeTaken
      });

      navigate('/review', { state: { reviewData, score, totalQuestions, timeTaken, purpose,title, email, name } });
    } catch (error) {
      console.error('Error saving score:', error);
    }finally{
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
    navigate(-1, { state: { questions, purpose,title, date, email, name } });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
      <Container>
        <Box display="flex" sx={{ flexGrow: 1, mb: 3 }} alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            {/* <Button onClick={handleBack}><ArrowBackIcon /></Button> */}
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
          <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PlayTest;
