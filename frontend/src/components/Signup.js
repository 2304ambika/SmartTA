import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button,Box, Select, MenuItem, FormControl,InputAdornment, InputLabel, Typography, Card, CardContent,Container } from '@mui/material';
import { url_backend } from '../constant';
import Navbar from './Navbar';
import { AccountCircle, School, Email, Lock, LockOpen, Person, Home, Login } from '@mui/icons-material';

const Signup = () => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

     // Email validation
     const emailDomainRegex = /^[a-zA-Z0-9._%+-]+@(google|yahoo|example)\.com$/;
     if (!emailDomainRegex.test(email)) {
       alert('Please use a valid email domain (e.g., @google.com, @yahoo.com)');
       return;
     }

    try {
      const response = await axios.post(url_backend+'/signup', {
        name,
        department,
        email,
        password,
        role
      });
      const emailId=email;
      navigate('/login');
      if (role === 'teacher') {
        navigate('/quiz-landing',{ state: { name } });
      } else {
        navigate('/game-landing',{ state: { emailId,name } });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert('This email is already in use');
      } else {
        console.error('Error signing up:', error);
      }
    }
  };

  return (
    <Box>
      <Navbar />
      <Container sx={{ marginTop: 4 }}>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>Sign Up</Typography>
              <Box display="flex" gap={2}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <School />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box display="flex" justifyContent="space-between" gap={2}>
                <FormControl fullWidth margin="normal" sx={{ flex: 1 }}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="teacher">Teacher</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box display="flex" justifyContent="space-between" gap={2}>
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOpen />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box textAlign="center" sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSignup}
                  startIcon={<AccountCircle />}
                  sx={{
                    textTransform: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#115293',
                    },
                  }}
                >
                  Sign Up
                </Button>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Already have an account? <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>Login</Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Container>
    </Box>
  );
};

export default Signup;
