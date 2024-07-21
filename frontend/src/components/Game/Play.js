// import React, { useState, useEffect, useRef, Fragment } from 'react';
// import Helmet from 'react-helmet';
// import classnames from 'classnames';
// import { useNavigate, useLocation } from 'react-router-dom';
// import M from 'materialize-css';

// import isEmpty from '../../utils/is-empty';

// import correctNotification from '../../assets/audio/correct-answer.mp3';
// import wrongNotification from '../../assets/audio/wrong-answer.mp3';
// import buttonNotification from '../../assets/audio/button-sound.mp3';

// const Play = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const locationState = location.state || {};
//     const questions = locationState.questions || [];

//     const initialState = {
//         questions,
//         currentQuestion: {},
//         nextQuestion: {},
//         previousQuestion: {},
//         answer: '',
//         numberOfQuestions: 0,
//         numberOfAnsweredQuestions: 0,
//         currentQuestionIndex: 0,
//         score: 0,
//         correctAnswers: 0,
//         wrongAnswers: 0,
//         hints: 5,
//         fiftyFifty: 2,
//         usedFiftyFifty: false,
//         time: {},
//         selectedAnswers: []
//     };

//     const [state, setState] = useState(initialState);

//     const correctSound = useRef(null);
//     const wrongSound = useRef(null);
//     const buttonSound = useRef(null);
//     let interval = useRef();

//     useEffect(() => {
//         if (questions.length > 0) {
//             displayQuestions();
//             startTimer();
//         }
//         return () => {
//             clearInterval(interval.current);
//         };
//     }, [questions]);

//     useEffect(() => {
//         handleDisableButton();
//     }, [state.currentQuestionIndex, state.questions]);

//     const displayQuestions = () => {
//       let { currentQuestionIndex } = state;
//       if (questions.length > 0 && currentQuestionIndex < questions.length) {
//           const currentQuestion = questions[currentQuestionIndex];
//           const nextQuestion = currentQuestionIndex + 1 < questions.length ? questions[currentQuestionIndex + 1] : undefined;
//           const previousQuestion = currentQuestionIndex - 1 >= 0 ? questions[currentQuestionIndex - 1] : undefined;
//           const answer = currentQuestion.correct_options;
//           setState(prevState => ({
//               ...prevState,
//               currentQuestion,
//               nextQuestion,
//               previousQuestion,
//               numberOfQuestions: questions.length,
//               answer,
//               selectedAnswers: []
//           }));
//       }
//     };

//     const handleOptionClick = (index) => {
//         let newSelectedAnswers = [...state.selectedAnswers];
//         if (newSelectedAnswers.includes(index)) {
//             newSelectedAnswers = newSelectedAnswers.filter((answer) => answer !== index);
//         } else {
//             newSelectedAnswers.push(index);
//         }
//         setState(prevState => ({
//             ...prevState,
//             selectedAnswers: newSelectedAnswers
//         }));
        
//     };

//     const handleNextButtonClick = () => {
//         playButtonSound();
//         checkAnswer();
//         if (state.nextQuestion !== undefined) {
//             setState(prevState => ({
//                 ...prevState,
//                 currentQuestionIndex: prevState.currentQuestionIndex + 1
//             }));
//             displayQuestions();
//         }
//     };

//     const handleFinishButtonClick = () => {
//         playButtonSound();
//         checkAnswer();
//         endGame();
//     };

//     const handlePreviousButtonClick = () => {
//         playButtonSound();
//         if (state.previousQuestion !== undefined) {
//             setState(prevState => ({
//                 ...prevState,
//                 currentQuestionIndex: prevState.currentQuestionIndex - 1
//             }));
//             displayQuestions();
//         }
//     };

//     const handleQuitButtonClick = () => {
//         playButtonSound();
//         if (window.confirm('Are you sure you want to quit?')) {
//             navigate('/generate-quiz');
//         }
//     };

//     const playButtonSound = () => {
//         if (buttonSound.current) buttonSound.current.play();
//     };

//     const correctAnswer = () => {
//         M.toast({
//             html: 'Correct Answer!',
//             classes: 'toast-valid',
//             displayLength: 1500
//         });
//         setState(prevState => ({
//             ...prevState,
//             score: prevState.score + 1,
//             correctAnswers: prevState.correctAnswers + 1,
//             numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
//         }));
//     };

