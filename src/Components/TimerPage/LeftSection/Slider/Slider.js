
import * as React from 'react';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const marks = [
    {
        value: 30,
        label: '30min',
    },
    {
        value: 60,
        label: '60min',
    },
];

const PrettoSlider = styled(Slider)({
    color: '#6e8cc4',
    height: 5,
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&:before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 12,
        background: 'unset',
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#3c4c65',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&:before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
});


export default function CustomizedSlider({defaultValue, setSliderValue}) {
    const handleValue = (e) => {
        setSliderValue(e.target.value)
    }
    return (
            <PrettoSlider
                aria-label="Custom marks"
                defaultValue={defaultValue}
                step={5}
                valueLabelDisplay="auto"
                marks={marks}
                min={20} max={70}
                onChange={handleValue}
            />
    );
}