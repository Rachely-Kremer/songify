const Playlist = require('../models/playList');

// // Create a new playlist entry
// exports.createPlaylistEntry = async (req, res) => {
//   try {
//     const { songId, numberPlaylist } = req.body;
//     const newPlaylistEntry = new Playlist({
//       songId,
//       numberPlaylist,
//     });
//     await newPlaylistEntry.save();
//     res.status(201).json(newPlaylistEntry);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

exports.createPlaylist = async (req, res) => {
  try {
    const { name } = req.body;
    console.log('Request body:', req.body); // Log request body
    if (!name) {
      return res.status(400).json({ error: 'Playlist name is required' });
    }
    const newPlaylist = new Playlist({ name, songs: [] });
    await newPlaylist.save();
    res.status(201).json(newPlaylist);
  } catch (error) {
    console.error('Error creating playlist:', error); // Log the actual error
    res.status(500).json({ error: 'Failed to create playlist' });
  }
};



exports.addSongToPlaylist = async (req, res) => {
  const playlistId = req.params.playlistId;
  const songId = req.body.songId;

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ error: 'Song not found' });

    playlist.songs.push(song);
    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add song to playlist' });
  }
};


// Get all playlist entries
exports.getAllPlaylistEntries = async (req, res) => {
  try {
    const playlists = await Playlist.find().populate('songs');
    res.json(playlists);
  } catch (error) {
    console.error('Failed to fetch playlists:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Get a playlist entry by ID
exports.getPlaylistEntryById = async (req, res) => {
  try {
    const playlistEntry = await Playlist.findById(req.params.id).populate('songs');
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
