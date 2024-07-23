import React from 'react';
import { useDispatch } from 'react-redux';
import { Song } from '../../Types/song.type';
import { updateView, updateLike } from '../../Redux/songSlice';
import { AppDispatch } from '../../Redux/store';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';

interface AllSongsProps {
    songs: Song[];
}

const DrawSong: React.FC<AllSongsProps> = ({ songs }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleLikeClick = async (songId: string, isLiked: boolean) => {
        try {
            await dispatch(updateLike({ id: songId, isLiked }));
            console.log('Like updated successfully');
        } catch (error) {
            console.error('Error updating likes:', error);
        }
    };

    const handleViewUpdate = async (songId: string, views: number) => {
        try {
            console.log(`Updating view for song ${songId} to ${views + 1}`); // לוג לערכים
            await dispatch(updateView({ id: songId, view: views + 1 })).unwrap();
        } catch (error) {
            console.error('Error updating views:', error);
        }
    };

    return (
        <div className="AllSongs">
            {songs.length === 0 ? (
                <p>No songs found</p>
            ) : (
                <ul>
                    {songs.map((song) => (
                        <li key={song._id}>
                            <h4>{song.songName} by {song.singerName}</h4>
                            <IconButton
                                aria-label="add to favorites"
                                onClick={() => handleLikeClick(song._id, !song.likes)}
                            >
                                {song.likes ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                            </IconButton>
                            <p>Views: {song.views}</p>
                            <p>{new Date(song.date).toLocaleDateString()}</p>
                            <audio controls src={song.songUrl} onPlay={() => handleViewUpdate(song._id, song.views)}></audio>
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
