import React, { useEffect, useState } from 'react';
import { Song } from '../Types/song.type';
import 'react-h5-audio-player/lib/styles.css';
import DrawSong from './Song/DrawSong';

const PopularSongs = () => {
    const [popularSongs, setPopularSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopularSongs = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/songs/popularSongs`);
                const data = await response.json();
                console.log('Fetched data:', data);

                if (Array.isArray(data)) {
                    setPopularSongs(data);
                } else {
                    console.error('Data is not an array:', data);
                }
            } catch (error) {
                console.error('Error fetching popular songs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPopularSongs();
    }, []);

    return (
        <div className="popular-songs-container">
            <h2>Popular Songs</h2>
            {loading ? (
                <p>Loading popular songs...</p>
            ) : (
                <DrawSong songs={popularSongs} />
            )}
        </div>
    );
};

export default PopularSongs;
