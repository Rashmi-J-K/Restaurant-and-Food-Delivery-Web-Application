import { Box, TextField, Grid, Typography, IconButton, Modal, Fade, Backdrop, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, styled } from '@mui/material';
import React, { useState, useRef, useContext } from 'react';
import { tableCellClasses } from '@mui/material/TableCell';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import Hosts from '../../../../../config/Hosts';
import axios from 'axios';
import { AuthContext } from '../../../../GlobalContext';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "rgba(0, 0, 0, 0.87)",
        color: theme.palette.primary.contrastText,
        fontWeight: 'bold',
        fontSize: '0.875rem',
        textAlign: 'center',
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

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: 300, sm: 400 },
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
};

export default function ManageCategory() {
    const host = Hosts.host;
    const { dbcategory, deletedCategory, setDeleteCategory } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null); // Changed to null initially
    const [editingCategory, setEditingCategory] = useState(null);
    const [open, setOpen] = useState(false);
    const fileInputRef = useRef(null);

    // Function to handle image change
    const handleImage = (e) => {
        setImage(e.target.files[0]); // Store the file directly
    };

    // Function to handle title change
    const handletitleChange = (event) => setTitle(event.target.value);

    // Submit or update category
    const handleSubmit = async () => {
        const Data = new FormData();
        Data.append('title', title);
        if (image) {
            Data.append('image', image);
        }

        if (editingCategory) {
            axios.put(`${host}/api/admin/updateCategory/${editingCategory._id}`, Data)
                .then(async (res) => {
                    if (res.data) {
                        resetForm();
                        await setDeleteCategory(!deletedCategory);
                        toast.success('Category Updated Successfully');
                        handleClose();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    toast.error('Failed to update category');
                });
        } else {
            axios.post(`${host}/api/admin/insertcategory`, Data)
                .then((res) => {
                    if (res.data) {
                        resetForm();
                        setDeleteCategory(!deletedCategory);
                        toast.success('Category Added Successfully');
                    } else {
                        toast.error(res?.data?.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    toast.error('Failed to add category');
                });
        }
    };

    // Function to handle category deletion
    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this category',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#635bff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${host}/api/admin/deleteCategory/${id}`)
                    .then(() => {
                        setDeleteCategory(!deletedCategory);
                        Swal.fire('Deleted!', 'Category has been deleted.', 'success');
                    })
                    .catch((err) => {
                        console.log("Error : " + err);
                    });
            }
        });
    };

    // Function to handle category edit
    const handleEdit = (category) => {
        setEditingCategory(category);
        setTitle(category.title);
        setImage(null); // To avoid showing old image file
        setOpen(true);
    };

    // Function to reset form fields
    const resetForm = () => {
        setTitle('');
        setImage(null);
        fileInputRef.current.value = '';
    };

    // Function to close the modal
    const handleClose = () => {
        setOpen(false);
        setEditingCategory(null);
        resetForm();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Manage Categories
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
                Organize and update menu categories for better navigation. Add or modify categories to keep your menu well-structured.
            </Typography>

            <Box component={Paper} elevation={1} sx={{ p: 2, borderRadius: '10px', mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            variant='outlined'
                            onChange={handletitleChange}
                            name='title'
                            label="Category Title"
                            fullWidth
                            value={title}
                            InputProps={{ style: { borderRadius: '10px' } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            type='file'
                            variant='outlined'
                            onChange={handleImage}
                            name='image'
                            label="Category Image"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            inputRef={fileInputRef}
                        />
                    </Grid>
                    <Grid item xs={12} md={2} sx={{ alignSelf: 'center' }}>
                        <Button variant="contained" fullWidth onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table sx={{ minWidth: 700 }} aria-label="category table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>S.No</StyledTableCell>
                            <StyledTableCell>Category Image</StyledTableCell>
                            <StyledTableCell>Category Title</StyledTableCell>
                            <StyledTableCell>Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dbcategory.length === 0 && (
                            <TableRow>
                                <StyledTableCell colSpan={4} sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6">No categories found</Typography>
                                </StyledTableCell>
                            </TableRow>
                        )}
                        {dbcategory.map((category, index) => (
                            <StyledTableRow key={category._id}>
                                <StyledTableCell>{index + 1}</StyledTableCell>
                                <StyledTableCell>
                                    <img src={`http://localhost:8000/api/image/${category.image}`} alt={category.title} width={50} height={50} style={{ borderRadius: '5px' }} />
                                </StyledTableCell>
                                <StyledTableCell>{category.title}</StyledTableCell>
                                <StyledTableCell>
                                    <IconButton onClick={() => handleEdit(category)}>
                                        <ModeEditOutlineIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(category._id)}>
                                        <DeleteOutlineIcon color='error' />
                                    </IconButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
                sx={{ zIndex: 9999 }}
            >
                <Fade in={open}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" component="h2">
                            {editingCategory ? "Edit Category" : "Add Category"}
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            {editingCategory ? "Please edit the details of the category." : "Fill in the details to add a new category."}
                        </Typography>
                        <Box mt={2}>
                            <TextField
                                variant='outlined'
                                label="Category Title"
                                fullWidth
                                value={title}
                                onChange={handletitleChange}
                                InputProps={{ style: { borderRadius: '10px' } }}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                type='file'
                                variant='outlined'
                                label="Category Image"
                                fullWidth
                                onChange={handleImage}
                                InputLabelProps={{ shrink: true }}
                                inputRef={fileInputRef}
                            />
                            <Box mt={2}>
                                <Button variant="contained" onClick={handleSubmit}>
                                    {editingCategory ? "Update Category" : "Add Category"}
                                </Button>
                                <Button variant="outlined" onClick={handleClose} sx={{ ml: 2 }}>
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            <Toaster />
        </Box>
    );
}
