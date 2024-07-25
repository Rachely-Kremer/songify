import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1DB954', // צבע ירוק של ספוטיפי
        },
        background: {
            default: '#000000', // צבע רקע שחור
            paper: '#121212', // צבע אפור כהה לרכיבים
        },
        text: {
            primary: '#FFFFFF', // טקסט בצבע לבן
            secondary: '#B3B3B3', // טקסט בצבע אפור
        },
    },
    // components: {
    //     MuiCssBaseline: {
    //         styleOverrides: {
    //             body: {
    //                 backgroundColor: '#000000',
    //             },
    //         },
    //     },
    // },
    // spacing: 8, // מרווחים בין רכיבים
});

export default theme;
