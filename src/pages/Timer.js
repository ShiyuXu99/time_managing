import React, {useEffect} from 'react'
import { useState } from 'react'
import './Timer.css'
import ToodayCharts from '../components/TodayChart/ToodayCharts'
import TaskList from "../components/TaskList/TaskList";
import CountdownPage from './CountdownPage'
import {
    Paper,
    styled
} from "@mui/material";
import Box from '@mui/material/Box';
import {getFireBaseData} from "../components/utils/handleFireBase";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function TimerPage() {
    const [showTimer, setShowTimer] = useState(false)
    const [timerItem, setTimerItem] = useState()
    const [taskLists, setTaskLists] = useState()
    const [taskByDate, setTaskByDate] = useState({})
    const [todayData, setTodayData] = useState({})



    useEffect(() => {
        getFireBaseData('taskLists', setTaskLists)
        getFireBaseData('todayData', setTodayData)
        getFireBaseData('taskDataByDate', setTaskByDate)

    }, [])


    const handleShowTimer = (item) => {
        setTimerItem(item)
        setShowTimer(true)
    }


    return (
        <div style={{ width: '100%', height: '100%' }}>
        <Box className="box">
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div className="leftBlock">
                        <TaskList
                        handleShowTimer={handleShowTimer}
                        showTimer = {showTimer}
                        taskLists = {taskLists}
                        taskByDate = {taskByDate}
                        todayData = {todayData}
                    />
                        </div>

                    <Item className="rightBlock">
                        <div className="rightSection">
                                {showTimer ?
                                    <CountdownPage
                                        setShowTimer = {setShowTimer}
                                        timerItem = {timerItem}
                                        taskByDate = {taskByDate}
                                        todayData = {todayData}
                                    />
                                    :
                                    <div className="graphRight">
                                    <ToodayCharts />
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