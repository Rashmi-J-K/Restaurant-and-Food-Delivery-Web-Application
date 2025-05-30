import React, { useContext, useState } from 'react';
import { Box, Typography, Button, IconButton, AppBar, Toolbar, Badge, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../Images/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../GlobalContext';
import AuthModal from '../Auth/AuthModal';
import CartDrawer from './Cart/Cart';

export default function Nav() {
    const { token,setToken, handleAuthModalOpen, handleDrawerOpen, carts } = useContext(AuthContext);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    
  let navigate=useNavigate()
  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logout clicked");
    setToken(false);
    localStorage.removeItem("userToken")
    
  };


    const drawerList = (
        <Box
            sx={{ width: 250, }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
            
        >
<Box sx={{pl:1.5,my:2}}>
<img src={Logo} alt="Logo" style={{ height: '50px', marginRight: '1.2rem' }} />
                    <Typography variant="h6" sx={{ flexGrow: 0, marginRight: '5rem' }}>
                        Fork&Spoon
                    </Typography>
</Box>

            <List>
                <ListItem button component={Link} to="/">
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/menus">
                    <ListItemText primary="Menu" />
                </ListItem>
                <ListItem button component={Link} to="/table">
                    <ListItemText primary="Table" />
                </ListItem>
                <ListItem button component={Link} to="/status">
                    <ListItemText primary="Status" />
                </ListItem>
                <ListItem button component={Link} to="/aboutus">
                    <ListItemText primary="About Us" />
                </ListItem>
            </List>
            <Divider />
            <List>
                {token ? (
                    <>
                        {/* Placeholder for additional content when logged in */}
                    </>
                ) : (
                    <ListItem button onClick={handleAuthModalOpen}>
                        <AccountCircle sx={{ marginRight: '10px' }} />
                        <ListItemText primary="Login" />
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: 9000,
                    p: 0.5,
                    borderBottomLeftRadius: '28px',
                    borderBottomRightRadius: '28px',
                    backgroundColor: 'white',
                    boxShadow: '0 0 1px #1f1f1f',
                    color: '#1f1f1f',
                }}
            >
                <Toolbar>
                    <img src={Logo} alt="Logo" style={{ height: '50px', marginRight: '1.2rem' }} />
                    <Typography variant="h6" sx={{ flexGrow: 0, marginRight: '5rem' }}>
                        Fork&Spoon
                    </Typography>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, gap: 3, marginLeft: '10rem' }}>
                        <Button component={Link} to="/" variant="outlined">Home</Button>
                        <Button component={Link} to="/menus" variant="outlined">Menu</Button>
                        <Button component={Link} to="/table" variant="outlined">Table</Button>
                        <Button component={Link} to="/status" variant="outlined">Status</Button>
                        <Button component={Link} to="/aboutus" variant="outlined">About Us</Button>
                    </Box>

                    <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1, justifyContent: 'flex-end' }}>
                        <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)} sx={{zIndex:99999}}>
                        {drawerList}
                    </Drawer>

                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {token ? (
                            <>
                                <IconButton color="inherit" onClick={handleLogout}>
                                  
                                    <LogoutIcon />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <IconButton color="inherit" onClick={handleAuthModalOpen}>
                                    <Typography variant="h6" sx={{ fontSize: '15px', pr: '2px' }}>
                                        Login
                                        
                                    </Typography>
                                    <AccountCircle />
                                </IconButton>
                            </>
                        )}
                        <IconButton color="inherit" onClick={handleDrawerOpen}>
                            <Badge badgeContent={carts == [] ? 0 : carts?.length} color="secondary">
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <AuthModal />
            <CartDrawer />
        </>
    );
}
