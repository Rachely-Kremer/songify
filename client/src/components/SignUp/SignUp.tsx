import React, { useState } from 'react';
import {
    Avatar, Button, CssBaseline, TextField,
    FormControlLabel, Checkbox, Grid, Box,
    Typography, Container,
    ThemeProvider, Dialog,
    InputAdornment,
    IconButton
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Redux/store';
import { signUpUser } from '../../Redux/authSlice';
import { User } from '../../Types/user.type';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import theme from '../../Theme'; // Import the theme

interface SignUpProps {
    onOpenLogin: () => void;
    openDialog: 'login' | 'signup' | null;
    onCloseDialog: () => void;
    onSignUpSuccess: () => void; 
}

const SignUp: React.FC<SignUpProps> = ({ onOpenLogin, openDialog, onCloseDialog, onSignUpSuccess }) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validate = (data: { [key: string]: string }) => {
        const newErrors: { [key: string]: string } = {};

        if (!data.firstName) newErrors.firstName = 'First Name is required';
        if (!data.lastName) newErrors.lastName = 'Last Name is required';
        if (!data.email) newErrors.email = 'Email is required';
        else if (!validateEmail(data.email)) newErrors.email = 'Email is not valid';
        if (!data.password) newErrors.password = 'Password is required';

        return newErrors;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const newUser: User = {
            id: 0,
            firstName: data.get('firstName') as string,
            lastName: data.get('lastName') as string,
            email: data.get('email') as string,
            password: data.get('password') as string,
        };

        const newErrors = validate({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            password: newUser.password,
        });

        if (Object.keys(newErrors).length === 0) {
            try {
                const resultAction = await dispatch(signUpUser(newUser));
                if (signUpUser.rejected.match(resultAction) && resultAction.payload === 'Email already exists') {
                    setErrors({ email: 'Email already exists' });
                    setGeneralError('Email already exists in our system. Please login.');
                } else {
                    onSignUpSuccess();
                    onCloseDialog();
                }
            } catch (error) {
                setGeneralError('An error occurred during sign up. Please try again later.');
            }
        } else {
            setErrors(newErrors);
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
            open={openDialog === 'signup'} 
            onClose={handleClose}
            disableEscapeKeyDown
            BackdropProps={{ invisible: true }}
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
                        <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }} />
                        <Typography component="h1" variant="h5" color={theme.palette.text.primary}>
                            Sign Up
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="firstName"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                        error={!!errors.firstName}
                                        helperText={errors.firstName}
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
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="family-name"
                                        error={!!errors.lastName}
                                        helperText={errors.lastName}
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
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
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
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        autoComplete="new-password"
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
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={<Checkbox value="allowExtraEmails" color="primary" />}
                                        label="I want to receive inspiration, marketing promotions and updates via email."
                                        sx={{ color: theme.palette.text.primary }} // צבע טקסט לפי ה-theme
                                    />
                                </Grid>
                            </Grid>
                            {generalError && (
                                <Typography color="error" align="center">
                                    {generalError}
                                </Typography>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Typography variant="body2">
                                        <RouterLink
                                            to="/login"
                                            onClick={onOpenLogin}
                                            style={{ color: theme.palette.text.primary }}
                                        >
                                            Already have an account? Login
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

export default SignUp;
