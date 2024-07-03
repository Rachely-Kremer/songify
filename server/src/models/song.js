const { string } = require('i/lib/util');
const { Schema, model } = require('mongoose');

const songSchema = new Schema({
  songName: { type: String, required: true },
  inPlayList: { type: Boolean, default: false },
  singerName: { type: String, required: true },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  songUrl: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

const Song = model('Song', songSchema);
module.exports = Song;