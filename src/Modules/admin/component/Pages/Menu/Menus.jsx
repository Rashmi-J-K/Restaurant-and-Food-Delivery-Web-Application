import { Box, TextField, Grid, Typography, IconButton, Button, Table, TableBody, TableContainer, TableHead, TableRow, Paper, styled } from '@mui/material';
import React, { useState, useContext } from 'react';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import theme from '../../../../../Theme/theme';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import { AuthContext } from '../../../../GlobalContext';
import Hosts from '../../../../../config/Hosts';
import axios from 'axios';

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

export default function ManageMenus() {
    const host = Hosts.host;
    const { products, deletedProduct, setDeleteProduct, setProductCount } = useContext(AuthContext);
    const [open1, setOpen1] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const handleOpen = () => setOpen1(true);

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this product',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#635bff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${host}/api/admin/deleteproduct/${id}`)
                    .then(() => {
                        setDeleteProduct(!deletedProduct);
                        toast.success('Product deleted successfully');
                    })
                    .catch((err) => {
                        console.error(err);
                        toast.error('Failed to delete product');
                    });
            }
        });
    };

    const handleEdit = (product) => {
        setEditingCategory(product);
        setEditOpen(true);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Manage Menus
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
                Easily oversee and update your restaurant's menu items. Add new dishes, adjust prices, and manage categories to keep your offerings fresh and appealing.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Add Product
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="product table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>S.No</StyledTableCell>
                            <StyledTableCell>Image</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Category</StyledTableCell>
                            <StyledTableCell>Price</StyledTableCell>
                            <StyledTableCell>Discount</StyledTableCell>
                            <StyledTableCell>Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products?.length === 0 && (
                            <TableRow>
                                <StyledTableCell colSpan={8}>No products found</StyledTableCell>
                            </TableRow>
                        )}
                        {products?.map((product,index) => (
                            <StyledTableRow key={product._id}>
                                  <StyledTableCell>{index+1}</StyledTableCell>
                                   <StyledTableCell>
                                    <img src={`http://localhost:8000/api/image/${product.image}`} alt={product.name} width={50} height={50} style={{ borderRadius: '5px' }} />
                                </StyledTableCell>
                                <StyledTableCell>{product.name}</StyledTableCell>
                                <StyledTableCell>{product.category.title}</StyledTableCell>
                             
                                <StyledTableCell>₹{product.price.toFixed(2)}</StyledTableCell>
                                <StyledTableCell>{product.discount}%</StyledTableCell>
                                <StyledTableCell>
                                    <IconButton onClick={() => handleEdit(product)}>
                                        <ModeEditOutlineIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(product._id)}>
                                        <DeleteOutlineIcon color="error" />
                                    </IconButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Toaster position="top-center" reverseOrder={false} />

            <AddProduct
                open={open1}
                setOpen={setOpen1}
                setCount={setProductCount}
            />

            <EditProduct
                open={editOpen}
                setOpen={setEditOpen}
                editingCategory={editingCategory}
                setCount={setProductCount}
            />
        </Box>
    );
}
