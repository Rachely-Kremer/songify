import React, { useState, useEffect, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { useDispatch } from 'react-redux';
import 'react-h5-audio-player/lib/styles.css';
import { Song } from '../../Types/song.type';
import { updateView } from '../../Redux/songSlice';
import { AppDispatch } from '../../Redux/store';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import IconButton from '@mui/material/IconButton';
import './styles.css';

interface SongCompProps {
  song: Song;

}

const SongComp: React.FC<SongCompProps> = ({ song }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [localViews, setLocalViews] = useState<number>(song.views);
  const isFirstPlayRef = useRef<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);


  const handleViewUpdate = async (songId: string, views: number) => {
    try {
      console.log(`Updating view for song ${songId} to ${views + 1}`);
      await dispatch(updateView({ id: songId, view: views + 1 })).unwrap();
      setLocalViews(views + 1); // Update local views state
    } catch (error) {
      console.error('Error updating views:', error);
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
      {/* <h4>{song.songName}</h4> */}
      {/* <p className="song-artist">{song.singerName}</p> */}
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

    </div>
  );
};

export default SongComp;
