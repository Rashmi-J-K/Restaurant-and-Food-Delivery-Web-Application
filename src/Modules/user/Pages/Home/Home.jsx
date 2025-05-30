import React, { useContext, useState } from 'react';
import { Box, Typography, Button, TextField, Grid, Container } from '@mui/material';
import MainBanner from '../../Images/MainBanner.jpg';
import Footer from '../../Footer/Footer'; // Import the Footer component
import { AuthContext } from '../../../GlobalContext';
import { useNavigate } from 'react-router-dom';

const App = () => {
  let navigate = useNavigate();
  const { handleAuthModalOpen, setReservation } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
  });
  const [errors, setErrors] = useState({
    date: false,
    time: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: false,
    });
  };

  const handleReserveTable = () => {
    handleAuthModalOpen();

    const newErrors = {
      date: formData.date === '',
      time: formData.time === '',
    };

    if (newErrors.date || newErrors.time) {
      setErrors(newErrors);
      return;
    }
    console.log(`Reservation Date: ${formData.date}, Time: ${formData.time}`);
    setReservation(formData);
    navigate('/table');
  };

  // Get the current date in yyyy-mm-dd format
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <Box sx={{ position: 'relative', height: 'calc(100vh - 64px)', overflow: 'hidden', mt: '64px' }}>
        {/* Background Image */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            transform: 'translate(-50%, -50%)', // Center the image
            backgroundImage: `url(${MainBanner})`, // Use the imported image
            backgroundSize: 'cover',
            backgroundPosition: 'center', // Center the background image
            opacity: 1,
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column', // Stack items vertically
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100%',
            p: '10px',
            // textAlign: 'center', // Center text within the container
          }}
        >
          <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <Grid item xs={12} md={6}>
              {/* Header Content */}
              <Typography variant="h2" gutterBottom sx={{ color: 'white', textAlign: 'left' }}>
                Let us serve you better
              </Typography>
              <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
                Don’t wait in a line to enjoy your meal. Reserve a table in advance with us.
              </Typography>
            </Grid>
            <Grid item xs={12} md={3.5}>
              {/* Form */}
              <Box
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '35px',
                  minHeight: '450px', // Set the minimum height here
                  textAlign: 'left',
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ pb: '8px' }}>
                  Let us serve you better
                </Typography>
                <Typography variant="h3" gutterBottom>
                  Don’t wait in a line to enjoy your meal. Reserve a table in advance with us.
                </Typography>
                <TextField
                  label="Date"
                  type="date"
                  name="date"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  value={formData.date}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    inputProps: {
                      min: today, // Disable past dates
                    },
                  }}
                  error={errors.date}
                  helperText={errors.date ? 'Date is required' : ''}
                />
                <TextField
                  label="Time"
                  type="time"
                  name="time"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  value={formData.time}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={errors.time}
                  helperText={errors.time ? 'Time is required' : ''}
                />
                <Button onClick={handleReserveTable} variant="contained" color="primary" sx={{ mt: 2, alignSelf: 'center' }}>
                  Reserve Table
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>


      <Box sx={{ width: '100%', my: 8, px: 2 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Welcome to Fork&Spoon
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Here you can browse our menu, place orders, and enjoy a great dining experience.
          </Typography>
        </Box>
        </Box>

      {/* Feature Section */}
      <Box sx={{ my: 6, p: 4, backgroundColor: '#f7f7f7' }}>
        <Container>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
            Our Features
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Order Food Online
              </Typography>
              <Typography variant="body1">
                Browse our extensive menu and place orders directly from your table or from the comfort of your home.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Request a Table
              </Typography>
              <Typography variant="body1">
                Avoid the wait! Reserve your table in advance and arrive to a ready table, prepared just for you.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Check Order Status
              </Typography>
              <Typography variant="body1">
                Keep track of your order status, and receive real-time updates on your meal preparation and delivery.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

    </>
  );
};

export default App;
