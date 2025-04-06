import './App.css';
import Sidebar from "./pages/Sidebar";
import Stats from "./pages/Stats";
import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import React from 'react';
import {theme} from "./theme";
import {ThemeProvider} from "@mui/material";
import MainPage from './pages/MainPage';
import {useAuth} from "./hooks/useAuth";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function PrivateRoute({ children }) {
    const { currentUser } = useAuth();
    return currentUser ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <Sidebar/>
                <div className="mainContents">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <MainPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/stats"
                            element={
                                <PrivateRoute>
                                    <Stats />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/login" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                    </Routes>
                </div>
            </ThemeProvider>
        </div>
    );
}

export default App;
