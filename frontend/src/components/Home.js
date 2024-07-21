import React from 'react';
import { Link } from 'react-router-dom';
import { Box, AppBar, Toolbar,Button, IconButton,ListItemButton, Card,CardContent, CardMedia, Typography, Container, Grid, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import BooksImage from '../assets/img/books.jpeg'; // Make sure to import your books image
import Logo from '../assets/img/logo.jpg'; // Make sure to import your logo image
import QuizImg from '../assets/img/QuizGenerate.jpg';

const HomePage = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        {/* <ListItem disablePadding>
          <ListItemButton component={Link} to="/dashboard">
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem> */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/login">
            <ListItemText primary="Login" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/signup">
            <ListItemText primary="Sign Up" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#2196f3' }}>
        <Toolbar>
          {/* <IconButton edge="start" color="inherit" aria-label="logo" component={Link} to="/"> */}
          {/* <IconButton edge="start" color="inherit" aria-label="logo"> */}
            <img src={Logo} alt="Logo" style={{ height: '40px' }} />
          {/* </IconButton> */}
          <Box sx={{ flexGrow: 1 }} />
          {isMobile ? (
            <>
              <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerContent}
              </Drawer>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/">Home</Button>
              {/* <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button> */}
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ marginTop: 4 }}>
      {/* Main Introduction */}
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h3" gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' }, maxWidth: '95%' }}>
            Innovative Learning Tools using GenAI
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, maxWidth: '95%' }}>
            Empower Educators & Engage Students
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: '1rem', md: '1.2rem' }, maxWidth: '95%' }}>
            Discover our range of tools designed to enhance both teaching and learning experiences. <br></br>
            Teachers can create interactive quizzes, generate summaries, craft engaging presentations, and convert whiteboard images into digital notes effortlessly.<br></br> 
            Students can easily access and play the tests created by their teachers.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} textAlign="center">
          <img src={BooksImage} alt="Books" style={{ maxWidth: '100%', height: 'auto', width: '80%' }} />
        </Grid>
      </Grid>

      {/* Features for Teachers */}
      <Typography variant="h4" gutterBottom sx={{ marginTop: 6 }}>
        Teacher Tools
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={QuizImg}  // Replace with actual image path
              alt="Quiz Creation"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Quiz Creation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Easily create and manage quizzes to test and reinforce students' knowledge.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="path/to/summary_image.jpg"  // Replace with actual image path
              alt="Summary Creation"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Summary Creation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generate concise and informative summaries from your teaching materials.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="path/to/ppt_image.jpg"  // Replace with actual image path
              alt="PPT Creation"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                PPT Creation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create engaging and visually appealing presentations for your classes.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="path/to/whiteboard_image.jpg"  // Replace with actual image path
              alt="Scan Whiteboard"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Scan Whiteboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Convert whiteboard images into digital notes quickly and easily.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Features for Students */}
      <Typography variant="h4" gutterBottom sx={{ marginTop: 6 }}>
        Student Features
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="path/to/play_tests_image.jpg"  // Replace with actual image path
              alt="Play Tests"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Play Tests
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Access and play the interactive quizzes created by your teachers. Test your knowledge and track your progress.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Additional student features can be added here */}
      </Grid>
    </Container>

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
