import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button,Box, Select, MenuItem, FormControl, InputLabel, Typography, Card, CardContent,Container } from '@mui/material';

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
      const response = await axios.post('http://localhost:5000/signup', {
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
    <Container maxWidth="md" sx={{ mt: 4 }}>
    <Card>
    <CardContent>
      <Typography variant="h4">Sign Up</Typography>
      <Box display={'flex'} >
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
      <TextField label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} fullWidth margin="normal" />
      </Box>
      <Box display={'flex'} justifyContent={'space-between'}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Role</InputLabel>
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="teacher">Teacher</MenuItem>
        </Select>
      </FormControl>
      <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
        </Box>
      <Box display={'flex'} justifyContent={'space-between'}>
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
      <TextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth margin="normal" />
      </Box>
      <Box textAlign={'center'}>
      <Button variant="contained" color="primary" onClick={handleSignup}>Sign Up</Button>
      <Typography variant="body1">
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
      </Box>
      </CardContent>
    </Card>
    </Container>
  );
};

export default Signup;
