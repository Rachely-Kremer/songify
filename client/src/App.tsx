import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MiniDrawer from './components/Navbar';
import { Box } from '@mui/material';
import MusicComp from './components/Music/MusicComp';

function App() {
  return (
    <Router>
      <MiniDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Suspense fallback={<div>Loading...</div>}>
        <MusicComp />
          {/* <Chat /> */}
          <Routes>
            {/* <Route path="/" element={<HomeComp />} />
            <Route path="/search" element={<SearchComponent />} />
            <Route path="/playlist" element={<PlaylistComp />} /> */}
          </Routes>
        </Suspense>
      </Box>
    </Router>
  );
}

export default App;
