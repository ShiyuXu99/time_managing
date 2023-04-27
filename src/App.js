import './App.css';
import Sidebar from "./components/Sidebar";
import Timer from './components/RightSectionPage/Timer'
import Stats from "./components/Stats";
import {
    BrowserRouter as Router,
    HashRouter,
    Routes,
    Route,
} from "react-router-dom";
import React from 'react';



function App() {
  return (
    <div className="App">

        <Sidebar/>
        <div className="mainContents">
                <Routes>
                    <Route path="/" element= {<Timer/>}/>
                    <Route path="/stats" element= {<Stats/>}/>
                </Routes>
        </div>


    </div>
  );
}

export default App;
