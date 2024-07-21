import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import HomePage from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Instructions from './components/Game/Instructions';
import Play from './components/Game/Play';
import QuizGeneration from './components/Game/QuizGeneration';
import Result from './components/Game/Result';
import ContentCreation from './components/ContentCreation';
import Whiteboard from './components/Whiteboard';
import QuizLanding from './components/Game/QuizLanding';
import GameLanding from './components/Game/GameLanding';
// import CreateQuiz from './CreateQuiz'; // Import CreateQuiz component
import ViewQuiz from './components/Game/ViewQuiz'; // Import ViewQuiz component
import PlayTest from './components/Game/PlayTest';
import Review from './components/Game/Review';
import SummarizeDoc from './components/SummarizeDoc';
import PPTCreation from './components/PPTCreation';
import ResetPassword from './components/ResetPassword';


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
      <Route path="/content-creation" exact element={<ContentCreation />} />
      <Route path="/summarize-doc" exact element={<SummarizeDoc />} />
      <Route path="/create-ppt" exact element={<PPTCreation />} />
      <Route path="/whiteboard" exact element={<Whiteboard />} />
      <Route path="/game-landing" exact element={<GameLanding />} />
      <Route path="/play" exact element={<PlayTest />} />
      <Route path="/review" element={<Review />} />

      <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/generate-quiz" element={<CreateQuiz />} /> */}
        <Route path="/generate-quiz" exact element={<QuizGeneration />} />
      <Route path="/play/instructions" exact element={<Instructions />} />
      <Route path="/play/game" exact element={<Play />} />
      <Route path="/play/result" exact element={<Result />} />
    </Routes>
  </div>
  );
}

export default App;
