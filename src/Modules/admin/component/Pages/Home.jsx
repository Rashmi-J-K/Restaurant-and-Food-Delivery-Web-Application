import React, { useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardHeader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, tableCellClasses } from '@mui/material';
import { AuthContext } from '../../../GlobalContext';
import moment from 'moment';
import { styled } from '@mui/system';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(0, 0, 0, 0.87)",
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '0.875rem',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '0.875rem',
    textAlign: 'center',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function Home() {
  const { orders, alluser, pendingreq, imagePath } = useContext(AuthContext);

  return (
    <Box sx={{ p: 3 }}>
      {/* Dashboard Header */}
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Cards Section */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card
            variant="outlined"
            sx={{
              p: 1.2,
              backgroundColor: 'white',
              boxShadow: '0 0 1px #1f1f1f',
              borderRadius: "20px"
            }}
          >
            <CardHeader title="Total Orders" subheader="Number of orders placed" />
            <CardContent>
              <Typography variant="h5" align="center">{orders?.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            variant="outlined"
            sx={{
              p: 1.2,
              backgroundColor: 'white',
              boxShadow: '0 0 1px #1f1f1f',
              borderRadius: "20px"
            }}
          >
            <CardHeader title="New Users" subheader="Number of users registered" />
            <CardContent>
              <Typography variant="h5" align="center">{alluser?.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pending Requests Section */}
      <Typography variant="h3" sx={{ fontWeight: 400 }} gutterBottom>
        Pending Requests
      </Typography>

      <Paper elevation={1} sx={{ padding: 2 }}>
        {pendingreq?.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Table</StyledTableCell>
                  <StyledTableCell>Product Details</StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Total Amount</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingreq.map((reservation) => {
                  const totalAmount = reservation.products.reduce((total, product) => total + product.price, 0);
                  return (
                    <StyledTableRow key={reservation._id}>
                      <StyledTableCell>{reservation?.table?.name}</StyledTableCell>
                      <StyledTableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            overflowX: 'auto',
                            whiteSpace: 'nowrap',
                            p: 1,
                            justifyContent: 'center',
                          }}
                        >
                          {reservation?.products.length === 0 ? (
                            <Typography variant="body2">No menu selected</Typography>
                          ) : (
                            <>
                              {reservation?.products?.slice(0, 2)?.map((product, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    display: 'inline-block',
                                    width: 100,
                                    mr: -2,
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    p: 1,
                                    backgroundColor: '#f9f9f9',
                                    textAlign: 'center',
                                  }}
                                >
                                  <img
                                    src={`${imagePath}/${product?.image}`}
                                    alt={product.name}
                                    style={{ width: 40, height: 40, borderRadius: '8px', marginBottom: '8px' }}
                                  />
                                  <Typography variant="body2" noWrap>{product.name}</Typography>
                                  <Typography variant="body2" noWrap>Status: {reservation.status}</Typography>
                                  <Typography variant="body2" noWrap>Price: {product.price} Rupees</Typography>
                                </Box>
                              ))}
                              {reservation.products.length > 2 && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'black',
                                    color: 'white',
                                    width: 40, height: 40, borderRadius: '8px', marginBottom: '8px',
                                    p: 1,
                                    minWidth: 100,
                                    height: 120,
                                  }}
                                >
                                  <Typography variant="body2">
                                    +{reservation.products.length - 2} more
                                  </Typography>
                                </Box>
                              )}
                            </>
                          )}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>{moment(reservation.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</StyledTableCell>
                      <StyledTableCell>{totalAmount ? `₹ ${totalAmount}` : "No Added any Menu"}</StyledTableCell>
                    </StyledTableRow>
                  );
                })}

              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography align="center">No pending reservations at the moment.</Typography>
        )}
      </Paper>
    </Box>
  );
}
