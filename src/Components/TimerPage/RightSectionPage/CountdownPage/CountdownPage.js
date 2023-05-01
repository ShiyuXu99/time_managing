import React, {useEffect, useState} from 'react'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import StopIcon from '@mui/icons-material/Stop';
import PauseIcon from '@mui/icons-material/Pause';
import {IconButton} from "@mui/material";
import './index.css'

import { useStopwatch } from 'react-timer-hook';
import {projectFirestore} from "../../../../firebase/config";
import {updateTodayDataAndTaskData} from "../../../utils/calculateTimeSpend";
import {updateFireBaseData} from "../../../utils/handleFireBase";

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


    const dbData = projectFirestore.collection('adminUser');

    // const [dataByToday, setDataByToday] = useState({})
    // const [taskByDate, setTaskByDate] = useState({})
    //
    // useEffect(() => {
    //     projectFirestore.collection('adminUser').doc('todayData').onSnapshot((doc) => {
    //         setDataByToday(doc.data())
    //     })
    //     getFireBaseData('todayData',setDataByToday);
    //     dbData.doc('taskDataByDate').onSnapshot((doc) => {
    //         setTaskByDate(doc.data())
    //     })
    // }, [])


  let handleStop = () => {
      pause();
      let totalSeconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)

      const [dateDataUpdated, todayDataUpdated] = updateTodayDataAndTaskData(totalSeconds, timerItem, taskByDate, todayData)

      updateFireBaseData('todayData', todayDataUpdated)
      updateFireBaseData('taskDataByDate', dateDataUpdated)

      setShowTimer(false);
  }

    useEffect(() => {
        if(Number(seconds > 6)) handleStop()
    }, [hours])

    const toggleStartPause = () => {
      if(isRunning) pause()
      else start()
  }

  return (
    <div className="countdownDiv">
      <div className="displayTime">
          <div className="displayHourOuter">
              <span className="counterLabel">
                  Hours
              </span>
              <div className="displayHour">
                  <span>{`${hours}:`}</span>
              </div>
          </div>

          <div className="displayHourOuter">
              <span className="counterLabel">
                  Minutes
              </span>
              <div className="displayHour">
                  <span>{`${minutes}:`}</span>
              </div>
          </div>

          <div className="displayHourOuter">
              <span className="counterLabel">
                  Seconds
              </span>
              <div className="displayHour">
                  <span>{`${seconds}`}</span>
              </div>
          </div>
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