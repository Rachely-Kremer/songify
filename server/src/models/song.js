const mongoose = require('mongoose');
const  Schema = mongoose.Schema;


const songSchema = new Schema({
  songName: { type: String, required: true },
  inPlayList: { type: Boolean, default: false },
  singerName: { type: String, required: true },
  likes: { type: Boolean, default: false},
  views: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  songUrl: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

const Song = mongoose.model('Song', songSchema);
module.exports = Song;