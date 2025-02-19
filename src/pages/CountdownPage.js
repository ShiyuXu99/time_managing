import React, {useEffect, useState} from 'react'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import StopIcon from '@mui/icons-material/Stop';
import PauseIcon from '@mui/icons-material/Pause';
import {IconButton} from "@mui/material";
import './index.css'

import { useStopwatch } from 'react-timer-hook';
import {projectFirestore} from "../firebase/config";
import {updateTodayDataAndTaskData} from "../utils/calculateTimeSpend";
import {updateFireBaseData} from "../utils/handleFireBase";
import CircleIcon from "@mui/icons-material/Circle";

function MyStopwatch({ setShowTimer, timerItem, taskByDate, todayData}) {
  let {
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
      reset,
  } = useStopwatch({ autoStart: true });

  let convertTime = (s) =>{
    if(s < 10) return `0${s}`
    else return s
  }
  seconds = convertTime(seconds)
  minutes = convertTime(minutes)
  hours = convertTime(hours)

  let handleStop = () => {
      pause();
      let totalSeconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
      const [dateDataUpdated, todayDataUpdated] = updateTodayDataAndTaskData(totalSeconds, timerItem, taskByDate, todayData)
      updateFireBaseData('taskDataByDate', dateDataUpdated)
      updateFireBaseData('todayData', todayDataUpdated)
      setShowTimer(false);
  }

    useEffect(() => {
        if(Number(seconds > 6)) handleStop()
    }, [hours])

    const toggleStartPause = () => {
      if(isRunning) pause()
      else start()
  }

  const timeMap = ['Hours', 'Minutes', 'Seconds']
    const time = [hours, minutes, seconds]

  return (
    <div className="countdownDiv">
        <div>
            <CircleIcon sx={{ fontSize: "28px" }} />
        </div>
        <div className="displayTime">
        {timeMap.map((val, index) => {
            return (
                    <div className="displayHourOuter">
                          <span className="counterLabel">
                              {val}
                          </span>
                        <div className="displayHour">
                            <span>{val === 'Seconds' ? `${time[index]}` : `${time[index]}:`}</span>
                        </div>
                    </div>
            )
        })}
      </div>
      {/*<p>{isRunning ? 'Running' : 'Not running'}</p>*/}
        <div className="iconClass">
            <div>
                <IconButton
                    sx={{
                        width: '30px',
                        height: '30px',
                        borderRadius: 99,
                        border: "1px solid",
                        borderColor: "#6e8cc4"
                    }}
                    aria-label="Start"
                    onClick={reset}
                >
                    <ReplayIcon sx={{
                        color: "#6e8cc4"
                    }} />
                </IconButton>
            </div>

            <div>
                <IconButton
                    sx={{
                        width: '60px',
                        height: '60px',
                        borderRadius: 99,
                        border: "1px solid",
                        borderColor: "#6e8cc4"
                    }}
                    aria-label="Start"
                    onClick={toggleStartPause}
                >
                    {isRunning? <PauseIcon sx={{
                        color: "#6e8cc4"
                    }} /> : <PlayArrowIcon sx={{
                        color: "#6e8cc4"
                    }} />
                    }
                </IconButton>
            </div>

            <div>
                <IconButton
                    sx={{
                        width: '30px',
                        height: '30px',
                        borderRadius: 99,
                        border: "1px solid",
                        borderColor: "#6e8cc4"
                    }}
                    aria-label="Start"
                    onClick={handleStop}
                >
                    <StopIcon sx={{
                        color: "#6e8cc4"
                    }} />
                </IconButton>
            </div>
        </div>

    </div>
  );
}

export default function CountdownPage({ setShowTimer, timerItem, taskByDate, todayData }) {

  return (
    <div className="TimerRight">
        <MyStopwatch
            setShowTimer = {setShowTimer}
            timerItem = {timerItem}
            taskByDate = {taskByDate}
            todayData= {todayData}
        />
     </div>
  );
}