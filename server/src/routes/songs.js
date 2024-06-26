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
router.put('/song/:id', songController.updateSong);

// Delete a song by ID
router.delete('/song/:id', songController.deleteSong);

module.exports = router;