//     const wrongAnswer = (correctOptions) => {
//         navigator.vibrate(1000);
//         console.log(correctOptions.map(option => `${option}`).join('; '));
//         M.toast({
//             html: `Wrong Answer! The correct answer is:<br>${correctOptions.map(option => `${option}`).join('<br>')}`,
//             classes: 'toast-invalid',
//             displayLength: 3000,
//             // activationPercent: 0.5,
//         });
//         setState(prevState => ({
//             ...prevState,
//             wrongAnswers: prevState.wrongAnswers + 1,
//             numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
//         }));
//     };

//     const checkAnswer = () => {
//       const correctOptions = state.currentQuestion.correct_options; // Array of correct strings
//       const selectedOptions = state.selectedAnswers.map(index => state.currentQuestion.options[index]); // Convert indexes to strings
//       console.log(selectedOptions);
//       const isCorrect = correctOptions.length === selectedOptions.length &&
//           correctOptions.every(option => selectedOptions.includes(option));
//       if (isCorrect) {
//           setTimeout(() => {
//               if (correctSound.current) correctSound.current.play();
//           }, 200);
//           correctAnswer();
//       } else {
//           setTimeout(() => {
//               if (wrongSound.current) wrongSound.current.play();
//           }, 200);
//           wrongAnswer(correctOptions);
//       }
//   };

//     const startTimer = () => {
//         const countDownTime = Date.now() + questions.length*60000; // 30 minutes from now
//         interval.current = setInterval(() => {
//             const now = new Date().getTime();
//             const distance = countDownTime - now;
//             const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//             const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//             if (distance < 0) {
//                 clearInterval(interval.current);
//                 endGame();
//             } else {
//                 setState(prevState => ({
//                     ...prevState,
//                     time: {
//                         distance, minutes, seconds
//                     }
//                 }));
//             }
//         }, 1000);
//     };

//     const handleFiftyFifty = () => {
//         if (state.usedFiftyFifty) return;

//         const allOptions = state.currentQuestion.options;
//         const correctOptions = state.currentQuestion.correct_options;

//         let incorrectOptions = [];
//         allOptions.forEach((option, index) => {
//             if (!correctOptions.includes(index)) incorrectOptions.push(index);
//         });

//         let randomIncorrectOptions = [];
//         while (randomIncorrectOptions.length < 2) {
//             const randomIndex = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
//             if (!randomIncorrectOptions.includes(randomIndex)) {
//                 randomIncorrectOptions.push(randomIndex);
//             }
//         }

//         setState(prevState => ({
//             ...prevState,
//             fiftyFifty: prevState.fiftyFifty - 1,
//             usedFiftyFifty: true,
//             currentQuestion: {
//                 ...prevState.currentQuestion,
//                 options: allOptions.map((option, index) =>
//                     randomIncorrectOptions.includes(index) ? null : option
//                 )
//             }
//         }));
//     };

//     const handleHints = () => {
//         if (state.hints > 0) {
//             const allOptions = state.currentQuestion.options;
//             const correctOptions = state.currentQuestion.correct_options;

//             let remainingOptions = [];
//             allOptions.forEach((option, index) => {
//                 if (!correctOptions.includes(index)) remainingOptions.push(index);
//             });

//             const randomIndex = remainingOptions[Math.floor(Math.random() * remainingOptions.length)];

//             setState(prevState => ({
//                 ...prevState,
//                 hints: prevState.hints - 1,
//                 currentQuestion: {
//                     ...prevState.currentQuestion,
//                     options: allOptions.map((option, index) =>
//                         index === randomIndex ? null : option
//                     )
//                 }
//             }));
//         }
//     };

