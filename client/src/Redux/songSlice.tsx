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

export const fetchSongs = createAsyncThunk('songs/fetchSongs', async (_, thunkAPI) => {
  try {
    const response = await axios.get('http://localhost:5000/api/songs');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);;
  }
});

export const updateView = createAsyncThunk('songs/updateView', async (songId: string, thunkAPI) => {
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
    return songId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const updateLike = createAsyncThunk<void, string>('songs/updateLike', async (songId: string, thunkAPI) => {
  try {
    const response = await fetch(`http://localhost:5000/api/song/updateLike/${songId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

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
      })
      .addCase(updateView.fulfilled, (state, action: PayloadAction<string>) => {
        const song = state.songs.find(song => song._id === action.payload);
        if (song) {
          song.views += 1;
        }

      })
      .addCase(updateLike.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateLike.fulfilled, (state) => {
        state.status = 'idle';
        state.error = null; // Clear any previous errors
      })
  

  }
});

export default songSlice.reducer;
