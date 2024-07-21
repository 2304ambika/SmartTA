import React from 'react';
import { Box, Grid, Card, CardContent, Typography,Paper,Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UploadIcon from '@mui/icons-material/Upload';
import QuizIcon from '@mui/icons-material/Quiz';
import CreateIcon from '@mui/icons-material/Create';
import "../styles/components/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const cardStyles = {
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    '& .card-icon': {
      fontSize: 50,
      position: 'absolute',
      right: 16,
      bottom: 16,
      opacity: 0.5,
    }
  };

  // return (
  //   <Container>
  //     <Box my={4}>
  //       <Typography variant="h3" component="h1" gutterBottom>
  //         Dashboard
  //       </Typography>
  //       <Typography variant="body1">
  //         Welcome to the Dashboard. Use the navigation bar to create quizzes or check student progress.
  //       </Typography>
  //     </Box>
  //   </Container>
  // );
  return (
    <div className="dashboard">
      <header className="header">
        <div className="profile">
          <img src="profile.jpg" alt="Profile" className="profile-image" />
          <div className="profile-info">
            <h2>Natalya Annie</h2>
            <p>Faculty</p>
            <p>Department of Science</p>
          </div>
        </div>
      </header>

      <main className="main">
        {/* <section className="notifications">
          <h3>Notifications (5)</h3>
          <ul>
            <li>Resolve Doubts - 5 Unread messages</li>
            <li>Scheduled announcement for your class</li>
            <li>Resolve Doubts - 5 Unread messages</li>
            <li>Scheduled announcement for your class</li>
            <li>Resolve Doubts - 5 Unread messages</li>
          </ul>
        </section> */}

  <section className="classes">
          <h2>My Classes</h2>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
              <Tooltip title="Create new content for your classes" arrow>
                <Card 
                  sx={{
                    ...cardStyles,
                    backgroundColor: '#1d87da'
                  }}
                  onClick={() => navigate('/content-creation')}
                >
                  <CardContent>
                    <CreateIcon className="card-icon" />
                    <Typography variant="h5" component="div">
                      Content Creation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create new content for your classes
                    </Typography>
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Tooltip title="Upload your whiteboard images here" arrow>
                <Card 
                  sx={{
                    ...cardStyles,
                    backgroundColor: '#4dabf5'
                  }}
                  onClick={() => navigate('/whiteboard')}
                >
                  <CardContent>
                    <UploadIcon className="card-icon" />
                    <Typography variant="h5" component="div">
                      Whiteboard Image Upload
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upload your whiteboard images here
                    </Typography>
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Tooltip title="Generate quizzes for your classes" arrow>
                <Card 
                  sx={{
                    ...cardStyles,
                    backgroundColor: '#79c0f7'
                  }}
                  onClick={() => navigate('/generate-quiz')}
                >
                  <CardContent>
                    <QuizIcon className="card-icon" />
                    <Typography variant="h5" component="div">
                      Quizzes Generated
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Number of quizzes for recent classes: 5
                    </Typography>
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
          </Grid>
        </section>
       

        <section className="assessments">
          <h3>My Assessments</h3>
          <div className="stats">
            <div>
              <h4>8</h4>
              <p>Quiz Added</p>
            </div>
            <div>
              <h4>1</h4>
              <p>Unpublished quiz</p>
            </div>
            <div>
              <h4>3</h4>
              <p>Quiz submitted</p>
            </div>
          </div>
          <div className="quick-links">
            <p>Quick Links</p>
            <ul>
              <li>View detailed report of chemistry quiz submitted on 8 May 2019.</li>
            </ul>
          </div>
        </section>

      </main>

      <footer className="footer">
        {/* <div className="snackbar">Notification message</div> */}
      </footer>
    </div>
  );
};

export default Dashboard;