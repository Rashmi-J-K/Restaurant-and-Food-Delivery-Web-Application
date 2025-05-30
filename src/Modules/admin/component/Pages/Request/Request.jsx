import React, { useContext, useState } from 'react';
import { Box, Tabs, Tab, Typography, Button, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { AuthContext } from '../../../../GlobalContext';
import moment from 'moment';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Person, Email, Phone, Home } from '@mui/icons-material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// TabPanel Component
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
const ReservationItem = ({ reservation, imagePath, handleAction, isPending, isRejected, isAccepted }) => {
  return (
    <Box key={reservation._id} sx={{ mb: 2 }}>
      <ListItem
        sx={{
          border: '1px solid #ddd',
          borderRadius: '14px',
          padding: '16px',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ width: '100%', mb: 2, alignItems: 'center', p: 1 }}>
          <Typography variant="h5">
            {reservation?.table?.name}
          </Typography>
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1, mt: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person fontSize="small" />
              {reservation?.user?.name || 'No name provided'}
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email fontSize="small" />
              {reservation?.user?.email || 'No email provided'}
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone fontSize="small" />
              {reservation?.user?.phone || 'No phone provided'}
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Home fontSize="small" />
              {reservation?.user?.address || 'No address provided'}
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon fontSize="small" />
              Reservation Date: {moment(reservation?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
            </Typography>
          </Box>
        </Box>
        <Divider />

        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
          <Typography variant="h3" sx={{ fontSize: '18px' }}>
            Ordered Menus
          </Typography>
        </Box>

        <Box
          sx={{
            width: '100%',
            padding: 2,
            display: 'flex',
            alignItems: 'center',
            overflowX: 'auto',
            '::-webkit-scrollbar': {
              height: '5px',
            },
            '::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '15px',
            },
            '::-webkit-scrollbar-track': {
              backgroundColor: '#f9f9f9',
            },
          }}
        >
          {reservation.products.map((product, index) =>{
              // Calculate the discounted price
              const discountedPrice = product?.discount
              ? product?.price - (product?.price * (product?.discount / 100))
              : product?.price;
              
            return(
              <>
               <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2, flex: '0 0 auto', mr: 2 }}>
              <Box sx={{ mr: 2 }}>
                <img
                  src={`${imagePath}/${product.image}`}
                  alt={product.name}
                  style={{ width: 100, height: 100, borderRadius: '8px' }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <ListItemText
                  primary={product.name}
                  secondary={`Status: ${reservation.status} | Total: ${discountedPrice?.toFixed(2)} Rupees`}
                />
              </Box>
            </Box>
              </>
            )
          })}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-end',alignItems:'flex-end', m: 2 }}>
          {reservation?.transactionId&&(
            <Typography variant='p' sx={{ fontWeight: 400 }}>
            Transaction Id: {reservation?.transactionId}
          </Typography>
          )}
          <Typography variant='h6' sx={{ fontWeight: 500 }}>
            Total Amount: {reservation?.totalamount.toFixed(2)} Rupees
          </Typography>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          {isPending && (
            <>
              <Button
                variant="contained"
                sx={{ mr: 1, backgroundColor: 'green', color: 'white' }}
                onClick={() => handleAction(reservation._id, 'accept')}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: 'red', color: 'white' }}
                onClick={() => handleAction(reservation._id, 'reject')}
              >
                Reject
              </Button>
            </>
          )}

          {isRejected && (
            <>
              <Button
                variant="contained"
                sx={{ mr: 1, backgroundColor: 'green', color: 'white' }}
                onClick={() => handleAction(reservation._id, 'accept')}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: 'red', color: 'white' }}
                disabled
              >
                Rejected
              </Button>
            </>
          )}

          {isAccepted && (
            <>
              {!reservation.transactionId && (
                <Button
                  variant="contained"
                  sx={{ backgroundColor: 'red', color: 'white', mr: 1 }}
                  onClick={() => handleAction(reservation._id, 'reject')}
                >
                  Reject
                </Button>
              )}
              <Button
                variant="contained"
                sx={{ backgroundColor: 'green', color: 'white' }}
                disabled
              >
                {reservation.transactionId ? 'Paid the Amount Successfully' : 'Accepted'}
              </Button>
            </>
          )}
        </Box>
      </ListItem>
    </Box>
  );
};


// Main Reservation Component
export default function Reservation() {
  const { acceptedreq, rejreq, pendingreq, imagePath, host, setreqCount } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAction = async (reservationId, action) => {
    console.log(reservationId, "reservationId");
    const status = {
      status: action === 'accept' ? 'accepted' : 'rejected'
    };

    await axios.put(`${host}/api/admin/updateRequest/${reservationId}`, status)
      .then((res) => {
        if (res.data.status) {
          toast.success(`Reservation ${action}ed successfully`);
          setreqCount((prev) => prev + 1)
          // Update the state or refetch the reservations to reflect the change
        } else {
          throw new Error(`Failed to ${action} the reservation`);
        }
      })
      .catch((err) => {
        console.error('Error:', err.message);
        toast.error('An error occurred. Please try again.');
      });
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Requests
        </Typography>
        <Typography variant="h5" color={"grey"} sx={{ fontSize: '17px' }} gutterBottom>
          Track and manage incoming requests from users, including feedback and special inquiries. Use the filters to sort by request type and status, and address each request to ensure prompt and effective responses.
        </Typography>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="Reservation Tabs">
          <Tab label="Accepted" />
          <Tab label="Pending" />
          <Tab label="Rejected" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6">Accepted Reservations</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Here are the reservations that have been accepted.
          </Typography>
          <Paper elevation={1} sx={{ padding: 2, mt: 2 }}>
            {acceptedreq?.length > 0 ? (
              <List>
                {acceptedreq.map(reservation => (
                  <ReservationItem
                    key={reservation._id}
                    reservation={reservation}
                    imagePath={imagePath}
                    handleAction={handleAction}
                    isAccepted
                  />
                ))}
              </List>
            ) : (
              <Typography>No accepted reservations at the moment.</Typography>
            )}
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6">Pending Reservations</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            These are your pending reservations. Please wait for further updates.
          </Typography>
          <Paper elevation={1} sx={{ padding: 2, mt: 2 }}>
            {pendingreq?.length > 0 ? (
              <List>
                {pendingreq.map(reservation => (
                  <ReservationItem
                    key={reservation._id}
                    reservation={reservation}
                    imagePath={imagePath}
                    handleAction={handleAction}
                    isPending
                  />
                ))}
              </List>
            ) : (
              <Typography>No pending reservations at the moment.</Typography>
            )}
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6">Rejected Reservations</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Unfortunately, these reservations have been rejected. You can review the details below.
          </Typography>
          <Paper elevation={1} sx={{ padding: 2, mt: 2 }}>
            {rejreq?.length > 0 ? (
              <List>
                {rejreq.map(reservation => (
                  <ReservationItem
                    key={reservation._id}
                    reservation={reservation}
                    imagePath={imagePath}
                    handleAction={handleAction}
                    isRejected
                  />
                ))}
              </List>
            ) : (
              <Typography>No rejected reservations at the moment.</Typography>
            )}
          </Paper>
        </TabPanel>
      </Box>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
