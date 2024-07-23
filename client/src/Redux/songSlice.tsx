// src/Redux/SongSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from "axios";
import { Song } from '../Types/song.type';

interface SongsState {
  [x: string]: any;
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
    return thunkAPI.rejectWithValue(error);
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

interface UpdateLikePayload {
  songId: string;
  newLikeStatus: boolean;
}

export const updateLike = createAsyncThunk('songs/updateLike', async (payload: UpdateLikePayload, thunkAPI) => {
  const { songId, newLikeStatus } = payload;
  try {
    const response = await axios.put(`http://localhost:5000/api/song/updateLike/${songId}`, { likeStatus: newLikeStatus });
    return { songId, newLikeStatus };
  } catch (error) {
    return thunkAPI.rejectWithValue(error);;
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
      .addCase(updateLike.fulfilled, (state, action) => {
        const updatedSong = state.songs.find(song => song._id === action.payload.songId);
        if (updatedSong) {
          updatedSong.likes = action.payload.newLikeStatus ? updatedSong.likes + 1 : updatedSong.likes - 1;
        }
      })


  }
});

export default songSlice.reducer;
