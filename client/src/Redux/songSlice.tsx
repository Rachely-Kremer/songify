// src/Redux/SongSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from "axios";
import { Song } from '../Types/song.type';

interface SongsState {
    songs: Song[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: SongsState = {
    songs: [],
    status: 'idle',
    error: null
};

// const initialState: Song = {
//     songName: "",
//     inPlayList: false,
//     singerName: "",
//     likes: 0,
//     views: 0,
//     date: Date.now(),
//     songUrl: "",
//     imageUrl: ""
// }

export const fetchSongs = createAsyncThunk('songs/fetchSongs', async (_, thunkAPI) => {
    try {
        const response = await axios.get('http://localhost:5000/api/songs');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);;
    }
});

export const updateView = async (songId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/song/updateView/${songId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`Views updated for song ${songId}`);
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

const songSlice = createSlice({
    name: 'songs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSongs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSongs.fulfilled, (state, action: PayloadAction<Song[]>) => {
                state.status = 'succeeded';
                state.songs = action.payload;
            })
            .addCase(fetchSongs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.error.message) || 'Failed to fetch songs';
            });
    }
});
export default songSlice.reducer;




// export const addSong = createAsyncThunk<Song, Song>(
//     'songs/addSong',
//     async (song, thunkAPI) => {
//         try {
//             const response = await axios.post('${http}/songs', song)
//             return response.data;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error);
//         }
//     });

// export const updateSong = createAsyncThunk<Song, Song>(
//     'songs/updateSong',
//     async (song, thunkAPI) => {
//         try {
//             const response = await axios.put('${http}/songs/${song.songName }', song);
//             return response.data;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error);
//         }
//     });

// export const deleteSong = createAsyncThunk<number, number>(
//     'songs/deleteSong',
//     async (songId, thunkAPI) => {
//         try {
//             const response = await axios.delete('${http}/songs/${songId}');
//             return response.data;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error);
//         }
//     });

