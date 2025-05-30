import React, { useContext, useState } from 'react';
import { Box, Tabs, Tab, Typography, TextField, Button, Paper, List, ListItem, ListItemText } from '@mui/material';
import { AuthContext } from '../../../../GlobalContext';
import moment from 'moment';
import axios from 'axios';
import toast from 'react-hot-toast';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

const OrderItem = ({ order, imagePath, handleShowFeedbackInput, showFeedbackInput, currentOrderId, feedbacks, handleFeedbackChange, handleSubmitFeedback }) => (
  <Box key={order._id} sx={{ mb: 2 }}>
    <ListItem
      sx={{
        border: '1px solid #ddd', // Light gray border
        borderRadius: '14px', // Rounded corners
        padding: '16px', // Padding around the content
        backgroundColor: '#f9f9f9', // Light background color
        display: 'flex', // Ensure items are aligned in a row
        alignItems: 'center' // Center align items vertically
      }}
    >
      {/* Display Product Image */}
      <Box sx={{ mr: 2 }}>
        <img
          src={`${imagePath}/${order?.products[0]?.image}`} // URL of the product image
          alt={order?.products[0]?.name}
          style={{ width: '100px', height: 'auto', borderRadius: '8px' }} // Adjust size and styling as needed
        />
      </Box>

      <Box sx={{ flex: 1 }}>
        <ListItemText
          primary={order?.products[0]?.name} // Product name
          secondary={`Status: ${order.status} | Quantity: ${order?.products[0]?.quantity} | Total: ${order?.products[0]?.total} USD`} // Additional details
        />
        <ListItemText
          secondary={`Order Date: ${moment(order.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`} // Display order date
        />
      </Box>

      <Box sx={{ ml: 2 }}>
        <Button
          variant="outlined"
          onClick={() => handleShowFeedbackInput(order._id)}
          sx={{
            border: '1px solid #ddd', // Light gray border
            borderRadius: '8px', // Rounded corners
            padding: '8px 16px', // Padding around the button text
          }}
        >
          Provide Feedback
        </Button>
      </Box>
    </ListItem>

    {showFeedbackInput && currentOrderId === order._id && (
      <Box sx={{ mt: 2, padding: '16px', border: '1px solid #ddd', borderRadius: '14px', backgroundColor: '#f9f9f9' }}>
        <TextField
          label="Your Feedback"
          variant="outlined"
          multiline
          rows={2}
          value={feedbacks[order._id] || ''}
          onChange={handleFeedbackChange}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleSubmitFeedback}
          sx={{ mt: 2, borderRadius: '8px' }}
          fullWidth
        >
          Submit Feedback
        </Button>
      </Box>
    )}
  </Box>
);

export default function Order() {
  const { useronlinepay, userofflinepay, imagePath,host } = useContext(AuthContext)
  const [tabValue, setTabValue] = useState(0); // Tab for payment methods
  const [feedbacks, setFeedbacks] = useState({});
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFeedbackChange = (event) => {
    setFeedbacks({
      ...feedbacks,
      [currentOrderId]: event.target.value
    });
  };


  const handleSubmitFeedback = () => {
    const data = {
      message: feedbacks[currentOrderId]
    };
    axios.put(`${host}/api/user/updateorder/${currentOrderId}`,data)
      .then((res) => {
        if (res.data.status) {
          toast.success('Feedback submitted successfully');
        } else {
          throw new Error('Feedback submission failed');
        }
      })
      .then((updateRes) => {
        console.log('Order updated successfully:', updateRes.data);
      })
      .catch((err) => {
        console.error('Error:', err.message);
      })
      .finally(() => {
        setFeedbacks({
          ...feedbacks,
          [currentOrderId]: ''
        });
        setShowFeedbackInput(false);
        console.log(feedbacks);
      });
  };
  
  

  const handleShowFeedbackInput = (orderId) => {
    setCurrentOrderId(orderId);
    setShowFeedbackInput(true);
  };

  return (
    <Box>
      {/* Main Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="Order Tabs">
        <Tab label="Online Payment" />
        <Tab label="Cash on Delivery" />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        {/* Online Payment Orders */}
        <Typography variant="h6">Online Payment Orders</Typography>
        <Paper elevation={1} sx={{ padding: 2, mt: 2 }}>
          {useronlinepay?.length > 0 ? (
            <List>
              {useronlinepay?.map(order => (
                <OrderItem 
                  key={order._id}
                  order={order}
                  imagePath={imagePath}
                  handleShowFeedbackInput={handleShowFeedbackInput}
                  showFeedbackInput={showFeedbackInput}
                  currentOrderId={currentOrderId}
                  feedbacks={feedbacks}
                  handleFeedbackChange={handleFeedbackChange}
                  handleSubmitFeedback={handleSubmitFeedback}
                />
              ))}
            </List>
          ) : (
            <Typography>No online payment orders at the moment.</Typography>
          )}
        </Paper>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {/* Cash on Delivery Orders */}
        <Typography variant="h6">Cash on Delivery Orders</Typography>
        <Paper elevation={1} sx={{ padding: 2, mt: 2 }}>
          {userofflinepay?.length > 0 ? (
            <List>
              {userofflinepay?.map(order => (
                <OrderItem 
                  key={order._id}
                  order={order}
                  imagePath={imagePath}
                  handleShowFeedbackInput={handleShowFeedbackInput}
                  showFeedbackInput={showFeedbackInput}
                  currentOrderId={currentOrderId}
                  feedbacks={feedbacks}
                  handleFeedbackChange={handleFeedbackChange}
                  handleSubmitFeedback={handleSubmitFeedback}
                />
              ))}
            </List>
          ) : (
            <Typography>No cash on delivery orders at the moment.</Typography>
          )}
        </Paper>
      </TabPanel>
    </Box>
  );
}
