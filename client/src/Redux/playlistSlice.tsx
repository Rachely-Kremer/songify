import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { Song } from '../Types/song.type';
import { Playlist } from '../Types/playlist.type';

interface PlaylistState {
  songs: Song[];
  playlistEntries: Playlist[];
  loading: boolean;
  error: string | null;
}

const initialState: PlaylistState = {
  songs: [],
  playlistEntries: [],
  loading: false,
  error: null,
};

export const fetchPlaylistEntries = createAsyncThunk('playlists/fetchPlaylistEntries', async (_, thunkAPI) => {
  try {
    const response = await axios.get('http://localhost:5000/api/playlists');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    return thunkAPI.rejectWithValue(axiosError.message);
  }
});

export const addToPlaylist = createAsyncThunk('playlists/addToPlaylist', async ({ songId, playlistId }: { songId: string, playlistId: string }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/playlist/${playlistId}/${songId}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(axiosError.message);
  }
});

export const createPlaylist = createAsyncThunk('playlists/createPlaylist', async (playlistName: string, thunkAPI) => {
  try {
    const response = await axios.post('http://localhost:5000/api/playlists', { name: playlistName });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    return thunkAPI.rejectWithValue(axiosError.message);
  }
});
export const removeFromPlaylist = createAsyncThunk('playlists/removeFromPlaylist', async ({ songId, playlistId }: { songId: string, playlistId: string }, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:5000/api/playlist/${playlistId}/${songId}`);
    return { songId, playlistId };
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(axiosError.message);
  }
});

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylistEntries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlaylistEntries.fulfilled, (state, action: PayloadAction<Playlist[]>) => {
        state.loading = false;
        state.playlistEntries = action.payload;
      })
      .addCase(fetchPlaylistEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToPlaylist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToPlaylist.fulfilled, (state, action: PayloadAction<Playlist>) => {
        state.loading = false;
        const index = state.playlistEntries.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.playlistEntries[index] = action.payload;
        }
      })
      .addCase(addToPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPlaylist.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPlaylist.fulfilled, (state, action: PayloadAction<Playlist>) => {
        state.loading = false;
        state.playlistEntries.push(action.payload);
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeFromPlaylist.pending, (state) => {
        state.loading = true;
      })
    .addCase(removeFromPlaylist.fulfilled, (state, action: PayloadAction<{ songId: string, playlistId: string }>) => {
      state.loading = false;
      const { songId, playlistId } = action.payload;
      const playlist = state.playlistEntries.find(p => p._id === playlistId);
      if (playlist) {
        playlist.songs = playlist.songs.filter(song => song._id !== songId);
      }
    })
    .addCase(removeFromPlaylist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
},
});

export default playlistSlice.reducer;
