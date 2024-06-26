const Playlist = require('../models/playList');

// Create a new playlist entry
exports.createPlaylistEntry = async (req, res) => {
  try {
    const { songId, numberPlaylist } = req.body;
    const newPlaylistEntry = new Playlist({
      songId,
      numberPlaylist,
    });
    await newPlaylistEntry.save();
    res.status(201).json(newPlaylistEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all playlist entries
exports.getAllPlaylistEntries = async (req, res) => {
  try {
    const playlistEntries = await Playlist.find().populate('songId');
    res.status(200).json(playlistEntries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a playlist entry by ID
exports.getPlaylistEntryById = async (req, res) => {
  try {
    const playlistEntry = await Playlist.findById(req.params.id).populate('songId');
    if (!playlistEntry) {
      return res.status(404).json({ message: 'Playlist entry not found' });
    }
    res.status(200).json(playlistEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a playlist entry by ID
exports.updatePlaylistEntry = async (req, res) => {
  try {
    const playlistEntry = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!playlistEntry) {
      return res.status(404).json({ message: 'Playlist entry not found' });
    }
    res.status(200).json(playlistEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a playlist entry by ID
exports.deletePlaylistEntry = async (req, res) => {
  try {
    const playlistEntry = await Playlist.findByIdAndDelete(req.params.id);
    if (!playlistEntry) {
      return res.status(404).json({ message: 'Playlist entry not found' });
    }
    res.status(200).json({ message: 'Playlist entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
