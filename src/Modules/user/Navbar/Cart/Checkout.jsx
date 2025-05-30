import React, { useContext, useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Backdrop
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../../../GlobalContext';
import Swal from 'sweetalert2';
import axios from 'axios';
import scanner from "../../Images/Scanner.png"

const CheckoutModal = ({ }) => {
    const { checkoutModalOpen, setCheckoutModalOpen, handleDrawerClose, setCartCount, host, user, proceedDetail, setProceedDetail, selectedProductItem } = useContext(AuthContext);
    const onClose = () => {
        setCheckoutModalOpen(false);
    }

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: ''
    });


    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.phone) {  
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be exactly 10 digits';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateDiscountedPrice = (item) => {
        if (item.discount) {
            return (item.price - (item.price * item.discount / 100)).toFixed(2);
        }
        if (item.discount) {
            return (item.price - item.discount).toFixed(2);
        }
        return item.price.toFixed(2); // No discount applied
    };

    const handleOrder = (status, method,transactionId) => {
        console.log(transactionId,'transactionId');
        
        let selectedProduct = [{
            productId: selectedProductItem?._id,
            name: selectedProductItem?.name,
            price: selectedProductItem?.price,
            quantity: 1,
            total: calculateDiscountedPrice(selectedProductItem), // Apply discount here
            image: selectedProductItem?.image,
        }]

        const Data = {
            status,
            products: proceedDetail?.items || selectedProduct,
            user: user?._id,
            formData: formData,
            totalamount: proceedDetail?.totalAmount,
            method: method,
            transactionId:transactionId

        };

        axios.post(`${host}/api/user/insertorder`, Data)
            .then((res) => {
                if (res.data.status) {
                    onClose()
                    console.log(res.data.message);
                    setFormData({})
                    setProceedDetail({})
                    setCartCount((prev) => prev + 1)
                    handleDrawerClose()
                }
            })
            .catch((err) => {
                console.log(err);
            });


    };


    const handlePayment = () => {
        if (validate()) {
            setCheckoutModalOpen(false)
            Swal.fire({
                title: 'Choose Payment Method',
                text: `Total Amount: ${proceedDetail?.totalAmount || calculateDiscountedPrice(selectedProductItem)}`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Pay Online',
                cancelButtonText: 'Cash on Delivery',
                showDenyButton: true,
                denyButtonText: 'Cancel',
                allowOutsideClick: true,
                customClass: {
                    container: 'custom-swal-container',
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    // Show default image for online payment
                    Swal.fire({
                        title: 'Scan the QR Code',
                        html: `
            <div style="display: flex; justify-content: center; align-items: center;">
                <img src="${scanner}" alt="QR Code" style="width:50%; height:50%; margin:auto;">
            </div>
            <input type="text" id="transactionId" class="swal2-input" placeholder="Enter Transaction ID">
        `,
                        showCancelButton: true,
                        showConfirmButton: true,
                        confirmButtonText: 'Proceed to QR Code',
                        cancelButtonText: 'Cancel',
                        preConfirm: () => {
                            const transactionId = Swal.getPopup().querySelector('#transactionId').value;
                            if (!transactionId) {
                                Swal.showValidationMessage('Transaction ID is required');
                                return false;
                            } else if (transactionId.length < 6) {
                                Swal.showValidationMessage('Transaction ID must be at least 6 characters long');
                                return false;
                            }
                            return transactionId;
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Handle online payment
                            Swal.fire('Paid Online', 'Your payment has been processed!', 'success');
                            handleOrder('completed', "online", result.value);
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            Swal.fire('Cancelled', 'Try Next time', 'info');
                        }
                    });
                } else if (result.isDenied) {
                    // Handle pay at restaurant
                    Swal.fire('Cancelled', 'Try Next time', 'info');
                    onClose();
                    setFormData({});
                    setProceedDetail({});
                    handleDrawerClose();
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // Handle cash on delivery
                    Swal.fire('Cash on Delivery', 'You can pay when the order is delivered.', 'info');
                    handleOrder('pending', "cash on delivery");
                }
            });
        }
    };
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <Modal
                open={checkoutModalOpen}
                onClose={onClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 1000,
                }}
                sx={{ zIndex: 99999 }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 8,
                        boxShadow: 24,
                        p: 4
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Checkout</Typography>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        error={!!errors.address}
                        helperText={errors.address}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handlePayment}
                    >
                        Pay
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default CheckoutModal;
