import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Typography, Container, Paper } from '@mui/material';
import Order from './Order/Order';
import Reserve from './Reserve/Reserve';
import { AuthContext } from '../../../GlobalContext';

export default function Status() {
  const [category, setCategory] = useState('Order');
  const {handleAuthModalOpen,token}=useContext(AuthContext)
  useEffect(()=>{
    if(token==null){
      handleAuthModalOpen()
    }
  },[])

  return (
    <Container maxWidth="lg" sx={{ mt: 15 }}>
      <Paper elevation={0} sx={{ padding: 3, mb: 4 }}>
        <Typography variant="h4" align="center" color="black" gutterBottom>
          Welcome to Your Order and Reservation Status
        </Typography>
        <Typography variant="body1" align="center">
          Here you can find all the details about your orders and reservations. Easily navigate between your accepted and rejected statuses for both orders and reservations. Stay up to date with everything in one place!
        </Typography>
      </Paper>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h4" gutterBottom>
          Status
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2, mt: 5 }}>
          <Button 
            variant={category === 'Order' ? 'contained' : 'outlined'} 
            onClick={() => setCategory('Order')}
            sx={{ mr: 1 }}
          >
            Order
          </Button>
          <Button 
            variant={category === 'Reserve' ? 'contained' : 'outlined'} 
            onClick={() => setCategory('Reserve')}
          >
            Reserve
          </Button>
        </Box>
        <Box>
          {category === 'Order' && <Order />}
          {category === 'Reserve' && <Reserve />}
        </Box>
      </Box>
    </Container>
  );
}
