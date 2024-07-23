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
    return thunkAPI.rejectWithValue(error);
  }
});

export const updateView = createAsyncThunk('songs/updateView', async ({ id, view }: { id: string; view: number }, thunkAPI) => {
  try {
    const response = await fetch(`http://localhost:5000/api/updateSong/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ views: view }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedSong = await response.json();
    return { id: updatedSong._id, views: updatedSong.views };
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const updateLike = createAsyncThunk('songs/updateLike', async ({ id, isLiked }: { id: string; isLiked: boolean }, thunkAPI) => {
  try {
    const response = await fetch(`http://localhost:5000/api/updateSong/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ likes: isLiked }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedSong = await response.json();
    return { id: updatedSong._id, likes: updatedSong.likes };
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
      .addCase(updateView.fulfilled, (state, action: PayloadAction<{ id: string; views: number }>) => {
        const { id, views } = action.payload;
        const song = state.songs.find(song => song._id === id);
        if (song) {
          song.views = views;  // תוודא שהשדה מעודכן ל-view החדש מהשרת
        }
      })
      .addCase(updateView.rejected, (state, action) => {
        state.error = (action.payload as Error).message || 'Unknown error';
      })
      .addCase(updateLike.fulfilled, (state, action: PayloadAction<{ id: string; likes: boolean }>) => {
        const song = state.songs.find(song => song._id === action.payload.id);
        if (song) {
          song.likes = action.payload.likes;
        }
      })
      .addCase(updateLike.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update likes';
      });
  }
});

export default songSlice.reducer;
