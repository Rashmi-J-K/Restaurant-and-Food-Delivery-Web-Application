// src/contexts/AuthContext.js

import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';
import Hosts from '../config/Hosts';
import moment from 'moment';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const host = Hosts.host;
    const imagePath = `http://localhost:8000/api/image/`;

    const [token, setToken] = useState(false);
    const [authModal, setAuthModal] = React.useState(false);
    const [checkoutModalOpen, setCheckoutModalOpen] = React.useState(false);

    const [tables, setTables] = useState([]);

    const handleAuthModalOpen = () => {
        if (token == false) {
            setAuthModal(true);
        }
    };
    const handleAuthModalClose = () => {
        setAuthModal(false);
    };


    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };
    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const [openuserTable, setOpenuserTable] = useState(false);
    const handleOpenUserTable = () => setOpenuserTable(true);
    const handleCloseUserTable = () => setOpenuserTable(false);

    useEffect(() => {
        const userToken = JSON.parse(localStorage.getItem('userToken'));
        if (userToken) {
            setToken(true);
        } else {
            setToken(false);
        }
    }, [handleAuthModalClose]);


    // Get All Table

    useEffect(() => {
        axios.get(`${host}/api/admin/gettable`)
            .then((res) => {
                if (res?.data?.status) {
                    setTables(res?.data?.table);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // Get All Category
    const [dbcategory, setDbCategory] = useState([]);
    const [deletedCategory, setDeleteCategory] = useState(false);



    useEffect(() => {
        axios.get(`${host}/api/admin/getcategory`)
            .then((res) => {
                if (res.data) {
                    setDbCategory(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [deletedCategory]);

    // Product 
    const [products, setProducts] = useState([]);
    const [deletedProduct, setDeleteProduct] = useState(false);
    const [productCount, setProductCount] = useState(0);


    useEffect(() => {
        axios.get(`${host}/api/admin/getproduct`)
            .then((res) => {
                if (res.data?.status) {
                    setProducts(res.data?.products);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [deletedProduct, productCount]);

    // Carts
    const [carts, setCarts] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('userToken')); // or wherever you're storing the token
        axios.get(`${host}/api/user/getCartById`, {
            headers: {
                'auth-token': token
            }
        })
            .then((res) => {
                setCarts(res?.data?.carts);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [cartCount]);

    // User
    const [user, setUser] = useState({})
    const [loggedCount, setLoggedCount] = useState(0)
    useEffect(() => {
        const tokensss = JSON.parse(localStorage.getItem('userToken'));
        axios.get(`${host}/api/user/get-single-user`, { headers: { 'auth-token': tokensss } })
            .then((res) => {
                setUser(res.data)
            })
            .catch((err) => {
                console.log("Error : " + err);
            })
    }, [loggedCount])

    const [proceedDetail, setProceedDetail] = useState({})
    const [cartOpen, setCartOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);

    // Initialize state with empty arrays
    const [pendingreq, setPendingRequest] = useState([]);
    const [acceptedreq, setAcceptedRequest] = useState([]);
    const [rejreq, setRejectedRequest] = useState([]);

    const [singleusereq, setSingleUserRequest] = useState([]);
    const [userpendingreq, setUserPendingRequest] = useState([]);
    const [useracceptedreq, setUserAcceptedRequest] = useState([]);
    const [userrejreq, setUserRejectedRequest] = useState([]);

    const [allreq, setAllRequest] = useState([]);
    const [reqCount, setreqCount] = useState(0);

    useEffect(() => {
        axios.get(`${host}/api/user/getRequests`)
            .then((res) => {
                // Set state with the fetched data
                setAllRequest(res?.data?.allreq || []);
                setPendingRequest(res?.data?.pendingreq || []);
                setAcceptedRequest(res?.data?.acceptedreq || []);
                setRejectedRequest(res?.data?.rejectedreq || []);
            })
            .catch((err) => {
                // Handle errors here
                console.error('Error fetching requests:', err.message);
            });
        const token = JSON.parse(localStorage.getItem('userToken')); // or wherever you're storing the token
        axios.get(`${host}/api/user/getRequestsByUserId`, {
            headers: {
                'auth-token': token
            }
        })
            .then((res) => {
                // Set state with the fetched data
                setSingleUserRequest(res?.data?.allreq || []);
                setUserPendingRequest(res?.data?.pendingreq || []);
                setUserAcceptedRequest(res?.data?.acceptedreq || []);
                setUserRejectedRequest(res?.data?.rejectedreq || []);
            })
            .catch((err) => {
                // Handle errors here
                console.error('Error fetching requests:', err.message);
            });

    }, [reqCount]); // Empty dependency array ensures this runs only once after initial render

    const [selectedProductItem, setSelectedProductItem] = useState(null);

    // Initialize state with empty arrays
    const [onlinepay, setOnlinePay] = useState([]);
    const [offlinepay, setOfflinePay] = useState([]);
    const [orders, setOrders] = useState([]);
    const [useronlinepay, setUserOnlinePay] = useState([]);
    const [userofflinepay, setUserOfflinePay] = useState([]);
    const [userorders, setUserOrders] = useState([]);
    useEffect(() => {
        axios.get(`${host}/api/user/getorders`)
            .then((res) => {
                // Set state with the fetched data
                setOrders(res?.data?.orders || []);
                setOnlinePay(res?.data?.online || []);
                setOfflinePay(res?.data?.offline || []);
            })
            .catch((err) => {
                // Handle errors here
                console.error('Error fetching requests:', err.message);
            });

            const token = JSON.parse(localStorage.getItem('userToken')); // or wherever you're storing the token
            axios.get(`${host}/api/user/getordersById`, {
                headers: {
                    'auth-token': token
                }
            })
            .then((res) => {
                // Set state with the fetched data
                setUserOrders(res?.data?.orders || []);
                setUserOnlinePay(res?.data?.online || []);
                setUserOfflinePay(res?.data?.offline || []);
            })
            .catch((err) => {
                // Handle errors here
                console.error('Error fetching requests:', err.message);
            });
    }, [cartCount]); // Empty dependency array ensures this runs only once after initial render


    const [alluser, setAllUser] = useState([]);
    useEffect(() => {
        axios.get(`${host}/api/user/get-user`)
            .then((res) => {
                // Set state with the fetched data
                setAllUser(res?.data?.user || []);
            })
            .catch((err) => {
                // Handle errors here
                console.error('Error fetching requests:', err.message);
            });
    }, []); // Empty dependency array ensures this runs only once after initial render


    const todayDate = moment().format('YYYY-MM-DD'); // Format yyyy-mm-dd
    const defaultTime = '12:00'; // Default time
    const [reservation, setReservation] = useState({
        date: todayDate,
        time: defaultTime
    });

    return (
        <AuthContext.Provider value={{
            host, imagePath,
            token, setToken,
            authModal, handleAuthModalOpen, handleAuthModalClose,
            checkoutModalOpen, setCheckoutModalOpen,
            drawerOpen, setDrawerOpen, handleDrawerOpen, handleDrawerClose,
            tables, setTables,
            openuserTable, setOpenuserTable,
            handleOpenUserTable, handleCloseUserTable,
            //  Categories
            dbcategory, setDbCategory, deletedCategory, setDeleteCategory,

            // Product
            products, setProducts,
            deletedProduct, setDeleteProduct,
            productCount, setProductCount,
            // Cart
            carts, setCarts, cartCount, setCartCount,
            // User
            user,setLoggedCount,

            proceedDetail, setProceedDetail,
            cartOpen, setCartOpen,
            selectedTable, setSelectedTable,

            // Request For Admin
            pendingreq, setPendingRequest,
            allreq, setAllRequest, rejreq,
            acceptedreq, setAcceptedRequest,
            selectedProductItem, setSelectedProductItem, setreqCount,


            // Request for User
            singleusereq,
            userpendingreq,
            useracceptedreq,
            userrejreq,

            // Order for User
            useronlinepay,
            userofflinepay,
            userorders,



            // Orders
            onlinepay,
            offlinepay,
            orders, setOrders,

            // Alluser
            alluser,
            reservation, setReservation

        }}>
            {children}
        </AuthContext.Provider>
    );
};
export { AuthContext, AuthProvider };
