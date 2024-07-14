import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MiniDrawer from './components/Navbar/Navbar';
import { Box } from '@mui/material';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import store from './Redux/store';
import { Provider } from 'react-redux';


function App() {
  return (
    <Provider store={store}>
      <Router>
        <MiniDrawer />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 2 }}>
              <SignIn />
              <SignUp />
            </Box>
          </Suspense>
        </Box>
      </Router>
    </Provider>
  );
}

export default App;
