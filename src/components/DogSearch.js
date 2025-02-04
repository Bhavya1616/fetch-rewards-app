import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Box,
  Pagination,
  TextField,
  Slider,
} from '@mui/material';
import DogDetails from './DogDetails';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';
const DOGS_BREEDS_URL = `${API_BASE_URL}/dogs/breeds`;
const DOGS_SEARCH_URL = `${API_BASE_URL}/dogs/search`;
const DOGS_MATCH_URL = `${API_BASE_URL}/dogs/match`;
const LOGOUT_URL = `${API_BASE_URL}/auth/logout`;

const DogSearch = () => {
  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [selectedZipCodes, setSelectedZipCodes] = useState('');
  const [ageRange, setAgeRange] = useState([0, 10]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortOrder, setSortOrder] = useState('breed:asc');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState(null);
  const [open, setOpen] = useState(false);
  const matchRef = useRef(null);
  const selectRef = useRef(null); 
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(DOGS_BREEDS_URL, { withCredentials: true })
      .then((response) => {
        setBreeds(response.data);
      })
      .catch((error) => {
        console.error('Error fetching breeds:', error);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {
      breeds: selectedBreeds.length ? selectedBreeds : undefined,
      zipCodes: selectedZipCodes ? selectedZipCodes.split(',').map((zip) => zip.trim()) : undefined,
      ageMin: ageRange[0],
      ageMax: ageRange[1],
      size: 10,
      from: (page - 1) * 10,
      sort: sortOrder,
    };

    axios
      .get(DOGS_SEARCH_URL, { params, withCredentials: true })
      .then((response) => {
        setDogs(response.data.resultIds);
        setTotal(response.data.total);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching dogs:', error);
        setLoading(false);
      });
  }, [selectedBreeds, selectedZipCodes, ageRange, page, sortOrder]);

  const handleBreedChange = (event) => {
    setSelectedBreeds(event.target.value);
    setOpen(false);
  };

  const handleZipCodeChange = (event) => {
    setSelectedZipCodes(event.target.value);
  };

  const handleAgeRangeChange = (event, newValue) => {
    setAgeRange(newValue);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDropdownClose = () => {
    setOpen(false);
  };
  // Handle adding/removing dogs from favorites
  const handleFavoriteToggle = (dogId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(dogId)
        ? prevFavorites.filter((id) => id !== dogId)
        : [...prevFavorites, dogId]
    );
  };

  // Handle generating match and scrolling to the match
  const handleGenerateMatch = async () => {
    try {
      const response = await axios.post(DOGS_MATCH_URL, favorites, {
        withCredentials: true,
      });
      setMatch(response.data.match);

      // Scroll to the match card
      if (matchRef.current) {
        matchRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      console.error('Error generating match:', error);
    }
  };
  const handleLogout = async () => {
    try {
      await axios.post(LOGOUT_URL, {}, { withCredentials: true });
      navigate('/login');  // Redirect to login page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Box
      sx={{
        padding: '20px',
        margin: 'auto',
        maxWidth: '1200px',
        backgroundColor: '#f0f4f7',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Dog Search
      </Typography>
      {/* Logout Button */}
      <Box display="flex" justifyContent="flex-end" marginBottom="20px">
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleLogout}
          sx={{
            padding: '8px 16px',
            borderRadius: '4px',
          }}
        >
          Log Out
        </Button>
      </Box>

      {/* Filters Section */}
      <Box display="flex" flexDirection="column" gap="20px" marginBottom="30px">
        {/* Filters Section */}
        <FormControl fullWidth style={{ marginBottom: '16px' }}>
          <InputLabel>Breed</InputLabel>
          <Select
            multiple
            value={selectedBreeds}
            onChange={handleBreedChange}
            onClose={handleDropdownClose}
            label="Breed"
            open={open}
            onOpen={() => setOpen(true)}
          >
            {breeds.map((breed) => (
              <MenuItem key={breed} value={breed}>
                {breed}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth style={{ marginBottom: '16px' }}>
          <TextField
            label="Zip Codes"
            value={selectedZipCodes}
            onChange={handleZipCodeChange}
            placeholder="Enter zip codes separated by commas"
          />
        </FormControl>

        <Box style={{ marginBottom: '16px' }}>
          <Typography gutterBottom>Age Range</Typography>
          <Slider
            value={ageRange}
            onChange={handleAgeRangeChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value} years`}
            min={0}
            max={15}
          />
        </Box>

        <FormControl fullWidth style={{ marginBottom: '16px' }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sortOrder} onChange={handleSortChange} label="Sort by">
            <MenuItem value="breed:asc">Breed Ascending</MenuItem>
            <MenuItem value="breed:desc">Breed Descending</MenuItem>
            <MenuItem value="age:asc">Age Ascending</MenuItem>
            <MenuItem value="age:desc">Age Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Dog Cards */}
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="20px" justifyContent="center">
        {loading ? (
          <CircularProgress />
        ) : dogs.length > 0 ? (
          dogs.map((dogId) => (
            <Card key={dogId} sx={{ width: 280,  backgroundColor: '#e0f7fa',
              '&:hover': {
                backgroundColor: '#b2ebf2', 
                boxShadow: 6,
              }, boxShadow: 3, borderRadius: '8px' }}>
              <CardContent>
                <DogDetails
                  dogId={dogId}
                  handleFavoriteToggle={handleFavoriteToggle}
                  favorites={favorites}
                />
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No dogs found for the selected filters</Typography>
        )}
      </Box>

      {/* Pagination */}
      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(total / 10)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Generate Match Button */}
      {favorites.length > 0 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateMatch}
            sx={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' },
            }}
          >
            Generate Match
          </Button>
        </Box>
      )}

      {/* Matched Dog Display */}
      {match && (
        <Box mt={4} textAlign="center" ref={matchRef} >
          <Typography variant="h6" gutterBottom>
            Your Match:
          </Typography>
          <Card sx={{ maxWidth: 300, margin: 'auto', backgroundColor: '#c95162',  '&:hover': {
                backgroundColor: '#c2253c',
                boxShadow: 6,
              }, boxShadow: 3, borderRadius: '8px' }}>
            <CardContent>
              <DogDetails
                dogId={match}
                handleFavoriteToggle={handleFavoriteToggle}
                favorites={favorites}
              />
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default DogSearch;



