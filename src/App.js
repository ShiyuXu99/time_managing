import './App.css';
import Sidebar from "./pages/Sidebar";
import Stats from "./pages/Stats";
import {
    Routes,
    Route,
} from "react-router-dom";
import React from 'react';
import {theme} from "./theme";
import {ThemeProvider} from "@mui/material";
import MainPage from './pages/MainPage';



function App() {
  return (
    <div className="App">
        <ThemeProvider theme={theme}>
        <Sidebar/>
        <div className="mainContents">
                <Routes>
                    <Route path="/" element= {<MainPage/>}/>
                    <Route path="/stats" element= {<Stats/>}/>
                </Routes>
        </div>
        </ThemeProvider>
    </div>
  );
}

export default App;
