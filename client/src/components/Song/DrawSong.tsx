import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Song } from "../../Types/song.type";
import 'react-h5-audio-player/lib/styles.css';
import { updateView, updateLike } from "../../Redux/songSlice";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import { AppDispatch } from "../../Redux/store";

interface AllSongsProps {
    songs: Song[];
}

const DrawSong: React.FC<AllSongsProps> = ({ songs }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleLikeClick = async (songId: string) => {
        try {
            await dispatch(updateLike(songId));
        } catch (error) {
            console.error('Error updating likes:', error);
        }
    };

    const handleViewUpdate = async (songId: string) => {
        try {
            await dispatch(updateView(songId));
        } catch (error) {
            console.error('Error updating views:', error);
        }
    };

    return (
        <div className="songs-container">
            {songs.length === 0 ? (
                <p>No songs found</p>
            ) : (
                <ul>
                    {songs.map((song) => (
                        <li key={song._id}>
                            <h4>{song.songName} by {song.singerName}</h4>
                            <div>
                                <IconButton
                                    aria-label="add to favorites"
                                    onClick={() => handleLikeClick(song._id)}
                                >
                                    {song.likes > 0 ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                </IconButton>
                                <span>Likes: {song.likes}</span>
                            </div>
                            <p>Views: {song.views}</p>
                            <p>{new Date(song.date).toLocaleDateString()}</p>
                            <audio controls src={song.songUrl} onPlay={() => handleViewUpdate(song._id)}></audio>
                            {song.imageUrl ? (
                                <img src={song.imageUrl} alt={song.songName} style={{ width: '100px', height: '100px' }} />
                            ) : (
                                <p>No image available</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DrawSong;
