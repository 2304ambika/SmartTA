import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Button, Typography } from '@mui/material';
import { url_backend } from '../constant';

const ResetPassword = () => {
  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const expirationTime = parseInt(queryParams.get('expires'), 10);
    const currentTime = Date.now();
    const remainingTime = Math.max(expirationTime - currentTime, 0);

    setTimeLeft(remainingTime);

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1000) {
          clearInterval(timer);
          navigate('/login');
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location, navigate]);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${url_backend}/reset/${token}`, { password });
      alert('Password has been reset successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error resetting password:', error);
      alert(error.response?.data || 'Error resetting password');
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reset Password
      </Typography>
      <Typography variant="body1" color="error" gutterBottom>
        {`Time remaining to reset password: ${formatTime(timeLeft)}`}
      </Typography>
      <TextField
        label="New Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleResetPassword}
        fullWidth
        sx={{ mt: 2 }}
      >
        Reset Password
      </Button>
    </Container>
  );
};

export default ResetPassword;
