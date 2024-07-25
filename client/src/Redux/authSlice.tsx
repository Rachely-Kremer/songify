// userSlice.tsx
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../Types/user.type';
import axios from 'axios';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    token: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    token: null,
};


export const signUpUser = createAsyncThunk(
    'auth/signUpUser',
    async (newUser: { email: string; password: string }, { rejectWithValue }) => {
        try {
            await axios.post('http://localhost:5000/api/signup', newUser);
            const loginResponse = await axios.post('http://localhost:5000/api/login', newUser);
            return loginResponse.data;
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                return rejectWithValue('Email already exists');
            }
            return rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', credentials);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    }

);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signUpUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to sign up';
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to login';
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;