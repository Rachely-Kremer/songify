import React, { useState, useEffect } from 'react';
import {
    Avatar, Button, CssBaseline, TextField,
    FormControlLabel, Checkbox, Link, Grid, Box,
    Typography, Container,
    createTheme, ThemeProvider, Dialog,
    InputAdornment,
    IconButton
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../Redux/store';
import { loginUser } from '../../Redux/userSlice';
import { RootState } from '../../Redux/store';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const defaultTheme = createTheme();

interface LoginProps {
    onOpenSignUp: () => void;
    openDialog: 'login' | 'signup' | null;
    onCloseDialog: () => void;
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onOpenSignUp, openDialog, onCloseDialog, onLoginSuccess }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const { error, loading, user } = useSelector((state: RootState) => state.users);

    useEffect(() => {
        if (user) {
            onCloseDialog();
            onLoginSuccess();
        }
    }, [user, onCloseDialog, onLoginSuccess]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const newErrors: { [key: string]: string } = {};
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            dispatch(loginUser({ email, password }));
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClose = (event: any, reason: string) => {
        if (reason !== 'backdropClick') {
            onCloseDialog();
        }
    };

    return (
        <React.Fragment>
            <Dialog
                open={openDialog === 'login'}
                onClose={handleClose}
                disableEscapeKeyDown
                BackdropProps={{ invisible: true }}
            >
                <ThemeProvider theme={defaultTheme}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Login
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    error={!!errors.email}
                                    helperText={errors.email}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="current-password"
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />
                                {error && (
                                    <Typography color="error" align="center" sx={{ mt: 0.5 }}>
                                        {"The email or password do not match what is in the system, please Sign Up"}
                                    </Typography>
                                )}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    disabled={loading}
                                >
                                    Login
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                        <Link href="#" variant="body2">
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2">
                                            <RouterLink to="/signup" onClick={onOpenSignUp}>
                                                {"Don't have an account? Sign Up"}
                                            </RouterLink>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>
            </Dialog>
        </React.Fragment>
    );
}

export default Login;
