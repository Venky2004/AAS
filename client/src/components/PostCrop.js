import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Input } from '@mui/material';
import api from '../api';

const PostCrop = () => {
  const [cropData, setCropData] = useState({
    description: '',
    price: '',
    photos: [],
  });

  const handleChange = (e) => setCropData({ ...cropData, [e.target.name]: e.target.value });
  const handlePhotoChange = (e) => setCropData({ ...cropData, photos: e.target.files });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', cropData.description);
    formData.append('price', cropData.price);
    Array.from(cropData.photos).forEach((photo) => formData.append('photos', photo));

    try {
      await api.post('/crops', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Crop posted successfully');
      setCropData({ description: '', price: '', photos: [] }); // Reset form on success
    } catch (error) {
      console.error('Error posting crop:', error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" align="center">Post a Crop</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="description"
          label="Description"
          fullWidth
          margin="normal"
          value={cropData.description}
          onChange={handleChange}
        />
        <TextField
          name="price"
          label="Price"
          type="number"
          fullWidth
          margin="normal"
          value={cropData.price}
          onChange={handleChange}
        />
        <Input
          type="file"
          inputProps={{ multiple: true }}
          onChange={handlePhotoChange}
        />
        <Button type="submit" variant="contained" fullWidth>Post Crop</Button>
      </form>
    </Container>
  );
};

export default PostCrop;
