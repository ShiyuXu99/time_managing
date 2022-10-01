import './App.css';
import Sidebar from "./Components/Sidebar";
import Timer from './Components/RightSectionPage/Timer'
import Stats from "./Components/Stats";
import {
    BrowserRouter as Router,
    HashRouter,
    Routes,
    Route,
} from "react-router-dom";


import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



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
