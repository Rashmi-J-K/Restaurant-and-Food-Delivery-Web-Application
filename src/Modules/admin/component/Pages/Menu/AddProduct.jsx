import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Modal, TextField, Fade, Backdrop, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import Hosts from '../../../../../config/Hosts';
import toast, { Toaster } from 'react-hot-toast';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '65%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '30px',
    boxShadow: 1,
    p: 6,
};

const AddProduct = ({ open, setOpen,setCount }) => {
    const host = Hosts.host;
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        discount: '',
    });
    const [productCategory, setProductCategory] = useState({ id: '', name: '' });
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get(`${host}/api/admin/getcategory`)
            .then((res) => {
                if (res.data) {
                    setCategories(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleClose = () => {
        setOpen(false);
        setError('');
        setNewProduct({
            name: '',
            price: '',
            description: '',
            discount: '',
        });
        setProductCategory({ id: '', name: '' });
        setImage(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        const selectedCategory = categories.find(cat => cat._id === selectedCategoryId);
        setProductCategory({
            id: selectedCategoryId,
            name: selectedCategory ? selectedCategory.title : ''
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSave = async () => {
        const { name, price, description, discount } = newProduct;
        const { id: categoryId } = productCategory;
        // Validate inputs
        if (!name || name.length > 20) {
            setError('Product name must be below 20 characters');
            return;
        }
        if (!price || isNaN(price) || price <= 0) {
            setError('Price must be a positive number');
            return;
        }
        if (!categoryId) {
            setError('Please select a category');
            return;
        }

        try {
            // Clear any previous error
            setError('');
            // Prepare form data for image upload
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('description', description);
            formData.append('discount', discount);
            formData.append('category', categoryId);
            if (image) {
                formData.append('image', image);
            }

            const response = await axios.post(`${host}/api/admin/addproduct`, formData);

            // Handle response and update state
            if (response.data.status) {
                toast.success('Product Added Successfully');
               setCount((prev)=>prev+1)
                handleClose();
            } else {
                toast.error(response.data.message);
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Modal
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 1000,
                    }}
                >
                    <Fade in={open}>
                        <Box sx={style}>
                            <Typography variant="h6" component="h2">
                                Add Product
                            </Typography>
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            <TextField
                                label="Name"
                                name="name"
                                fullWidth
                                value={newProduct.name}
                                onChange={handleChange}
                                margin="normal"
                            />
                            <TextField
                                label="Price"
                                name="price"
                                fullWidth
                                value={newProduct.price}
                                onChange={handleChange}
                                margin="normal"
                                type="number"
                            />
                            <TextField
                                label="Discount (%)"
                                name="discount"
                                fullWidth
                                value={newProduct.discount}
                                onChange={handleChange}
                                margin="normal"
                                type="number"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={productCategory.id}
                                    onChange={handleCategoryChange}
                                    label="Category"
                                >
                                    {categories.length === 0 ? (
                                        <MenuItem disabled>No categories available</MenuItem>
                                    ) : (
                                        categories.map(cat => (
                                            <MenuItem key={cat._id} value={cat._id}>
                                                {cat.title}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                            <TextField
                                type="file"
                                accept="image/*"
                                hidden
                                fullWidth
                                onChange={handleImageChange}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                fullWidth
                                multiline
                                rows={2}
                                value={newProduct.description}
                                onChange={handleChange}
                                margin="normal"
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2, borderRadius: '10px' }}
                                onClick={handleSave}
                                fullWidth
                            >
                                Save
                            </Button>
                        </Box>
                    </Fade>
                </Modal>
            </Box>

            <Toaster position="top-center" reverseOrder={true} />

        </Box>
    );
};

export default AddProduct;
