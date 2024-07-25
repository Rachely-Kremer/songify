const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlist');


router.post('/playlists', playlistController.createPlaylist);
router.post('/playlist/:playlistId/:songId', playlistController.addSongToPlaylist);
router.get('/playlists', playlistController.getAllPlaylistEntries);
router.get('/playlist/:id', playlistController.getPlaylistEntryById);
router.put('/playlist/:id', playlistController.updatePlaylistEntry);
router.delete('/playlist/:id', playlistController.deletePlaylistEntry);
router.delete('/playlist/:id',playlistController.removeSongFromPlaylist)

module.exports = router;
