import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'react-h5-audio-player/lib/styles.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { updateView, updateLike } from '../../Redux/songSlice';
import { addToPlaylist } from '../../Redux/playlistSlice';
import { Song } from '../../Types/song.type';
import { RootState, AppDispatch } from '../../Redux/store';
import './styles.css'; 

interface DrawSongProps {
  songs: Song[];
  onSongSelect: (song: Song) => void;
}

const DrawSong: React.FC<DrawSongProps> = ({ songs, onSongSelect }) => {
  const dispatch = useDispatch<AppDispatch>();
  const playlists = useSelector((state: RootState) => state.playlist.playlistEntries);

  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [localViews, setLocalViews] = useState<{ [key: string]: number }>({});
  const [likesState, setLikesState] = useState<Record<string, boolean>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');



  const handleLikeClick = async (songId: string, isLiked: boolean) => {
    try {
      await dispatch(updateLike({ id: songId, isLiked })).unwrap();
      setLikesState((prevLikesState) => ({
        ...prevLikesState,
        [songId]: isLiked,
      }));
      console.log('Like updated successfully');
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleViewUpdate = async (songId: string, views: number) => {
    try {
      console.log(`Updating view for song ${songId} to ${views + 1}`);
      await dispatch(updateView({ id: songId, view: views + 1 })).unwrap();
      setLocalViews((prev) => ({ ...prev, [songId]: views + 1 }));
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

  const handleIconClick = (song: Song) => {
    onSongSelect(song);
    // handleViewUpdate(song._id, song.views);

    const currentAudio = audioRefs.current[playingSongId || ''];
    const newAudio = audioRefs.current[song._id];

    if (playingSongId === song._id) {
      if (currentAudio) {
        currentAudio.pause();
      }
      setPlayingSongId(null); // Pause the song if it's already playing
    } else {
      if (currentAudio) {
        currentAudio.pause();
      }
      if (newAudio) {
        newAudio.play();
        handleViewUpdate(song._id, song.views);

      }
      setPlayingSongId(song._id); // Play the new song
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
    <div className="song-list">
      {songs.length === 0 ? (
        <p>No songs found</p>
      ) : (
        <div className="songs-container">
          {songs.map((song) => (
            <div
              key={song._id}
              className={`song-card ${playingSongId === song._id ? 'playing' : ''}`}
            >
              <div className="image-container">
              {song.imageUrl && <img src={song.imageUrl} alt={song.songName} className="song-image" />}

                <IconButton
                  className="play-icon"
                  onClick={() => handleIconClick(song)}
                >
                  {playingSongId === song._id ? (
                    <PauseCircleOutlineIcon fontSize="large" />
                  ) : (
                    <PlayCircleOutlineIcon fontSize="large" />
                  )}
                </IconButton>
              </div>
              <div className="song-info">
                <h4 className="song-title">{song.singerName} {song.songName}</h4>
                <div className="song-controls">
                  <IconButton
                    aria-label="add to favorites"
                    onClick={() => handleLikeClick(song._id, !likesState[song._id])}
                  >
                    {likesState[song._id] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <IconButton
                    aria-label="add to playlist"
                    onClick={() => handleAddToPlaylist(song)}
                  >
                    <PlaylistAddIcon />
                  </IconButton>
                  <p className="views">Views: {localViews[song._id] ?? song.views}</p>
                  <p className="date">{new Date(song.date).toLocaleDateString()}</p>
                </div>
                <audio
                  ref={(el) => (audioRefs.current[song._id] = el)}
                  className="audio-player"
                  src={song.songUrl}
                />
              </div>
            </div>
          ))}
        </div>
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
