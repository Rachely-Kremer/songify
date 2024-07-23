import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-h5-audio-player/lib/styles.css';
import { updateView, updateLike } from '../../Redux/songSlice';
import { addToPlaylist } from '../../Redux/playlistSlice';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { Song } from '../../Types/song.type';
import { RootState, AppDispatch } from '../../Redux/store';

interface AllSongsProps {
  songs: Song[];
}

const DrawSong: React.FC<AllSongsProps> = ({ songs }) => {
  const dispatch = useDispatch<AppDispatch>();
  const playlists = useSelector((state: RootState) => state.playlist.playlistEntries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');


  const handleLikeClick = async (songId: string, isLiked: boolean) => {
    try {
        await dispatch(updateLike({ id: songId, isLiked }));
        console.log('Like updated successfully');
    } catch (error) {
        console.error('Error updating likes:', error);
    }
};

const handleViewUpdate = async (songId: string, views: number) => {
  try {
      console.log(`Updating view for song ${songId} to ${views + 1}`); // לוג לערכים
      await dispatch(updateView({ id: songId, view: views + 1 })).unwrap();
  } catch (error) {
      console.error('Error updating views:', error);
  }
};

  const handleAddToPlaylist = (song: Song) => {
    setSelectedSong(song);
    setIsModalOpen(true);
  };

  const handleConfirmAddToPlaylist = () => {
    if (selectedSong && selectedPlaylist) {
      dispatch(addToPlaylist({ songId: selectedSong._id, playlistId: selectedPlaylist }));
      setIsModalOpen(false);
      setSelectedSong(null);
      setSelectedPlaylist('');
    }
  };

  return (
    <div className="songs-container">
      {songs.length === 0 ? (
        <p>No songs found</p>
      ) : (
        <ul>
          {songs.map((song) => (
            <li key={song._id}>
              <h4>{song.songName} by {song.singerName}</h4>
              <div>
                <IconButton
                  aria-label="toggle like"
                  onClick={() => handleLikeClick(song._id, !song.likes )}
                >
                  {song.likes  ? <FavoriteIcon color="secondary" /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton
                  aria-label="add to playlist"
                  onClick={() => handleAddToPlaylist(song)}
                >
                  <PlaylistAddIcon />
                </IconButton>
              </div>
              <p>Views: {song.views}</p>
              <p>{new Date(song.date).toLocaleDateString()}</p>
              <audio controls src={song.songUrl} onPlay={() => handleViewUpdate(song._id,song.views)}></audio>
              {song.imageUrl ? (
                <img src={song.imageUrl} alt={song.songName} style={{ width: '100px', height: '100px' }} />
              ) : (
                <p>No image available</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <div className="modal">
          <h4>בחר פלייליסט</h4>
          <select value={selectedPlaylist} onChange={(e) => setSelectedPlaylist(e.target.value)}>
            <option value="">בחר פלייליסט...</option>
            {playlists.map((playlist) => (
              <option key={playlist._id} value={playlist._id}>{playlist.name}</option>
            ))}
          </select>
          <button onClick={handleConfirmAddToPlaylist}>הוסף</button>
          <button onClick={() => setIsModalOpen(false)}>ביטול</button>

        </div>
      )}
    </div>
  );
};


export default DrawSong;
