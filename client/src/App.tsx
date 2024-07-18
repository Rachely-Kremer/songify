import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MiniDrawer from './components/Navbar/Navbar';
import { AppBar, Box, Toolbar } from '@mui/material';
import Login from './components/Login/Login';
import store from './Redux/store';
import { Provider } from 'react-redux';
import SignUp from './components/SignUp/SignUp';
import Profile from './components/Profile/Profile';


function App() {
  const [openDialog, setOpenDialog] = useState<'login' | 'signup' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status


  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenDialog('login');
    }, 5000); // 5 שניות השהייה
    return () => clearTimeout(timer); // מנקה את הטיימר כשלא צריך אותו יותר
  }, []);


  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  const handleOpenLogin = () => {
    setOpenDialog('login');
  };

  const handleOpenSignUp = () => {
    setOpenDialog('signup');
  };


  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setOpenDialog(null); // Close the login/signup dialogs
  };

  // Function to handle successful registration
  const handleSignUpSuccess = () => {
    setIsLoggedIn(true);
    setOpenDialog(null); // Close the login/signup dialogs
  };


  return (
    <Provider store={store}>
      <Router>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          {isLoggedIn && <Profile />}
        </Toolbar>
        <MiniDrawer />
        <Login onOpenSignUp={handleOpenSignUp} openDialog={openDialog} onCloseDialog={handleCloseDialog} onLoginSuccess={handleLoginSuccess} />
        <SignUp onOpenLogin={handleOpenLogin} openDialog={openDialog} onCloseDialog={handleCloseDialog} onSignUpSuccess={handleSignUpSuccess} />
      </Router>
    </Provider>
  );
}

export default App;
