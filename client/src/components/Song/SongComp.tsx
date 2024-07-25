import React, { useState, useEffect, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { useDispatch, useSelector } from 'react-redux';
import 'react-h5-audio-player/lib/styles.css';
import { addToPlaylist, createPlaylist, fetchPlaylistEntries } from '../../Redux/playlistSlice';
import { fetchSongs, updateView } from '../../Redux/songSlice';
import { RootState, AppDispatch } from '../../Redux/store';
import { Song } from '../../Types/song.type';
import './styles.css';

interface SongCompProps {
  song: Song;
}

const SongComp: React.FC<SongCompProps> = ({ song }) => {
  const dispatch = useDispatch<AppDispatch>();
  const songs = useSelector((state: RootState) => state.songs.songs);
  const songStatus = useSelector((state: RootState) => state.songs.status);
  const playlistEntries = useSelector((state: RootState) => state.playlist.playlistEntries);
  const [localViews, setLocalViews] = useState<number>(song.views);
  const isFirstPlayRef = useRef<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  const [newPlaylistName, setNewPlaylistName] = useState<string>('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchSongs());
    dispatch(fetchPlaylistEntries());
  }, [dispatch]);

  const handleViewUpdate = async (songId: string, views: number) => {
    try {
      console.log(`Updating view for song ${songId} to ${views + 1}`);
      await dispatch(updateView({ id: songId, view: views + 1 })).unwrap();
      setLocalViews(views + 1); // Update local views state
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

  const handleAddToPlaylist = () => {
    if (selectedPlaylist) {
      dispatch(addToPlaylist({ songId: song._id, playlistId: selectedPlaylist }));
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

  useEffect(() => {
    if (isFirstPlayRef.current) {
      handleViewUpdate(song._id, song.views);
      isFirstPlayRef.current = false;
    }
  }, [song._id, song.views]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
    console.log(`${isPlaying ? 'Pausing' : 'Playing'} song: ${song._id}`);
  };

  return (
    <div className="song-container">
      {songStatus === 'loading' ? (
        <p>Loading songs...</p>
      ) : songStatus === 'succeeded' ? (
        <>
          <AudioPlayer
            src={song.songUrl}
            onPlay={handlePlayPause}
            onPause={handlePlayPause}
            showSkipControls={true}
            showJumpControls={false}
            autoPlayAfterSrcChange={true}
            autoPlay
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
      ) : (
        <p>Failed to load songs.</p>
      )}
    </div>
  );
};

export default SongComp;
