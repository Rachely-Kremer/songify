const fetch = require('node-fetch');

const fetchArtist = async (artistName) => {
  const url = `https://musicbrainz.org/ws/2/artist/?query=artist:${artistName}&fmt=json`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(`Fetched artist: ${artistName}`, data.artists[0]); // לוג
  return data.artists[0];
};

const fetchAlbum = async (albumName) => {
  const url = `https://musicbrainz.org/ws/2/release/?query=release:${albumName}&fmt=json`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(`Fetched album: ${albumName}`, data.releases[0]); // לוג
  return data.releases[0];
};

const generateArtistQuestion = async () => {
  const artist = await fetchArtist('The Beatles'); // דוגמה
  const question = `מה שמו של האמן שנמצא בפרויקט MusicBrainz?`;
  const answer = artist.name;
  console.log(`Generated artist question: ${question}, answer: ${answer}`); // לוג
  return { question, answer };
};

const generateAlbumQuestion = async () => {
  const album = await fetchAlbum('Abbey Road'); // דוגמה
  const question = `מהו שם האלבום של הלהקה שנמצא בפרויקט MusicBrainz?`;
  const answer = album.title;
  console.log(`Generated album question: ${question}, answer: ${answer}`); // לוג
  return { question, answer };
};

module.exports = { generateArtistQuestion, generateAlbumQuestion };
