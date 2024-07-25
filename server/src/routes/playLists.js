const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlist');


// Create a new playlist entry
router.post('/playlists', playlistController.createPlaylist);
router.post('/playlist/:playlistId/:songId', playlistController.addSongToPlaylist);


// Get all playlist entries
router.get('/playlists', playlistController.getAllPlaylistEntries);

// Get a playlist entry by ID
router.get('/playlist/:id', playlistController.getPlaylistEntryById);

// Update a playlist entry by ID
router.put('/playlist/:id', playlistController.updatePlaylistEntry);

// Delete a playlist entry by ID
router.delete('/playlist/:id', playlistController.deletePlaylistEntry);


module.exports = router;
