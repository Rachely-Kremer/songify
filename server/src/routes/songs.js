const express = require('express');
const router = express.Router();
const songController = require('../controllers/songs');

router.post('/song', songController.createSong);
router.get('/songs', songController.getAllSongs);
router.get('/song/:id', songController.getSongById);
router.put('/updateSong/:id', songController.updateSong);
router.delete('/song/:id', songController.deleteSong);
router.get('/search', songController.searchSongs);
router.get('/songs/popularSongs', songController.popularSongs);

module.exports = router;
