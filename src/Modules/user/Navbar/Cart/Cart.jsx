import React, { useContext } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
  Button,
  CardMedia
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckoutModal from './Checkout';
import { AuthContext } from '../../../GlobalContext';
import axios from 'axios';

const CartDrawer = () => {
  const { setCheckoutModalOpen, drawerOpen, handleDrawerClose, carts, setCartCount, imagePath, host, setProceedDetail } = useContext(AuthContext);

  const handleCheckout = async () => {
    // Prepare proceedDetail from carts
    const items = carts?.map(item => ({
      productId: item.product._id,
      name: item.product.name,
      price: calculateDiscountedPrice(item.product.price, item.product.discount),
      image: item.product.image,
      quantity: item.quantity,
      total: calculateDiscountedPrice(item.product.price, item.product.discount) * item.quantity
    }));

    const totalAmount = calculateTotal();
    setProceedDetail({ items, totalAmount });
    await setCheckoutModalOpen(true);
  };

  const handleQuantityChange = async (item, qty, type) => {
    setCartCount(prev => prev + 1);
    let newQuantity = type === 'plus' ? qty + 1 : qty - 1;

    try {
      const CartId = item?._id;
      await axios.put(`${host}/api/user/updatecart/${CartId}`, { quantity: newQuantity });
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    return discount ? price - (price * (discount / 100)) : price;
  };

  const calculateSubtotal = () => {
    return carts?.reduce((acc, item) => acc + calculateDiscountedPrice(item.product.price, item.product.discount) * item.quantity, 0)?.toFixed(2);
  };

  const calculateDiscount = () => {
    // Total discount is sum of discounts for each item
    return carts?.reduce((acc, item) => {
      const discountedPrice = calculateDiscountedPrice(item.product.price, item.product.discount);
      const discountAmount = (item.product.price - discountedPrice) * item.quantity;
      return acc + discountAmount;
    }, 0)?.toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const discountAmount = parseFloat(calculateDiscount());
    return (subtotal - discountAmount).toFixed(2);
  };

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      sx={{ zIndex: 99999 }}
    >
      <Box
        sx={{
          width: 350,
          padding: 2,
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        role="presentation"
      >
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Cart</Typography>
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {carts?.length === 0 || carts == null ? (
              <ListItem>
                <ListItemText primary="Your cart is empty" />
              </ListItem>
            ) : (
              carts?.map((item, index) => (
                <ListItem key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <CardMedia
                      component="img"
                      image={`${imagePath}/${item?.product?.image}`}
                      alt={item?.product?.image}
                      sx={{ width: 80, height: 80, objectFit: 'cover', mr: 2 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1">{item?.product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{calculateDiscountedPrice(item?.product?.price, item?.product?.discount).toFixed(2)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <IconButton onClick={() => handleQuantityChange(item, item?.quantity, 'minus')}>
                          <RemoveIcon />
                        </IconButton>
                        <Typography variant="body1" sx={{ mx: 2 }}>
                          {item?.quantity}
                        </Typography>
                        <IconButton onClick={() => handleQuantityChange(item, item?.quantity, 'plus')}>
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ textAlign: 'right', flex: 1 }}>
                      ₹{(calculateDiscountedPrice(item?.product?.price, item?.product?.discount) * item?.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </ListItem>
              ))
            )}
          </List>
          {carts?.length > 0 && (
            <>
              <Divider sx={{ mt: 2 }} />
              <Box sx={{ mt: 2, textAlign: 'right', backgroundColor: '#ffdfcc', p: 2 }}>
                <Typography variant="h6">Subtotal: ₹{calculateSubtotal()}</Typography>
                <Typography variant="h6">Discount: -₹{calculateDiscount()}</Typography>
                <Typography variant="h6">Total: ₹{calculateTotal()}</Typography>
              </Box>
            </>
          )}
        </Box>
        {carts?.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ width: '80%' }}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </Box>
        )}
      </Box>
      <CheckoutModal />
    </Drawer>
  );
};

export default CartDrawer;
