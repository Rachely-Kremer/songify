import React, { useState, useEffect } from 'react';
import {
    Avatar, Button, CssBaseline, TextField,
    FormControlLabel, Checkbox, Link, Grid, Box,
    Typography, Container,
    Dialog,
    InputAdornment,
    IconButton,
    ThemeProvider
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../Redux/store';
import { loginUser } from '../../Redux/authSlice';
import { RootState } from '../../Redux/store';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import theme from '../../Theme'; // Import the theme

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
    const { error, loading, user } = useSelector((state: RootState) => state.auth);

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
        <ThemeProvider theme={theme}>
            <Dialog
                open={openDialog === 'login'}
                onClose={handleClose}
                disableEscapeKeyDown
            >
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: theme.palette.background.paper, // צבע הרקע של הקונטיינר לפי ה-theme
                            padding: 3,
                            borderRadius: 1,
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5" color={theme.palette.text.primary}>
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
                                InputProps={{
                                    sx: {
                                        bgcolor: 'transparent', // צבע הרקע שקוף
                                        color: theme.palette.text.primary, // צבע טקסט לפי ה-theme
                                        border: '1px solid #333333', // צבע המסגרת אפור כהה יותר
                                        borderRadius: 1, // קצה מעוגל למסגרת
                                        '& .MuiInputBase-input': {
                                            padding: '10px', // ריפוד פנימי
                                        }
                                    }
                                }}
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
                                                sx={{ color: theme.palette.primary.main }} // צבע האיקון ירוק
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        bgcolor: 'transparent', // צבע הרקע שקוף
                                        color: theme.palette.text.primary, // צבע טקסט לפי ה-theme
                                        border: '1px solid #333333', // צבע המסגרת אפור כהה יותר
                                        borderRadius: 1, // קצה מעוגל למסגרת
                                        '& .MuiInputBase-input': {
                                            padding: '10px', // ריפוד פנימי
                                        }
                                    }
                                }}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                                sx={{ color: theme.palette.text.primary }} // צבע טקסט לפי ה-theme
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
                                    <Link href="#" variant="body2" color="inherit">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2">
                                        <RouterLink
                                            to="/signup"
                                            onClick={onOpenSignUp}
                                            style={{ color: theme.palette.text.primary }}
                                        >
                                            {"Don't have an account? Sign Up"}
                                        </RouterLink>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </Dialog>
        </ThemeProvider>
    );
}

export default Login;
