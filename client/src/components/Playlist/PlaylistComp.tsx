import React, { useRef, useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../Redux/store';
import { fetchPlaylistEntries, removeFromPlaylist } from '../../Redux/playlistSlice';
import DrawSong from '../Song/DrawSong';

const VideoPlaylistComp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const playlists = useSelector((state: RootState) => state.playlist.playlistEntries);
  const playerRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchPlaylistEntries());
  }, [dispatch]);

  useEffect(() => {
    if (playerRef.current) {
      const player = videojs(playerRef.current, {
        controls: true,
        autoplay: false, 
        preload: 'auto',
        fluid: true,
      });

      player.on('ended', () => {
        if (playlists[currentPlaylistIndex]?.songs?.length > 0) {
          const nextVideoIndex = (currentVideoIndex + 1) % playlists[currentPlaylistIndex].songs.length;
          setCurrentVideoIndex(nextVideoIndex);
        }
      });

      return () => {
        player.dispose();
      };
    }
  }, [currentVideoIndex, currentPlaylistIndex, playlists]);

  useEffect(() => {
    if (playerRef.current && playlists.length > 0 && playlists[currentPlaylistIndex]?.songs?.length > 0) {
      const player = videojs(playerRef.current);
      player.src({
        src: playlists[currentPlaylistIndex].songs[currentVideoIndex].songUrl,
        type: 'video/mp4',
      });
      player.poster(playlists[currentPlaylistIndex].songs[currentVideoIndex].imageUrl);
    }
  }, [currentVideoIndex, currentPlaylistIndex, playlists]);

  const handleVideoClick = (playlistIndex: number, videoIndex: number) => {
    setCurrentPlaylistIndex(playlistIndex);
    setCurrentVideoIndex(videoIndex);
  };

  const handleRemoveFromPlaylist = (songId: string, playlistId: string) => {
    dispatch(removeFromPlaylist({ songId, playlistId }));
  };

  return (
    <div>
      {playlists && playlists.length > 0 ? (
        playlists.map((playlist, playlistIndex) => (
          <div key={playlist._id}>
            <h3>{playlist.name}</h3>
            {playlist.songs && playlist.songs.length > 0 ? (
              <DrawSong
                songs={playlist.songs}
                onSongSelect={(song) => handleVideoClick(playlistIndex, playlist.songs.indexOf(song))}
              />
            ) : (
              <p>No songs in this playlist.</p>
            )}
          </div>
        ))
      ) : (
        <p>No playlists available.</p>
      )}
      <div>
        <video ref={playerRef} className="video-js vjs-default-skin" controls />
      </div>
    </div>
  );
};

export default VideoPlaylistComp;
