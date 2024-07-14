import { useEffect, useState } from "react";
import { Song } from "../Types/song.type";
import 'react-h5-audio-player/lib/styles.css';
import { updateView } from "../Redux/songSlice";

const PopularSongs = () => {
    const [popularSongs, setPopularSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);

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
            {popularSongs.length === 0 ? (
                <p>Loading popular songs...</p>
            ) : (
                <ul>
                    {popularSongs.map((song) => (
                        <li key={song._id}>
                            <h4>{song.songName} by {song.singerName}</h4>
                            <p>Likes: {song.likes} Likes</p>
                            <p>Views: {song.views} Views</p>
                            <p>{new Date(song.date).toLocaleDateString()}</p>
                            <audio controls src={song.songUrl}
                                onPlay={() => updateView(song._id)}></audio>
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

export default PopularSongs;
