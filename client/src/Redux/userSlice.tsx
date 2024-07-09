// userSlice.tsx
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { RootState } from '../store'; // Adjust the import based on your file structure
import UseGet from '../Hooks/Get';
import UsePost from '../Hooks/Post';
import UsePut from '../Hooks/Put';
import UseDelete from '../Hooks/Delete';
import { User } from '../Types/user.type';

interface UsersState {
    users: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UsersState = {
    users: [],
    loading: false,
    error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const [httpGet, res] = UseGet();
    if (httpGet) {
        await httpGet('https://localhost:7112/api/Users');
        return res;
    }
    throw new Error('httpGet is not defined');
});

export const addUser = createAsyncThunk('users/addUser', async (newUser: User) => {
    const httpPost = UsePost();
    if (httpPost) {
        await httpPost('https://localhost:7112/api/Users', newUser);
        return newUser;
    }
    throw new Error('httpPost is not defined');
});

export const editUser = createAsyncThunk('users/editUser', async (user: User) => {
    const httpPut = UsePut();
    if (httpPut) {
        await httpPut(`https://localhost:7112/api/Users/${user.id}`, user);
        return user;
    }
    throw new Error('httpPut is not defined');
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (userId: number) => {
    const httpDelete = UseDelete();
    if (httpDelete) {
        await httpDelete(`https://localhost:7112/api/Users/${userId}`);
        return userId;
    }
    throw new Error('httpDelete is not defined');
});

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch users';
            })
            .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.users.push(action.payload);
            })
            .addCase(editUser.fulfilled, (state, action: PayloadAction<User>) => {
                const index = state.users.findIndex((user) => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
                state.users = state.users.filter((user) => user.id !== action.payload);
            });
    },
});

export default userSlice.reducer;

// // Custom hooks to use in components
// export const useUsers = () => {
//     const dispatch = useDispatch();
//     const users = useSelector((state: RootState) => state.users);

//     useEffect(() => {
//         dispatch(fetchUsers());
//     }, [dispatch]);

//     return users;
// };