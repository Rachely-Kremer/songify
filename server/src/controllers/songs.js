// controllers/songs.js
const Song = require('../models/song');

// Create a new song
exports.createSong = async (req, res) => {
  try {
    const { songName, singerName, likes, views, songUrl, imageUrl } = req.body;
    const newSong = new Song({
      songName,
      singerName,
      likes,
      views,
      songUrl,
      imageUrl
    });
    await newSong.save();
    res.status(201).json(newSong);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all songs
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a song by ID
exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a song by ID
exports.updateSong = async (req, res) => {
  try {
    console.log('Request to update song:', req.params.id, req.body);
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.status(200).json(song);
  } catch (error) {
    console.error('Error updating song:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a song by ID
exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.status(200).json({ message: 'Song deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// פונקציה לחיפוש שירים
exports.searchSongs = async (req, res) => {
  try {
    const query = req.query.query;
    const songs = await Song.find({
      songName: { $regex: query, $options: 'i' },
    });

    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching search results' });
  }
};


exports.popularSongs = async (req, res) => {
  try {
    const popularSongs = await Song.find().sort({ views: -1 }).limit(4);
    res.status(200).json(popularSongs)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
