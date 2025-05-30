import React, { useContext, useState } from 'react';
import { Box, Tabs, Tab, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { AuthContext } from '../../../../GlobalContext';
import moment from 'moment';
import { Person, Email, Phone, Home } from '@mui/icons-material';

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

const OrderItem = ({ order, imagePath,online }) => {
  // Calculate the total amount for the order
  const totalAmount = order.products.reduce((acc, product) => acc + product.total, 0);

  return (
    <Box key={order._id} sx={{ mb: 2 }}>
      <ListItem
        sx={{
          border: '1px solid #ddd',
          borderRadius: '14px',
          padding: '16px',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexDirection: 'column' // Change layout to column to display total amount below
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 1.2, width: '100%' }}>
          {/* User Details Section with Icons */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Person fontSize="small" />
              {order.user.name || 'No name provided'}
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Email fontSize="small" />
              {order.user.email || 'No email provided'}
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Phone fontSize="small" />
              {order.user.phone || 'No phone provided'}
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Home fontSize="small" />
              {order.user.address || 'No address provided'}
            </Typography>
          </Box>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

          {/* Order Details Section with Fixed Size and Horizontal Scroll */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2, 
              overflowX: 'auto', 
              maxWidth: '600px', // Set a fixed width for the product container
              whiteSpace: 'nowrap' // Ensure that products are displayed in a single row
            }}
          >
            {order.products.map((product) => (
              <Box 
                key={product.productId} 
                sx={{ 
                  minWidth: '150px', // Increase the width for each product item
                  display: 'inline-block',
                  textAlign: 'center',
                  backgroundColor: '#fff', // Optional: add background color for the product card
                  borderRadius: '8px', // Optional: add border radius for the product card
                  padding: '10px', // Optional: add padding for the product card
                  paddingX:2,
                  my:1,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)' // Optional: add shadow for a card effect
                }}
              >
                <img
                  src={`${imagePath}/${product.image}`}
                  alt={product.name}
                  style={{ width: '100px', height: 'auto', borderRadius: '8px' }}
                />
                <ListItemText
                  primary={product.name}
                  secondary={`Qty: ${product.quantity} | Total: ₹${product.total}`}
                />
              </Box>
            ))}
          </Box>
        </Box>
       
        <Box sx={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-end',alignItems:'flex-end', m: 2 }}>
          {order?.transactionId&&(
            <Typography variant='p' sx={{ fontWeight: 400 }}>
            Transaction Id: {order?.transactionId}
          </Typography>
          )}
          <Typography variant='h6' sx={{ fontWeight: 500 }}>
            Total Amount: {order?.totalamount?.toFixed(2)||totalAmount} Rupees
          </Typography>
          
        </Box>
       
          {/* Date Section */}
          <Box sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
          {online&&(
              <Typography variant="body2" color="textSecondary">
              Payment made At: {moment(order?.updatedAt).format('MMM D, YYYY [at] h:mm A')}
            </Typography>
            )}
        </Box>
      </ListItem>
    </Box>  
  );
};

export default function Order() {
  const { onlinepay, offlinepay, imagePath } = useContext(AuthContext);
  
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <Typography variant="h5" color={"grey"} sx={{fontSize:'17px'}} gutterBottom>
        Manage your orders efficiently with summary metrics and quick filters. Export order data for detailed offline analysis.
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="Order Tabs">
        <Tab label="Online Payment" />
        <Tab label="Cash on Delivery" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Paper elevation={1} sx={{ padding: 2, mt: 2 }}>
          {onlinepay?.length > 0 ? (
            <List>
              {onlinepay.map(order => (
                <OrderItem 
                  key={order._id}
                  order={order}
                  imagePath={imagePath}
                  online={true}
                />
              ))}
            </List>
          ) : (
            <Typography>No online payment orders at the moment.</Typography>
          )}
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper elevation={1} sx={{ padding: 2, mt: 2 }}>
          {offlinepay?.length > 0 ? (
            <List>
              {offlinepay.map(order => (
                <OrderItem 
                  key={order._id}
                  order={order}
                  imagePath={imagePath}
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
