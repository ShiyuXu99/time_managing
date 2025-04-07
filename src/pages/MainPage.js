import React, {useEffect, useState} from 'react'
import './MainPage.css'
import TodayCharts from '../components/HourlyChartComponent'
import CountdownPage from './CountdownPage'
import {Paper, styled} from "@mui/material";
import Box from '@mui/material/Box';
import TaskList from '../components/TaskListComponent'
import {getAuth} from "firebase/auth";
import {getDailySummaries} from "../utils/service/dailySummaries";
import {isToday, parseISO} from 'date-fns';
import {getUserTaskCategoriesRealtime} from "../utils/service/taskCategories";
import useTaskStore from "../store/useTasksStore";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function MainPage() {
    const [showTimer, setShowTimer] = useState(false)
    const [timerItem, setTimerItem] = useState()
    const [taskByDate, setTaskByDate] = useState({})
    const setTaskCategories = useTaskStore(state => state.setTaskCategories);
    const setTaskSummaries = useTaskStore(state => state.setTaskSummaries);
    const setTodayTaskSummaries = useTaskStore(state => state.setTodayTaskSummaries);

    const { currentUser } = getAuth();
    const userId = currentUser?.uid;

    useEffect(() => {
        const unsubscribeTaskSummaries = getDailySummaries(
            { userId },
            (data) => {
                const today = new Date();
                const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                const todaysData = data.find(summary => summary.id === todayString);
                setTodayTaskSummaries(todaysData);
                setTaskSummaries(data);
            }
        );

        const unsubscribeTaskCategories = getUserTaskCategoriesRealtime(
            userId, (result) => {setTaskCategories(result);}
        );

        // Clean up on unmount or userId change
        return () => {
            try {
                unsubscribeTaskSummaries();
                unsubscribeTaskCategories();
            } catch (error) {
                console.error("Error unsubscribing:", error);
            }
        };
    }, [userId]);



    const handleShowTimer = (item) => {
        setTimerItem(item)
        setShowTimer(true)
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', padding:'7px', height:'100%'}}>
                <Box
                    sx={{
                        minWidth: '320px',
                        marginRight: '10px',
                    }}
                >
                    <TaskList
                        handleShowTimer={handleShowTimer}
                        showTimer={showTimer}
                        taskByDate={taskByDate}
                    />
                </Box>

                <Box
                    component={Item}
                    sx={{
                        flex: 1,
                        minWidth: '400px',
                    }}
                >
                    <Box sx={{ width: '100%' }}>
                        {showTimer ? (
                            <CountdownPage
                                setShowTimer={setShowTimer}
                                timerItem={timerItem}
                                taskByDate={taskByDate}
                            />
                        ) : (
                            <Box sx={{ width: '100%' }}>
                                <TodayCharts />
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default MainPage