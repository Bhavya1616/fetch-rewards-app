import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, IconButton, CircularProgress } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

const DogDetails = ({ dogId, handleFavoriteToggle, favorites = [] }) => {
  const [dog, setDog] = useState(null);

  useEffect(() => {
    const fetchDogDetails = async () => {
      try {
        // Using POST to fetch dog details with the correct dogId
        const response = await axios.post(`${API_BASE_URL}/dogs`, [dogId], {
          withCredentials: true,
        });
        setDog(response.data[0]); // Assuming response.data is an array
      } catch (error) {
        console.error('Error fetching dog details:', error);
      }
    };

    fetchDogDetails();
  }, [dogId]);

  if (!dog) {
    return <CircularProgress />; // Display CircularProgress while loading data
  }

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '10px',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        {dog.name}
      </Typography>
      <img
        src={dog.img}
        alt={dog.name}
        style={{
          width: '100%',
          height: '200px',  
          objectFit: 'cover', 
          borderRadius: '8px',
        }}
      />
      <Typography variant="body1" style={{ marginBottom: '10px' }}>
        <strong>Breed:</strong>  {dog.breed}
      </Typography>
      <Typography variant="body1" style={{ marginBottom: '10px' }}>
        <strong>Age:</strong> {dog.age || 'N/A'}
      </Typography>
      <Typography variant="body1" style={{ marginBottom: '10px' }}>
        <strong>Zip Code:</strong> {dog.zip_code || 'N/A'}
      </Typography>

      <IconButton
        onClick={() => handleFavoriteToggle(dogId)}
        style={{
          color: favorites.includes(dogId) ? 'red' : '#888',
          padding: '10px',
          transition: 'color 0.3s',
        }}
      >
        <FavoriteIcon />
      </IconButton>
    </div>
  );
};

export default DogDetails;
