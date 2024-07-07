// src/Redux/SongSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from "axios";
import UseGet from '../Hooks/Get';
import UsePost from '../Hooks/Post';
import UsePut from '../Hooks/Put';
import UseDelete from '../Hooks/Delete';
import { Song } from '../Types/song.type';
const http = import.meta.env.VITE_HTTP || 'http://localhost:3000';


const initialState: Song = {
    songName: "",
    inPlayList: false,
    singerName: "",
    likes: 0,
    views: 0,
    date: Date.now(),
    songUrl: "",
    imageUrl: ""
}
export const fetchSongById = createAsyncThunk<Song, string>(
    'songs/fetchSongById',
    async (songId, thunkAPI) => {
        try {
            const response = await axios.get(`${http}/songs/${songId}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);;
        }
    }
);

export const addSong = createAsyncThunk<Song, Song>(
    'songs/addSong',
    async (song, thunkAPI) => {
        try {
            const response = await axios.post('${http}/songs', song)
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    });

export const updateSong = createAsyncThunk<Song, Song>(
    'songs/updateSong',
    async (song, thunkAPI) => {
        try {
            const response = await axios.put('${http}/songs/${song.songName }', song);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    });

export const deleteSong = createAsyncThunk<number, number>(
    'songs/deleteSong',
    async (songId, thunkAPI) => {
        try {
            const response = await axios.delete('${http}/songs/${songId}');
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    });

const songSlice = createSlice({
    name: 'songs',
    initialState,
    reducers: {
        resetSong: (state) => initialState,
    },
extraReducers:(builder)=>{
    builder.addCase
}


})