import React from 'react'
import { useEffect, useState } from 'react'
import '../../App.css'
import './style.css'
import { projectFirestore } from '../../firebase/config'
import TimerDonutChart from './RightSectionPage/TimerDonutPage/TimerDonutChart'
import LeftSection from "./LeftSection/LeftSection";
import CountdownPage from './RightSectionPage/CountdownPage/CountdownPage'
import {
     Button, FormControl,
    Grid,
    Paper, Select,
    Slider,
    styled
} from "@mui/material";
import Box, { BoxProps } from '@mui/material/Box';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function TimerPage() {
    const [color, setColor] = useState(null)
    const [dense, setDense] = React.useState(false);



    const handleChange = (event) => {
        setColor(event.target.value);
    };

    // const dataList = [
    //     {
    //         title: "学习",
    //         time: '3h',
    //         color: "#498583",
    //     },
    //     {
    //         title: "画画",
    //         time: '1h',
    //         color: "#959BB9",
    //     },
    //     {
    //         title: "吃饭",
    //         time: '2.5h',
    //         color: "#B98564",
    //     }, {
    //         title: "学习",
    //         time: '3h',
    //         color: "#498583",
    //     },
    //     {
    //         title: "画画",
    //         time: '1h',
    //         color: "#959BB9",
    //     },
    // ]

    const [showtimer, setShowTimer] = useState(false)

    const handleShowTimer = () => {
        setShowTimer(true)
    }
    const handleCloseTimer = () => {
        setShowTimer(false)
    }
    useEffect(() => {
        projectFirestore.collection('adminUser').doc('colorCode').onSnapshot((doc) => {
            setColor(doc.data());
        })
    }, [])

    return (
        <div style={{ width: '100%', height: '100%' }}>

        <Box className="box">
                <Box
                    sx={{ display: 'flex', flexWrap: 'wrap' }}
                >
                    <Item className="leftBlock">
                        <LeftSection
                        handleShowTimer={handleShowTimer}
                        handleCloseTimer = {handleCloseTimer}
                        showtimer = {showtimer}
                    /></Item>
                    <Item className="rightBlock">
                        <div className="rightSection">
                                {showtimer ?
                                    <CountdownPage
                                        handleShowTimer={handleShowTimer}
                                        handleCloseTimer = {handleCloseTimer}
                                        showtimer = {showtimer}
                                    />
                                    :
                                    <div className="graphRight">
                                    <TimerDonutChart />
                                    </div>

                                }
                        </div>
                    </Item>
                </Box>
        </Box>
        </div>

    )
}

export default TimerPage