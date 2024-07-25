import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import songReducer from './songSlice';
import playlistReducer from './playlistSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        songs: songReducer,
        playlist: playlistReducer,
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;