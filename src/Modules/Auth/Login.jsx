import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    Paper,
    Grid,
    Avatar,
    CssBaseline,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import config from '../../config/Hosts';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const nav=useNavigate();
    const host = config.host;
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear validation error when user starts typing
        setFormErrors({
            ...formErrors,
            [name]: '',
        });
    };

    const validateForm = () => {
        let valid = true;
        const errors = {
            email: '',
            password: '',
        };

        // Email validation
        if (!formData.email) {
            errors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
            valid = false;
        }
        // Password validation
        if (!formData.password) {
            errors.password = 'Password is required';
            valid = false;
        }
        setFormErrors(errors);
        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Process login logic here
            axios.post(`${host}/api/admin/login`, formData)
            .then((response) => {
              if (response.data.success === true) {
                localStorage.setItem("adminToken", JSON.stringify(response.data.token));
                // setCount(!count);
                toast.success('Login Successfully');
                setTimeout(async()=>{
                    await nav("/admin/");
                },1000)
              } else {
                // setOpen2(true);
                toast.error('Please Enter Valid Details');

              }
            })
            .catch((err) => {
              console.log("Error : " + err);
            });
            // Reset form data after submission
            setFormData({
                email: '',
                password: '',
            });
        } else {
            console.log('Form validation failed.');
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{py: 13,}}>
            <CssBaseline  />
            <Paper elevation={3} sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center',borderRadius:"18px" }}>
                <Avatar sx={{ m: 1, bgcolor: '#635bff!important' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                    Admin Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        // required
                        fullWidth
                        id="email"
                        label="Email Id"
                        name="email"
                        autoComplete="Email Id"
                        autoFocus
                        value={formData.email}
                        onChange={handleInputChange}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        margin="normal"
                        // required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mb: 2, }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Paper>
            <Toaster position="top-center" reverseOrder={false} />

        </Container>
    );
};

export default Login;
