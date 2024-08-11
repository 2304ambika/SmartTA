// import React, { useState } from 'react';
// import { Button, Grid, Box, CssBaseline } from '@mui/material';
// import TeacherPoll from './TeacherPoll';
// import StudentPoll from './StudentPoll';
// import Sidebar from '../Sidebar';

// const PollLanding = () => {
//   const [view, setView] = useState('teacher');

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />
//       <Grid container>
//         <Grid item xs={2}>
//           <Sidebar />
//         </Grid>
//         <Grid item xs={10}>
//     <div>
//       <Button onClick={() => setView('teacher')}>Teacher View</Button>
//       <Button onClick={() => setView('student')}>Student View</Button>
//       {view === 'teacher' ? <TeacherPoll /> : <StudentPoll />}
//     </div>
//     </Grid>
//     </Grid>
//     </Box>
//   );
// };

// export default PollLanding;


import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const Instructions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { questions, purpose, title, date, email, name } = location.state;

  const handleStartTest = () => {
    navigate('/play', { state: { questions, purpose, title, date, email, name } });
  };

  return (
    <Container>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Instructions
        </Typography>
        <Typography variant="body1" paragraph>
          1. The questions will be of single correct or multi-correct in nature.
        </Typography>
        <Typography variant="body1" paragraph>
          2. You must complete the test within the given time. Once the timer finishes, all responses will be automatically submitted.
        </Typography>
        <Typography variant="body1" paragraph>
          3. You can finish the test before the time limit by clicking the submit button at the bottom.
        </Typography>
        <Typography variant="body1" paragraph>
          4. Each question is worth 1 mark.
        </Typography>
        <Typography variant="body1" paragraph>
          5. After finishing the test, you will be taken to a page where you can see your score and review the correct answers.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleStartTest}>
          Start Test
        </Button>
      </Box>
    </Container>
  );
};

export default Instructions;
