import React from 'react';
import {
  Box,
  Typography,
  Modal,
  Fade,
  Backdrop,
  CardMedia,
  Button,
  IconButton,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { green, red } from '@mui/material/colors';

const FoodCard = ({ open, handleClose, productItem, handleBuy, handleAddToCart, message, fromTable }) => {
  // Calculate the discounted price
  const discountedPrice = productItem?.discount
    ? productItem?.price - (productItem?.price * (productItem?.discount / 100))
    : productItem?.price;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      sx={{ zIndex: 9999 }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 800,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {/* Close Icon */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1000,
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Image Section */}
          <Box sx={{ flexShrink: 0, width: '40%' }}>
            <CardMedia
              component="img"
              height="300"
              image={`http://localhost:8000/api/image/${productItem?.image}`}
              alt={productItem?.name}
              sx={{ borderRadius: '10px', width: '100%' }}
            />
          </Box>

          {/* Content Section */}
          <Box sx={{ flexGrow: 1, ml: 2 }}>
            <Typography
              gutterBottom
              variant="h5"
              sx={{
                color: message?.type === 'success' ? green[600] : red[600],
                fontSize: '17px',
                textAlign: 'center',
                mb: 2,
              }}
            >
              {message?.message}
            </Typography>
            <Typography gutterBottom variant="h4" sx={{ mb: 1 }}>
              {productItem?.name}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography gutterBottom variant="h6" color={productItem?.category?.title === "veg" ? "green" : 'red'}>
              {productItem?.category?.title}
            </Typography>
            <Typography gutterBottom variant="h5" color="grey" sx={{ fontSize: '15px' }}>
              {productItem?.description}
            </Typography>

            {/* Discount and Price */}
            {productItem?.discount ? (
              <>
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ textDecoration: 'line-through' }}
                >
                  ₹{productItem?.price?.toFixed(2)}
                </Typography>
                <Typography
                  variant="body2"
                color="green">
                  Discount: {productItem?.discount}%
                </Typography>
                <Typography variant="h6" color="green">
                  Price: ₹{discountedPrice?.toFixed(2)}
                </Typography>
              </>
            ) : (
              <Typography variant="h6" color="green">
                Price: ₹{productItem?.price?.toFixed(2)}
              </Typography>
            )}

            {!fromTable && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  mt: 2,
                  width: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                <Button variant="contained" color="secondary" onClick={() => handleAddToCart(productItem)}>
                  Add to Cart
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleBuy(productItem)}>
                  Buy
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default FoodCard;
