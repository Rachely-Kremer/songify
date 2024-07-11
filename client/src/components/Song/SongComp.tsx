import React, { useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { useSelector, useDispatch } from 'react-redux';
import 'react-h5-audio-player/lib/styles.css';
import { fetchSongs } from '../../Redux/songSlice';
import { RootState, AppDispatch } from '../../Redux/store'
import './styles.css';
import { updateView } from '../../Redux/songSlice';


const SongComp = () => {
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




  return (
    <div className="song-container">
      {songStatus === 'loading' ? (
        < p > Loading songs...</p>
      ) : songStatus === 'succeeded' ? (
        <>
          <h4>{songs[currentSongIndex].songName}</h4>
          <AudioPlayer
            src={songs[currentSongIndex].songUrl}
            onPlay={() => updateView(songs[currentSongIndex]._id)}
            onClickPrevious={handleClickPrevious}
            onClickNext={handleClickNext}
            showSkipControls={true}
            showJumpControls={false}
            autoPlayAfterSrcChange={true}
          />
        </>
      ) : songStatus === 'failed' ? (
        <p>Error fetching songs...</p>
      ) : null}
    </div>
  );
};

export default SongComp;
