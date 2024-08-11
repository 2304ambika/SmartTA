import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Card, CardContent, CardMedia } from '@mui/material';
import Navbar from './Navbar';
import StudyImage from '../assets/img/home_screen_img.gif';
import BooksImage from '../assets/img/home_screen_img.png';
import QuizImage from '../assets/img/QuizImage.png';
import SummaryImage from '../assets/img/SummaryImage.jpg';
import PPTImage from '../assets/img/PPTImage.jpg';
import WhiteboardImage from '../assets/img/whiteboard.jpg';
import PollImage from '../assets/img/PollCreation.png';
import PollPlayImage from '../assets/img/PollPlay.png';
import PlayTestsImage from '../assets/img/PlayQuiz.jpg';
import ClassroomImage from '../assets/img/classroom.jpg';

const HomePage = () => {
  return (
    <Box sx={{ backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <Navbar />

      {/* Main Introduction */}
      <Grid container spacing={1} alignItems="center" sx={{ padding: 4, textAlign: 'center' }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h3" gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' }, maxWidth: '95%' }}>
            Discover Innovative Learning Tools
          </Typography>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '1.8rem' }, maxWidth: '95%' }}>
            Empower Educators & Engage Students 
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <img src={ClassroomImage} alt="Classroom" style={{ maxWidth: '80%', height: 'auto', borderRadius: '8px' }} />
        </Grid>
      </Grid>

      {/* Features for Teachers */}
      <Box sx={{ backgroundColor: '#ffffff', padding: 4, marginTop: 4, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Container>
          <Typography variant="h4" gutterBottom>
            Teacher Tools
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={QuizImage}
                  alt="Quiz Creation"
                  sx={{ objectFit: 'contain' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Question Bank Creation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create and manage comprehensive question banks effortlessly for each chapter.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={SummaryImage}
                  alt="Summary Creation"
                  sx={{ objectFit: 'contain' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Summary Creation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Generate concise summaries quickly from documents or research papers.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={PPTImage}
                  alt="PPT Creation"
                  sx={{ objectFit: 'contain' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    PPT Creation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Design engaging presentations easily by incorporating content from documents into lecture slides.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={WhiteboardImage}
                  alt="Scan Whiteboard"
                  sx={{ objectFit: 'contain' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Scan Whiteboard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Digitize whiteboard notes seamlessly.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={PollImage}
                  alt="Poll Creation"
                  sx={{ objectFit: 'contain' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Poll Creation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create interactive polls to understand if students have grasped the concepts during class.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features for Students */}
      <Box sx={{ backgroundColor: '#ffffff', padding: 4, marginTop: 4, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Container>
          <Typography variant="h4" gutterBottom>
            Student Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={PlayTestsImage}
                  alt="Play Tests"
                  sx={{ objectFit: 'contain' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Interactive Assessments
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Attempt tests based on meticulously crafted question bank and Access yourself.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={PollPlayImage}
                  alt="Poll Participation"
                  sx={{ objectFit: 'contain' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Poll Participation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Engage in polls and provide instant feedback.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ backgroundColor: '#f5f5f5', padding: 2, marginTop: 4 }}>
        <Container>
          <Typography variant="body1">
            Contact us at: email@example.com
          </Typography>
          <Typography variant="body1">
            Phone: (123) 456-7890
          </Typography>
        </Container>
      </Box>
    </Box>
  );
  
};

export default HomePage;
