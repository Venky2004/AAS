import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Select, MenuItem } from '@mui/material';
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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/register', formData);
      alert('Registration successful');
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
        <Select name="role" value={formData.role} fullWidth onChange={handleChange}>
          <MenuItem value="farmer">Farmer</MenuItem>
          <MenuItem value="buyer">Buyer</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
        <Button type="submit" variant="contained" fullWidth>Register</Button>
      </form>
    </Container>
  );
};

export default Register;
