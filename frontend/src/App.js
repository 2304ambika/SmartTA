import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Whiteboard from './components/Teacher/Whiteboard';
import QuizLanding from './components/Teacher/Game/QuizLanding';
import GameLanding from './components/Student/Game/GameLanding';
// import CreateQuiz from './CreateQuiz'; // Import CreateQuiz component
import ViewQuiz from './components/Teacher/Game/ViewQuiz'; // Import ViewQuiz component
import PlayTest from './components/Student/Game/PlayTest';
import Review from './components/Student/Game/Review';
import SummarizeDoc from './components/Teacher/SummarizeDoc';
import PPTCreation from './components/Teacher/PPTCreation';
import ResetPassword from './components/ResetPassword';
import TeacherPoll from './components/Teacher/TeacherPoll';
import StudentPoll from './components/Student/StudentPoll';
import Instructions from './components/Student/Game/Instructions';


function App() {
  return(
    <div className="App">
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset/:token" element={<ResetPassword />} />
      <Route path="/quiz-landing" exact element={<QuizLanding />} />
      <Route path="/view" element={<ViewQuiz />} />
      <Route path="/summarize-doc" exact element={<SummarizeDoc />} />
      <Route path="/create-ppt" exact element={<PPTCreation />} />
      <Route path="/whiteboard" exact element={<Whiteboard />} />
      <Route path="/game-landing" exact element={<GameLanding />} />
      <Route path="/play" exact element={<PlayTest />} />
      <Route path="/review" element={<Review />} />

      <Route path="/instruction" element={<Instructions />} />
      <Route path="/poll-create" element={<TeacherPoll />} />
      <Route path="/poll-display" element={<StudentPoll />} />
    </Routes>
  </div>
  );
}

export default App;
