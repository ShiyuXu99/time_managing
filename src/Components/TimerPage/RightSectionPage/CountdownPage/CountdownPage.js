import React from 'react'
import Modal from 'react-bootstrap/Modal';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import StopIcon from '@mui/icons-material/Stop';
import PauseIcon from '@mui/icons-material/Pause';
import {Button, IconButton} from "@mui/material";
import './index.css'

import { useStopwatch } from 'react-timer-hook';

function MyStopwatch({ handleShowTimer, handleCloseTimer, showtimer}) {
  let {
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
  } = useStopwatch({ autoStart: true });

  let convertTime = (s) =>{
    if(s < 10) return `0${s}`
    else return s
  }
  seconds = convertTime(seconds)
  minutes = convertTime(minutes)
  hours = convertTime(hours)

  let handleStop = () =>{
    pause();
    handleCloseTimer();
  }

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
                    onClick={handleStop}
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

export default function CountdownPage({ handleShowTimer, handleCloseTimer, showtimer }) {
  return (
    <div className="TimerRight">
        <MyStopwatch
         handleShowTimer={handleShowTimer}
         handleCloseTimer = {handleCloseTimer}
         showtimer = {showtimer}
        />
     </div>
  );
}