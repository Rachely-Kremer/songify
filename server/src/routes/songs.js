const express = require('express');
const router = express.Router();
const songController = require('../controllers/songs');

// Create a new song
router.post('/song', songController.createSong);

// Get all songs
router.get('/songs', songController.getAllSongs);

// Get a song by ID
router.get('/song/:id', songController.getSongById);

// Update a song by ID
router.put('/updateSong/:id', songController.updateSong);

// Delete a song by ID
router.delete('/song/:id', songController.deleteSong);

// Search for songs
router.get('/search', songController.searchSongs);


// Get popular songs
router.get('/songs/popularSongs', songController.popularSongs);


module.exports = router;
