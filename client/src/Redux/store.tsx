import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice'
import songReducer from './songSlice';

const store = configureStore({
    reducer: {
        users: userReducer,
        songs:songReducer
    },
});
export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;
export default store;