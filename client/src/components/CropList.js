import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import api from '../api';

const CropList = () => {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const { data } = await api.get('/crops');
        setCrops(data);
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };
    fetchCrops();
  }, []);

  return (
    <Container>
      <Typography variant="h4" align="center">Crops</Typography>
      <Grid container spacing={2}>
        {crops.map((crop) => (
          <Grid item xs={12} sm={6} md={4} key={crop._id}>
            <Card>
              <CardMedia component="img" image={crop.photos[0]} height="140" />
              <CardContent>
                <Typography variant="h6">{crop.description}</Typography>
                <Typography>Price: ₹{crop.price}</Typography>
                <Button variant="contained">View Details</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CropList;
