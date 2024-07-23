import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice'
import songReducer from './songSlice';
import playlistReducer from './playlistSlice';

const store = configureStore({
    reducer: {
        users: userReducer,
        songs: songReducer,
        playlist: playlistReducer,

    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;