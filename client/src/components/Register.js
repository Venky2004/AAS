import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [formData, setFormData] = useState({
    phone_number: '',
    name: '',
    age: '',
    address: '',
    email: '',
    password: '',
    role: 'farmer',
    latitude: null,
    longitude: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user location on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.error('Error fetching location:', error);
          alert('Location access is required for registration.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/register', formData);
      alert('Registration successful');
      setFormData({
        phone_number: '',
        name: '',
        age: '',
        address: '',
        email: '',
        password: '',
        role: 'farmer',
        latitude: null,
        longitude: null,
      });
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" align="center">Register</Typography>
      <form onSubmit={handleSubmit}>
        {['phone_number', 'name', 'age', 'address', 'email', 'password'].map((field) => (
          <TextField
            key={field}
            name={field}
            label={field.replace('_', ' ')}
            fullWidth
            margin="normal"
            type={field === 'password' ? 'password' : 'text'}
            value={formData[field]}
            onChange={handleChange}
          />
        ))}

        {/* Role Selection */}
        <Select name="role" value={formData.role} fullWidth onChange={handleChange} style={{ marginTop: '16px' }}>
          <MenuItem value="farmer">Farmer</MenuItem>
          <MenuItem value="buyer">Buyer</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>

        <Button type="submit" variant="contained" fullWidth style={{ marginTop: '20px' }}>Register</Button>
      </form>
      <a href='/login'>Already registered, LOGIN here</a>
    </Container>
  );
};

export default Register;
