import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    status: {
        danger: '#e53e3e',
    },
    palette: {
        primary: {
            main: '#6e8cc4',
            darker: '#053e85',
        },
        neutral: {
            main: '#64748B',
            contrastText: '#fff',
        },
        text: {
            primary: '#333333', // Main text color
            secondary: '#3c4c65', // Secondary text color
            disabled: '#AAAAAA', // Disabled text color
        },
    },
    slider: {
        trackColor: "yellow",
        selectionColor: "red"
    },

});