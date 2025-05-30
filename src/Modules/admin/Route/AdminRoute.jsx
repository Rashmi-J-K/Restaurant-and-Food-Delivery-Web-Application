import React, { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Navigation from '../component/Nav/Navigation'
import Box from '@mui/material/Box';
import Home from '../component/Pages/Home';
import { styled, useTheme } from '@mui/material/styles';
import '../css/Style.css'
import CssBaseline from '@mui/material/CssBaseline';
import Tables from '../component/Pages/Table/MainTable';
import Menus from '../component/Pages/Menu/Menus';
import Category from '../component/Pages/Category/Category';
import Login from '../../Auth/Login';
import Request from '../component/Pages/Request/Request';
import Order from '../component/Pages/Order/Order';
import User from '../component/Pages/Users/User';

export default function AdminRoute() {

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));

    const navigate = useNavigate();
    const location = useLocation();
    const currentRoute = location.pathname;

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('adminToken')) == null) {
            navigate('/admin/login')
        }
    }, [])
    
    return (
            <Box sx={{ display: 'flex' }}>
                {currentRoute.includes('/admin/login') ? (
                        <Routes>
                            <Route exact path="/login" element={<Login />} />
                        </Routes>
                )
                    :
                    (
                        <>
                            <CssBaseline />
                            <Navigation />
                            <Box component="main" sx={{
                                flexGrow: 1, p: 3,
                                minHeight: '100vh'
                            }}>
                                <DrawerHeader />
                                <Routes>
                                    <Route exact path="/" element={<Home />} />
                                    <Route exact path="/table" element={<Tables />} />
                                    <Route exact path="/menus" element={<Menus />} />
                                    <Route exact path="/category" element={<Category />} />
                                    <Route exact path="/request" element={<Request />} />
                                    <Route exact path="/order" element={<Order />} />
                                    <Route exact path="/users" element={<User />} />
                                </Routes>
                            </Box>
                        </>
                    )
                }



            </Box>
    )
}
