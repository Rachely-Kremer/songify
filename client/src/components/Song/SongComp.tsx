import React, { useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { useSelector, useDispatch } from 'react-redux';
import 'react-h5-audio-player/lib/styles.css';
import { addToPlaylist, createPlaylist, fetchPlaylistEntries } from '../../Redux/playlistSlice';
import { RootState, AppDispatch } from '../../Redux/store';
import './styles.css';
import { fetchSongs } from '../../Redux/songSlice';

const SongComp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const songs = useSelector((state: RootState) => state.songs.songs);
  const playlistEntries = useSelector((state: RootState) => state.playlist.playlistEntries);
  const loading = useSelector((state: RootState) => state.songs.loading);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  const [newPlaylistName, setNewPlaylistName] = useState<string>('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchSongs());
    dispatch(fetchPlaylistEntries());
  }, [dispatch]);

  const handleClickNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handleClickPrevious = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  };

  const handleAddToPlaylist = () => {
    if (selectedPlaylist) {
      dispatch(addToPlaylist({ songId: songs[currentSongIndex]._id, playlistId : selectedPlaylist }));
    } else {
      setIsCreatingPlaylist(true);
    }
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName) {
      dispatch(createPlaylist(newPlaylistName));
      setNewPlaylistName('');
      setIsCreatingPlaylist(false);
    }
  };

  return (
    <div className="song-container">
      {loading ? (
        <p>Loading songs...</p>
      ) : (
        <>
          <h4>{songs[currentSongIndex]?.songName || 'No Song Selected'}</h4>
          <AudioPlayer
            src={songs[currentSongIndex]?.songUrl || ''}
            onClickPrevious={handleClickPrevious}
            onClickNext={handleClickNext}
            showSkipControls={true}
            showJumpControls={false}
            autoPlayAfterSrcChange={true}
          />
          <button onClick={handleAddToPlaylist}>Add to Playlist</button>
          {isCreatingPlaylist && (
            <div>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Enter new playlist name"
              />
              <button onClick={handleCreatePlaylist}>Create Playlist</button>
            </div>
          )}
          {playlistEntries.length > 0 && (
            <select onChange={(e) => setSelectedPlaylist(e.target.value)} value={selectedPlaylist}>
              <option value="">Select Playlist</option>
              {playlistEntries.map((playlist) => (
                <option key={playlist._id} value={playlist._id}>{playlist.name}</option>
              ))}
            </select>
          )}
        </>
      )}
    </div>
  );
};

export default SongComp;
