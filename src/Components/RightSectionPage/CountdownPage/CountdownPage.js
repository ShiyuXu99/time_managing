import React from 'react'
import Modal from 'react-bootstrap/Modal';
import {Button} from "@mui/material";
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

  return (
    <div style={{textAlign: 'center'}}>
      <h1>react-timer-hook</h1>
      <div style={{fontSize: '100px'}}>
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <p>{isRunning ? 'Running' : 'Not running'}</p>
      <button onClick={start}>Start</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
}

export default function CountdownPage({ handleShowTimer, handleCloseTimer, showtimer }) {
  return (
    <div className="TimerRight">
        <div className='stopwatchSection'>
        <MyStopwatch 
         handleShowTimer={handleShowTimer}
         handleCloseTimer = {handleCloseTimer}
         showtimer = {showtimer}
        />
        </div>
     </div>
  );
}