//     const showOptions = () => {
//       if (!state.currentQuestion.options) return null;
//       const options = state.currentQuestion.options.map((option, index) => (
//           <div key={index} className="option">
//               {option !== null && (
//                   state.currentQuestion.correct_options.length > 1 ? (
//                       <label>
//                           <input
//                               type="checkbox"
//                               checked={state.selectedAnswers.includes(index)}
//                               onChange={() => handleOptionClick(index)}
//                           />
//                           {option}
//                       </label>
//                   ) : (
//                       <label>
//                           <input
//                               type="radio"
//                               name="quiz-option"
//                               checked={state.selectedAnswers.includes(index)}
//                               onChange={() => handleOptionClick(index)}
//                           />
//                           {option}
//                       </label>
//                   )
//               )}
//           </div>
//       ));
//       return (
//           <div className="options-container">
//               {options.reduce((result, option, index) => {
//                   if (index % 2 === 0) {
//                       result.push(
//                           <div key={`row-${index}`} className="options-row">
//                               {options[index]}
//                               {options[index + 1] ? options[index + 1] : null}
//                           </div>
//                       );
//                   }
//                   return result;
//               }, [])}
//           </div>
//       );
//   };
  

//     const handleDisableButton = () => {
//         if (state.previousQuestion === undefined || state.currentQuestionIndex === 0) {
//             setState(prevState => ({
//                 ...prevState,
//                 previousButtonDisabled: true
//             }));
//         } else {
//             setState(prevState => ({
//                 ...prevState,
//                 previousButtonDisabled: false
//             }));
//         }

//         if (state.nextQuestion === undefined || state.currentQuestionIndex + 1 === state.numberOfQuestions) {
//             setState(prevState => ({
//                 ...prevState,
//                 nextButtonDisabled: true
//             }));
//         } else {
//             setState(prevState => ({
//                 ...prevState,
//                 nextButtonDisabled: false
//             }));
//         }
//     };

//     const endGame = () => {
//         alert('Quiz has ended!');
//         const playerStats = {
//             score: state.score,
//             numberOfQuestions: state.numberOfQuestions,
//             numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
//             correctAnswers: state.correctAnswers,
//             wrongAnswers: state.wrongAnswers
//         };
//         setTimeout(() => {
//             navigate('/play/result', { state: playerStats });
//         }, 1000);
//     };

//     const { currentQuestion, currentQuestionIndex, fiftyFifty, hints, numberOfQuestions, time } = state;

//     if (isEmpty(state.currentQuestion)) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <Fragment>
//             <Helmet><title>Quiz Page</title></Helmet>
//             <Fragment>
//                 <audio ref={correctSound} src={correctNotification}></audio>
//                 <audio ref={wrongSound} src={wrongNotification}></audio>
//                 <audio ref={buttonSound} src={buttonNotification}></audio>
//             </Fragment>
//             <div className="questions">
//                 <h2>Quiz Mode</h2>
//                 <div className="lifeline-container">
//                     <p>
//                         <span onClick={handleFiftyFifty} className="mdi mdi-set-center mdi-24px lifeline-icon">
//                             <span className="lifeline">{fiftyFifty}</span>
//                         </span>
//                     </p>
//                     <p>
//                         <span onClick={handleHints} className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon">
//                             <span className="lifeline">{hints}</span>
//                         </span>
//                     </p>
//                 </div>
//                 <div className="timer-container">
//                     <p>
//                         <span className="left" style={{ float: 'left' }}>{currentQuestionIndex + 1} of {numberOfQuestions}</span>
//                         <span className={classnames('right valid', {
//                             'warning': time.distance <= 120000,
//                             'invalid': time.distance < 30000
//                         })}>
//                             {time.minutes}:{time.seconds}
//                             <span className="mdi mdi-clock-outline mdi-24px"></span>
//                         </span>
//                     </p>
//                 </div>
//                 <h5>{currentQuestion.question}</h5>
//                 {showOptions()}

//                 <div className="button-container">
//                     <button
//                         className={classnames('', { 'disable': state.previousButtonDisabled })}
//                         id="previous-button"
//                         onClick={handlePreviousButtonClick}>
//                         Previous
//                     </button>
//                     {state.currentQuestionIndex + 1 === numberOfQuestions ? (
//                         <button id="finish-button" onClick={handleFinishButtonClick}>Finish</button>
//                     ) : (
//                         <button
//                             className={classnames('', { 'disable': state.nextButtonDisabled })}
//                             id="next-button"
//                             onClick={handleNextButtonClick}>
//                             Next
//                         </button>
//                     )}
//                     <button id="quit-button" onClick={handleQuitButtonClick}>Quit</button>
//                 </div>
//             </div>
//         </Fragment>
//     );
// };

