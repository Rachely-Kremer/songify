import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MiniDrawer from './components/Navbar/Navbar';
import { CssBaseline, Box, ThemeProvider, Toolbar, Container } from '@mui/material';
import Login from './components/Login/Login';
import store from './Redux/store';
import { Provider } from 'react-redux';
import SignUp from './components/SignUp/SignUp';
import Profile from './components/Profile/Profile';
import theme from './Theme';


function App() {
  const [openDialog, setOpenDialog] = useState<'login' | 'signup' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenDialog('login');
    }, 5000); 
    return () => clearTimeout(timer); 
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
    setOpenDialog(null);
  };

  const handleSignUpSuccess = () => {
    setIsLoggedIn(true);
    setOpenDialog(null); 
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <Router>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }} />
            {isLoggedIn && <Profile />}
          </Toolbar>
          <Container maxWidth="md" sx={{ padding: 2 }}>
            <MiniDrawer />
            <Login onOpenSignUp={handleOpenSignUp} openDialog={openDialog} onCloseDialog={handleCloseDialog} onLoginSuccess={handleLoginSuccess} />
            <SignUp onOpenLogin={handleOpenLogin} openDialog={openDialog} onCloseDialog={handleCloseDialog} onSignUpSuccess={handleSignUpSuccess} />
          </Container>
        </Router>
      </Provider>
    </ThemeProvider>

  );
}

export default App;
