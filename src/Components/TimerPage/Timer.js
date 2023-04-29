import React from 'react'
import { useEffect, useState } from 'react'
import './style.css'
import { projectFirestore } from '../../firebase/config'
import TimerDonutChart from './RightSectionPage/TimerDonutPage/TimerDonutChart'
import LeftSection from "./LeftSection/LeftSection";
import CountdownPage from './RightSectionPage/CountdownPage/CountdownPage'
import {
    Paper, Select,
    Slider,
    styled
} from "@mui/material";
import Box, { BoxProps } from '@mui/material/Box';
import moment from "moment";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function TimerPage() {
    const [color, setColor] = useState(null)
    const [showTimer, setShowTimer] = useState(false)
    const [timerItem, setTimerItem] = useState()


    const handleShowTimer = (item) => {
        setTimerItem(item)
        setShowTimer(true)
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
                    <div className="leftBlock">
                        <LeftSection
                        handleShowTimer={handleShowTimer}
                        showTimer = {showTimer}
                    />
                        </div>

                    <Item className="rightBlock">
                        <div className="rightSection">
                                {showTimer ?
                                    <CountdownPage
                                        setShowTimer = {setShowTimer}
                                        timerItem = {timerItem}
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