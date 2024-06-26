const { Schema, model } = require('mongoose');

const PlaylistSchema = new Schema({
  songId: { type: Schema.Types.ObjectId, ref: 'Song', required: true },
  numberPlaylist: { type: Number, required: true },
});

const Playlist = model('Playlist', PlaylistSchema);
module.exports = Playlist;