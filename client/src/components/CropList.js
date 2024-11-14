import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CropList = () => {
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('datetime_created');
  const [sortOrder, setSortOrder] = useState('desc');  // Track sorting order: 'asc' or 'desc'
  const navigate = useNavigate();

  const userRole = localStorage.getItem('userRole') || 'buyer'; // Assume 'buyer' if not set

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const { data } = await api.get('/crops');
        setCrops(data);
        setFilteredCrops(data);  // Set filtered crops initially
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };
    fetchCrops();
  }, []);

  useEffect(() => {
    let filtered = crops;

    if (searchQuery) {
      filtered = filtered.filter(crop => crop.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    filtered = filtered.sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortBy === 'datetime_created') {
        return sortOrder === 'asc' ? new Date(a.datetime_created) - new Date(b.datetime_created) : new Date(b.datetime_created) - new Date(a.datetime_created);
      } else {
        return 0;
      }
    });

    setFilteredCrops(filtered);  // Update the filtered crops
  }, [searchQuery, sortBy, sortOrder, crops]);

  const handleViewDetails = (cropId) => {
    navigate(`/crop-detail/${cropId}`);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>Crops</Typography>
      
      {userRole === 'farmer' && (
        <Button variant="contained" color="primary" style={{ marginBottom: '20px' }} onClick={() => navigate('/post-crop')}>Post Crop</Button>
      )}

      <TextField label="Search by Name" variant="outlined" fullWidth style={{ marginBottom: '20px' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Sort By</InputLabel>
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort By">
          <MenuItem value="datetime_created">Date Posted</MenuItem>
          <MenuItem value="price">Price</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Sort Order</InputLabel>
        <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} label="Sort Order">
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={2}>
        {filteredCrops.map((crop) => (
          <Grid item xs={12} sm={6} md={4} key={crop._id}>
            <Card>
              <CardMedia component="img" image={crop.photos.length > 0 ? crop.photos[0] : '/placeholder.jpg'} height="140" alt="Crop" />
              <CardContent>
                <Typography variant="h6">{crop.description}</Typography>
                <Typography>Price: ₹{crop.price}</Typography>
                <Button variant="contained" onClick={() => handleViewDetails(crop._id)}>View Details</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CropList;
