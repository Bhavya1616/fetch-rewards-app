import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';  

// Login Page Component
const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://frontend-take-home-service.fetch.com/auth/login', {
        name,
        email
      }, {
        withCredentials: true // Send credentials with the request
      });

      if (response.status === 200) {
        navigate('/search'); // Navigate to the search page after successful login
      }
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <Typography variant="h4" gutterBottom align="center">Login</Typography>
        {error && <Typography color="error" align="center">{error}</Typography>}
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}  
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ mt: 2 }} 
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
