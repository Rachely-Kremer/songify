import React, { useState, useEffect, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { useDispatch, useSelector } from 'react-redux';
import 'react-h5-audio-player/lib/styles.css';
import { addToPlaylist, createPlaylist, fetchPlaylistEntries } from '../../Redux/playlistSlice';
import { fetchSongs, updateView } from '../../Redux/songSlice';
import { RootState, AppDispatch } from '../../Redux/store';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import IconButton from '@mui/material/IconButton';
import './styles.css';
import { Song } from '../../Types/song.type';


interface SongCompProps {
  song: Song;

}

const SongComp: React.FC<SongCompProps> = ({ song }) => {
  const dispatch = useDispatch<AppDispatch>();
  const songs = useSelector((state: RootState) => state.songs.songs);
  const songStatus = useSelector((state: RootState) => state.songs.status);
  const playlistEntries = useSelector((state: RootState) => state.playlist.playlistEntries);
  const loading = useSelector((state: RootState) => state.songs.loading);

  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [localViews, setLocalViews] = useState<number>(song.views);
  const isFirstPlayRef = useRef<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
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

  const handlePlay = async (songId: string, views: number) => {
    try {
      await handleViewUpdate(songId, views);
      setPlayingSongId(songId);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing song:', error);
    }
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
  // const handlePlay = () => {
  //   console.log(`Playing song: ${song._id}`);
  // };

  // const handlePause = () => {
  //   console.log(`Pausing song: ${song._id}`);
  // };

  // const handlePause = async (songId: string, views: number) => {
  //   try {
  //     console.log(`Pausing song: ${songId} with current views: ${views}`);
  //     await dispatch(updateView({ id: songId, view: views })).unwrap();
  //   } catch (error) {
  //     console.error('Error updating views:', error);
  //   }
  // };

  return (
    <div className="song-container">
      {songStatus === 'loading' ? (
        <p>Loading songs...</p>
      ) : songStatus === 'succeeded' ? (

        <>
          <h4>{songs[currentSongIndex]?.songName || 'No Song Selected'}</h4>

          <AudioPlayer
            src={song.songUrl}
            onPlay={handlePlayPause}
            onPause={handlePlayPause}
            // onPlay={() => {
            //   setPlayingSongId(song._id);
            //   handleViewUpdate(song._id, localViews);
            // }}
            // onPause={() => {
            //   setPlayingSongId(null);
            //   handlePause(song._id, localViews);
            // }}
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
  )
  {/* {songStatus === 'loading' ? (
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
>>>>>>> 98a23d60705c94fed81fda3e4852a01723ffdf45
    </div> */}


  }
  export default SongComp;
