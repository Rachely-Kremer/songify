import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SongComp from '../Song/SongComp';
import DrawSong from '../Song/DrawSong';
import { Song } from '../../Types/song.type';
import { fetchSongs } from '../../Redux/songSlice';
import { AppDispatch, RootState } from '../../Redux/store';
import './home.css';

const HomeComp = () => {
    const dispatch = useDispatch<AppDispatch>();
    const songs = useSelector((state: RootState) => state.songs.songs);
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);

    useEffect(() => {
        dispatch(fetchSongs());
    }, [dispatch]);

    const handleSongSelect = (song: Song) => {
        setSelectedSong(song);
    };

    return (
        <div className="home-container">
            <h1>.שמע את זה. רואים את זה. חיה את זה</h1>
            <DrawSong songs={songs} onSongSelect={handleSongSelect} />
            {selectedSong && <SongComp song={selectedSong} />}
        </div>
    );
};

export default HomeComp;
