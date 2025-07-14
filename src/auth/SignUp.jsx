
import { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthBg from "../assets/auth-bg.jpg";

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // For redirection

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        username: name,
        email,
        password,
      });
      toast.success('Signup successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/'); // Redirect to login page after 2 seconds
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Signup failed';
      toast.error(errorMsg);
    }
  };

  return (
    <Box className="flex flex-col items-center p-4 space-y-4 bg-white rounded shadow-md w-80 mx-auto mt-10">
      <Typography variant="h4" className="text-gray-700 font-semibold">
        Sign Up
      </Typography>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4"
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4"
      />
      <Button variant="contained" color="primary" onClick={handleSignUp} fullWidth>
        Sign Up
      </Button>
      <Typography className="text-sm text-gray-500 mt-2">
        Already have an account?{' '}
        <Link to="/" className="text-blue-500 hover:underline">
          Login
        </Link>
      </Typography>
    </Box>
  );
};

export default SignUp;
