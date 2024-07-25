import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1DB954', 
        },
        background: {
            default: '#000000', 
            paper: '#121212', 
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#B3B3B3',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#000000',
                },
            },
        },
    },
    spacing: 8,
});

export default theme;
