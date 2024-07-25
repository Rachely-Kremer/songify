const { Schema, model } = require('mongoose');
const PlaylistSchema = new Schema({
  name: { type: String, required: true },
  songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
});

const Playlist = model('Playlist', PlaylistSchema);
module.exports = Playlist;