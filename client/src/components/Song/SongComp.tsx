import React, { useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { useSelector, useDispatch } from 'react-redux';
import 'react-h5-audio-player/lib/styles.css';
import { fetchSongs, updateView } from '../../Redux/songSlice';
import { RootState, AppDispatch } from '../../Redux/store';
import './styles.css';
import DrawSong from './DrawSong';

const SongComp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const songs = useSelector((state: RootState) => state.songs.songs);
  const songStatus = useSelector((state: RootState) => state.songs.status);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  useEffect(() => {
    if (songStatus === 'idle') {
      dispatch(fetchSongs());
    }
  }, [songStatus, dispatch]);

  const handleClickNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handleClickPrevious = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  };

  const handlePlay = async (songId: string, views: number) => {
    try {
      console.log(`Playing song: ${songId} with current views: ${views}`);
      await dispatch(updateView({ id: songId, view: views + 1 })).unwrap();
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

  if (songStatus === 'loading') {
    return <p>Loading songs...</p>;
  }

  if (songStatus === 'failed') {
    return <p>Error fetching songs...</p>;
  }

  if (songStatus === 'succeeded' && songs.length === 0) {
    return <p>No songs available.</p>;
  }

  const currentSong = songs[currentSongIndex];

  if (!currentSong) {
    return <p>No current song to play.</p>;
  }

  return (
    <div className="song-container">
      <DrawSong songs={songs} />
      <h4>{currentSong.songName}</h4>
      <AudioPlayer
        src={currentSong.songUrl}
        onPlay={() => handlePlay(currentSong._id, currentSong.views)}
        onClickPrevious={handleClickPrevious}
        onClickNext={handleClickNext}
        showSkipControls={true}
        showJumpControls={false}
        autoPlayAfterSrcChange={true}
      />
    </div>
  );
};

export default SongComp;
