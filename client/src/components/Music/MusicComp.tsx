import React, { useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const songs = [
  { title: 'Song 1', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'Song 2', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { title: 'Song 3', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

const MusicComp = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const handleClickNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handleClickPrevious = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>נגן מוזיקה</h2>
      <h3>{songs[currentSongIndex].title}</h3>
      <AudioPlayer
        src={songs[currentSongIndex].src}
        onPlay={() => console.log('Playing')}
        onClickPrevious={handleClickPrevious}
        onClickNext={handleClickNext}
        showSkipControls={true}
        showJumpControls={false}
        autoPlayAfterSrcChange={true}
      />
    </div>
  );
};

export default MusicComp;
