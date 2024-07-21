import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Box,Divider, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,Container, Grid, Card,CardContent } from '@mui/material';
// import { GoogleLogin } from 'react-google-login';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [open, setOpen] = useState(false);
  
  // const [name, setName] = useState('');
  // let email='';
  let name='';
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
        role
      });
      console.log(response.data.name);
      name=response.data.name;
      // setName(response.data.name);
      // setName(response.data.name);
      console.log("Name",name);
      if (response.data.role === 'teacher') {
        navigate('/quiz-landing',{ state: { name } });
      } else {
        navigate('/game-landing', { state: { email,name } });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert(error.response?.data || 'Invalid email or password');
    }
  };

  const handleGoogleLoginSuccess = async (tokenResponse) => {
    try {
      // console.log("tokenResponse",tokenResponse);
      const token = tokenResponse.credential;
      console.log('Google login success:', token);
      const res = await axios.post('http://localhost:5000/google-login', {
        token,
        role
      });
      const emailId=res.data.email;
      console.log("email",emailId);
      name=res.data.name;
      // setName(res.data.name);
      if (res.data.role === 'teacher') {
        navigate('/quiz-landing',{ state: { name } });
      } else {
        navigate('/game-landing', { state: { emailId,name } });
      }
    } catch (error) {
      console.error('Error logging in with Google:', error);
      alert(error.response?.data || 'Invalid email! Please signup first.');
    }
  };

  const handleGoogleLoginFailure = (response) => {
    console.error('Google login failed:', response);
    alert('Google login failed');
  };

  const handleForgotPassword = () => {
    setForgotPasswordEmail(email);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleResetPassword = async () => {
    try {
      await axios.post('http://localhost:5000/forgot-password', { email: forgotPasswordEmail });
      alert('Password reset link sent to your email');
      handleClose();
    } catch (error) {
      console.error('Error resetting password:', error);
      alert(error.response?.data || 'Error resetting password');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
    <Card>
    <CardContent>
    <GoogleOAuthProvider clientId="396963304688-pk3nkgsbr3ud9deoasm9qlc82i8kejmq.apps.googleusercontent.com">
    <Typography variant="h4" paddingBottom={3}>Login</Typography>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailure}
          sx={{ mt: 2 }}
        />
        <Grid container alignItems="center" sx={{ mt: 2, mb: 2 }}>
          <Grid item xs>
            <Divider sx={{ borderStyle: 'dashed' }} />
          </Grid>
          <Grid item>
            <Typography sx={{ mx: 2 }}>OR with email and password</Typography>
          </Grid>
          <Grid item xs>
            <Divider sx={{ borderStyle: 'dashed' }} />
          </Grid>
        </Grid>
      <Box>
        
        {/* <FormControl fullWidth margin="normal">
        <InputLabel>Role</InputLabel>
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="teacher">Teacher</MenuItem>
        </Select>
      </FormControl> */}
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
        </Box>
        <Box textAlign="center" mt={2}>
        <Button variant="contained" color="primary" onClick={handleLogin}>Login</Button>
        <Box display={'flex'} justifyContent={'space-between'} mt={2}>
        <Typography variant="body1">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Typography>
        <Typography variant="body1">
          <Button onClick={handleForgotPassword}>Forgot Password?</Button>
        </Typography>
        </Box>
        </Box>
    </GoogleOAuthProvider>
    </CardContent>
    </Card>
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your email address. We will send you a link to reset your password.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleResetPassword}>Send Reset Link</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login;
