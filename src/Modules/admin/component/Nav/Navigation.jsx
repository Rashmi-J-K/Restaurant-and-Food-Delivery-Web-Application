import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TableBarIcon from '@mui/icons-material/TableBar';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CategoryIcon from '@mui/icons-material/Category';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Divider, Button } from '@mui/material';
import LogoutIcon from "@mui/icons-material/Logout";



const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function Navigation() {
  const theme = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    const currentRoute = location.pathname;
    if (currentRoute.includes('/admin/table')) {
      setActiveItem('Table');
    } else if (currentRoute.includes('/admin/users')) {
      setActiveItem('Users');
    } else if (currentRoute.includes('/admin/category')) {
      setActiveItem('Category');

    } else if (currentRoute.includes('/admin/order')) {
      setActiveItem('Order');
    } else if (currentRoute.includes('/admin/category')) {
      setActiveItem('Category');
    } else if (currentRoute.includes('/admin/menus')) {
      setActiveItem('Menus');
    } else if (currentRoute.includes('/admin/request')) {
      setActiveItem('Request');
    } else if (currentRoute.includes('/admin')) {
      setActiveItem('Dashboard');
    } else {
      setActiveItem('');
    }
  }, [location.pathname]);

  const sideBarList = [
    { title: 'Dashboard', path: '/admin/', icon: <DashboardIcon sx={{ fontSize: '20px' }} /> },
    { title: 'Table', path: '/admin/table', icon: <TableBarIcon sx={{ fontSize: '20px' }} /> },
    { title: 'Category', path: '/admin/category', icon: <CategoryIcon sx={{ fontSize: '20px' }} /> },
    { title: 'Menus', path: '/admin/menus', icon: <MenuBookIcon sx={{ fontSize: '20px' }} /> },
    { title: 'Order', path: '/admin/order', icon: <ReceiptLongIcon sx={{ fontSize: '20px' }} /> },
    { title: 'Request', path: '/admin/request', icon: <GroupAddIcon sx={{ fontSize: '20px' }} /> },
    { title: 'User', path: '/admin/users', icon: <PersonIcon sx={{ fontSize: '20px' }} /> },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  let navigate=useNavigate()
  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logout clicked");
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  };
  
  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: '#1c2536' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}
          <IconButton color="inherit" 
          onClick={handleLogout}
          >
            <LogoutIcon  /> 
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Box className="sidebar-body" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <DrawerHeader sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', paddingLeft: '5px' }}>
              <RestaurantMenuIcon sx={{ fontSize: '29px', color: '#8a94a6' }} />
              <Typography sx={{ pl: 1 }}>Fork&Spoon</Typography>
            </Box>
            <IconButton onClick={handleDrawerClose} sx={{ color: '#8a94a6' }}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider sx={{ backgroundColor: '#8a94a6' }} />
          <List sx={{ p: 0.5, flexGrow: 1 }}>
            {sideBarList.map((item) => (
              <ListItem key={item.title} disablePadding sx={{ display: 'block' }}>
                <Link to={item.path} style={{ textDecoration: 'none', color: '#8a94a6' }}>
                  <ListItemButton
                    className={`sidebar-list ${activeItem === item.title ? 'active' : ''}`}
                    sx={{
                      minHeight: 48,
                      borderRadius: 2.5,
                      mt: 0.5,
                      mb: 0.5,
                      justifyContent: open ? 'initial' : 'center',
                      px: 1.5,
                      backgroundColor: activeItem === item.title ? "#635bff" : 'transparent',
                      color: activeItem === item.title ? 'white' : '#8a94a6',
                      transition: 'background-color 0.3s ease, color 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#323847',
                        color: 'inherit',
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: 'inherit',
                        padding: '4px',
                        fontSize: '8px',
                        borderRadius: '3px',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}

                      sx={{
                        opacity: open ? 1 : 0,
                        '.MuiTypography-root': {
                          color: '#cfcfca',
                          fontSize: '14px',
                        }
                      }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ backgroundColor: '#8a94a6' }} />
          {/* {open && (
            <Box sx={{ textAlign: 'center', p: 2, display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" sx={{ color: '#8a94a6' }}>
                Need more feature content
              </Typography>
              <Button variant="contained" sx={{ mt: 1, backgroundColor: '#635bff' }}>
                Request
              </Button>
            </Box>
          )} */}
        </Box>
      </Drawer>
    </>
  );
}
