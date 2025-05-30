import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Home from '../../user/Pages/Home/Home';
import Menus from '../../user/Pages/Menus/Menus';
import Footer from '../../user/Footer/Footer';
import Nav from '../../user/Navbar/Nav';
import Loader from '../../components/Loader.jsx'; // Adjust the path as necessary
import { Toaster } from 'react-hot-toast';
import UserMainTable from '../../user/Pages/Tables/UserMainTable.jsx';
import Status from '../../user/Pages/Status/Status.jsx';
import AboutUs from '../../user/Pages/AboutUs/AboutUs.jsx';

export default function UserRoute() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const currentRoute = location.pathname;

  useEffect(() => {
    // Show loader during route transition
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500); // Simulate loading delay

    return () => clearTimeout(timer);
  }, [location]);

  // Determine whether to display footer based on current route
  const shouldDisplayFooter = !currentRoute.includes('/login') && !currentRoute.includes('/register');
  // Determine whether to display BottomNavBar based on current route
  const shouldDisplayBottomNavBar = !currentRoute.includes('/login') && !currentRoute.includes('/register');

  return (
    <div>
      <CssBaseline />
      <Box sx={{ backgroundColor: 'white' }}>
        <Nav />
        {loading ? (
          <Loader />
        ) : (
          <>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/table" element={<UserMainTable />} />
              <Route exact path="/menus" element={<Menus />} />
              <Route exact path="/status" element={<Status />} />
              <Route exact path="/aboutus" element={<AboutUs />} />
            </Routes>
            {shouldDisplayFooter && <Footer />}
          </>
        )}
      </Box>
      {/* {shouldDisplayBottomNavBar && <BottomNavBar token={token}/>} */}
    </div>
  );
}
