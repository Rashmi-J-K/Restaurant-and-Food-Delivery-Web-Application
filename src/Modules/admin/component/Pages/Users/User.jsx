import { Box, Typography, IconButton, Button, Table, TableBody, TableContainer, TableHead, TableRow, Paper, styled } from '@mui/material';
import React, { useState, useContext } from 'react';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
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

export default function ManageUsers() {
    const host = Hosts.host;
    const { alluser, } = useContext(AuthContext);  // Adjust the context as necessary
    const [editOpen, setEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);


    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Manage Users
            </Typography>
            <Typography variant="h5" color={"grey"} sx={{ fontSize: '17px', mb: 5 }} gutterBottom>
                Manage all users from this interface. You can view user details including name, phone, address, and email.
            </Typography>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="user table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>S.No</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Phone</StyledTableCell>
                            <StyledTableCell>Address</StyledTableCell>
                            <StyledTableCell>Email</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {alluser?.length === 0 && (
                            <TableRow>
                                <StyledTableCell colSpan={5}>No users found</StyledTableCell>
                            </TableRow>
                        )}
                        {alluser?.map((user,index) => (
                            <StyledTableRow key={user?._id}>
                                <StyledTableCell>{index+1}</StyledTableCell>
                                <StyledTableCell>{user?.name}</StyledTableCell>
                                <StyledTableCell>{user?.phone}</StyledTableCell>
                                <StyledTableCell>{user?.address}</StyledTableCell>
                                <StyledTableCell>{user?.email}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Toaster position="top-center" reverseOrder={false} />

        </Box>
    );
}