// export default Play;


import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Grid, Card, CardContent, Typography, Button, Checkbox, Radio, FormControlLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Play = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, purpose, date } = location.state || {};
  
  const initialState = {
    questions,
    currentQuestionIndex: 0,
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    numberOfAnsweredQuestions: 0,
    selectedAnswers: questions.map(() => [])
  };

  const [state, setState] = useState(initialState);

  const handleOptionChange = (quizIndex, questionIndex, optionIndex) => {
    const newSelectedAnswers = [...state.selectedAnswers];
    if (state.questions[quizIndex].questions[questionIndex].correct_options.length > 1) {
      if (newSelectedAnswers[quizIndex][questionIndex]?.includes(optionIndex)) {
        newSelectedAnswers[quizIndex][questionIndex] = newSelectedAnswers[quizIndex][questionIndex].filter(index => index !== optionIndex);
      } else {
        newSelectedAnswers[quizIndex][questionIndex] = [...(newSelectedAnswers[quizIndex][questionIndex] || []), optionIndex];
      }
    } else {
      newSelectedAnswers[quizIndex][questionIndex] = [optionIndex];
    }
    setState(prevState => ({ ...prevState, selectedAnswers: newSelectedAnswers }));
  };

  const handleNextButtonClick = () => {
    checkAnswer();
    if (state.currentQuestionIndex + 1 < state.questions.length) {
      setState(prevState => ({
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex + 1
      }));
    } else {
      endGame();
    }
  };

  const handleFinishButtonClick = () => {
    checkAnswer();
    endGame();
  };

  const checkAnswer = () => {
    const currentQuestion = state.questions[state.currentQuestionIndex].questions[state.currentQuestionIndex];
    const correctOptions = currentQuestion.correct_options;
    const selectedOptions = state.selectedAnswers[state.currentQuestionIndex];
    const isCorrect = correctOptions.length === selectedOptions.length && correctOptions.every(option => selectedOptions.includes(option));
    if (isCorrect) {
      setState(prevState => ({
        ...prevState,
        score: prevState.score + 1,
        correctAnswers: prevState.correctAnswers + 1,
        numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
      }));
    } else {
      setState(prevState => ({
        ...prevState,
        wrongAnswers: prevState.wrongAnswers + 1,
        numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
      }));
    }
  };

  const endGame = () => {
    const playerStats = {
      score: state.score,
      numberOfQuestions: state.questions.length,
      numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
      correctAnswers: state.correctAnswers,
      wrongAnswers: state.wrongAnswers,
      studentEmail: 'student@example.com' // Replace with actual student email from context or props
    };

    axios.post('/api/save-score', playerStats)
      .then(response => {
        console.log('Score saved successfully:', response.data);
        navigate('/play/result', { state: playerStats });
      })
      .catch(error => {
        console.error('Error saving score:', error);
      });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>
        </Grid>
        {state.questions.map((quiz, quizIndex) => (
          quiz.questions.map((question, questionIndex) => (
            <Card key={questionIndex} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Q{questionIndex + 1}: {question.question}</Typography>
                {question.options.map((option, optionIndex) => (
                  <FormControlLabel
                    key={optionIndex}
                    control={
                      question.correct_options.length > 1 ? (
                        <Checkbox
                          checked={state.selectedAnswers[quizIndex]?.[questionIndex]?.includes(optionIndex) || false}
                          onChange={() => handleOptionChange(quizIndex, questionIndex, optionIndex)}
                        />
                      ) : (
                        <Radio
                          checked={state.selectedAnswers[quizIndex]?.[questionIndex]?.[0] === optionIndex}
                          onChange={() => handleOptionChange(quizIndex, questionIndex, optionIndex)}
                        />
                      )
                    }
                    label={`${String.fromCharCode(65 + optionIndex)}. ${option}`}
                  />
                ))}
              </CardContent>
            </Card>
          ))
        ))}
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleNextButtonClick} disabled={state.currentQuestionIndex + 1 >= state.questions.length}>Next</Button>
          {state.currentQuestionIndex + 1 === state.questions.length && (
            <Button variant="contained" onClick={handleFinishButtonClick}>Finish</Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Play;

