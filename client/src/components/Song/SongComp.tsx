import React, { useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { useSelector, useDispatch } from 'react-redux';
import 'react-h5-audio-player/lib/styles.css';
import { addToPlaylist, createPlaylist, fetchPlaylistEntries } from '../../Redux/playlistSlice';
import './styles.css';
import { fetchSongs } from '../../Redux/songSlice';
import { RootState, AppDispatch } from '../../Redux/store';
import { updateView } from '../../Redux/songSlice';
import DrawSong from './DrawSong';

const SongComp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const songs = useSelector((state: RootState) => state.songs.songs);
  const songStatus = useSelector((state: RootState) => state.songs.status);
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
      dispatch(addToPlaylist({ songId: songs[currentSongIndex]._id, playlistId: selectedPlaylist }));
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
  }
  const handlePlay = async (songId: string, views: number) => {
    try {
      console.log(`Playing song: ${songId} with current views: ${views}`);
      await dispatch(updateView({ id: songId, view: views + 1 })).unwrap();
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

  return (
    <div className="song-container">
      {songStatus === 'loading' ? (
        <p>Loading songs...</p>
      ) : songStatus === 'succeeded' ? (
        <>
          <h4>{songs[currentSongIndex]?.songName || 'No Song Selected'}</h4>
          <AudioPlayer
            src={songs[currentSongIndex]?.songUrl || ''}
            onPlay={() => handlePlay(songs[currentSongIndex]._id, songs[currentSongIndex].views + 1)}
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
          <DrawSong songs={songs} />
        </>
      ) : (
        <p>Failed to load songs.</p>
      )}
    </div>
  );
};

export default SongComp;
