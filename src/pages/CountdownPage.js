import React, {useEffect, useState} from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import StopIcon from '@mui/icons-material/Stop';
import PauseIcon from '@mui/icons-material/Pause';
import CircleIcon from '@mui/icons-material/Circle';
import {IconButton, Box, Typography, TextField} from '@mui/material';
import { useStopwatch } from 'react-timer-hook';
import {getAuth} from "firebase/auth";
import {useTheme} from "@mui/material/styles";
import {serverTimestamp} from "firebase/firestore";
import {addTask} from "../utils/service/taskAPI";
import {getCategoryById} from "../utils/service/taskCategories";

export function CountdownPage({ setShowTimer, timerTaskId, taskCategories }) {
    const { currentUser } = getAuth();
    const userId = currentUser?.uid;
    const theme = useTheme();
    const taskCategoryData = getCategoryById(timerTaskId, taskCategories)

    const {
        seconds: rawSeconds,
        minutes: rawMinutes,
        hours: rawHours,
        isRunning,
        start,
        pause,
        reset,
    } = useStopwatch({ autoStart: true });

    const convertTime = (s) => (s < 10 ? `0${s}` : s);
    const seconds = convertTime(rawSeconds);
    const minutes = convertTime(rawMinutes);
    const hours = convertTime(rawHours);
    const [notes, setNotes] = useState('');

    const handleChange = (event) => {
        setNotes(event.target.value);
    };

    const handleStop = async () => {
        pause();
        const totalSeconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
        const now = new Date();
        const startTime = new Date(now.getTime() - totalSeconds * 1000);
        const endTime = now;

        const taskData = {
            name: taskCategoryData.name,
            categoryId: timerTaskId || null,
            startTime: startTime,
            endTime: endTime,
            duration: totalSeconds || 0,
            createdAt: serverTimestamp(),
            notes: notes,
        }

        try {
            const result = await addTask(userId, taskData)
            console.log(result, "add Tasks")
        } catch (error) {
            console.error('Error creating category:', error);
        }
        setShowTimer(false);
    };

    useEffect(() => {
        if (Number(rawSeconds) > 6) handleStop();
    }, [rawHours]);

    const toggleStartPause = () => {
        isRunning ? pause() : start();
    };

    const timeMap = ['Hours', 'Minutes', 'Seconds'];
    const time = [hours, minutes, seconds];

    return (
        <Box
            sx={{
                pt: '20vh',
                opacity: 0.9,
                backgroundColor: 'white',
                position: 'fixed',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: 1000,
            }}
        >
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
                    <Box>
                        <CircleIcon sx={{ fontSize: '28px', color: taskCategoryData.color }}/>
                    </Box>
                    <Box ml={1}>
                        <Typography sx={{ fontSize: '16px', color: theme.palette.text.secondary }}>{taskCategoryData.name}</Typography>
                    </Box>
                </Box>
                <Box display="flex" flexDirection="row" mt={2}>
                    {timeMap.map((val, index) => (
                        <Box key={val} display="flex" flexDirection="column" alignItems="center">
                            {/*<Typography sx={{ color: theme.palette.text.secondary }}>{val}</Typography>*/}
                            <Typography sx={{ fontSize: '90px', color: theme.palette.text.secondary }}>
                                {val === 'Seconds' ? `${time[index]}` : `${time[index]}:`}
                            </Typography>
                        </Box>
                    ))}
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mt={1} minWidth={'200px'}>
                    <IconButton
                        sx={{
                            width: '30px',
                            height: '30px',
                            borderRadius: 99,
                            border: '1px solid',
                            borderColor: theme.palette.primary.main,
                        }}
                        aria-label="Reset"
                        onClick={reset}
                    >
                        <ReplayIcon sx={{ color: theme.palette.primary.main }} />
                    </IconButton>

                    <IconButton
                        sx={{
                            width: '60px',
                            height: '60px',
                            borderRadius: 99,
                            border: '1px solid',
                            borderColor: '#6e8cc4',
                            mx: 2,
                        }}
                        aria-label="Start/Pause"
                        onClick={toggleStartPause}
                    >
                        {isRunning ? (
                            <PauseIcon sx={{ color: '#6e8cc4' }} />
                        ) : (
                            <PlayArrowIcon sx={{ color: '#6e8cc4' }} />
                        )}
                    </IconButton>

                    <IconButton
                        sx={{
                            width: '30px',
                            height: '30px',
                            borderRadius: 99,
                            border: '1px solid',
                            borderColor: '#6e8cc4',
                        }}
                        aria-label="Stop"
                        onClick={handleStop}
                    >
                        <StopIcon sx={{ color: '#6e8cc4' }} />
                    </IconButton>
                </Box>
                <Box mt={10} sx={{ display: 'flex', flexDirection: 'column', width: '350px', alignItems: 'center' }}>
                    <TextField
                        value={notes}
                        onChange={handleChange}
                        label="Enter your notes"
                        multiline
                        rows={3}
                        variant="outlined"
                        fullWidth
                    />
                </Box>
            </Box>
        </Box>
    );
}
