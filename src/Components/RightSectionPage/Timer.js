import React from 'react'
import { useEffect, useState } from 'react'
import '../../App.css'
import { projectFirestore } from '../../firebase/config'
import TimerDonutChart from './TimerDonutPage/TimerDonutChart'
import LeftSection from "../LeftSection/LeftSection";
import CountdownPage from './CountdownPage/CountdownPage'
import {
    Box, Button, FormControl,
    Grid,
    Paper, Select,
    Slider,
    styled
} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function TimerPage() {
    const [color, setColor] = useState(null)
    const [dense, setDense] = React.useState(false);



    const handleChange = (event) => {
        setColor(event.target.value);
    };

    const dataList = [
        {
            title: "学习",
            time: '3h',
            color: "#498583",
        },
        {
            title: "画画",
            time: '1h',
            color: "#959BB9",
        },
        {
            title: "吃饭",
            time: '2.5h',
            color: "#B98564",
        }, {
            title: "学习",
            time: '3h',
            color: "#498583",
        },
        {
            title: "画画",
            time: '1h',
            color: "#959BB9",
        },
    ]

    const [showtimer, setShowTimer] = useState(false)
    let timerKey = "this is key";


    const handleShowTimer = () => {
        setShowTimer(!showtimer)
    }

    useEffect(() => {
        projectFirestore.collection('adminUser').doc('colorCode').onSnapshot((doc) => {
            setColor(doc.data());
        })
    }, [])

    return (
        <Box sx={{ flexGrow: 1 }} className="box">

            <Grid container spacing={2}>
                <Grid item xs={3} className="leftBlock">
                    <Item>
                        <LeftSection
                            handleShowTimer={handleShowTimer}
                            timerKey={timerKey}
                        />
                    </Item>
                </Grid>

                <Grid item xs={9} className="rightBlock">
                    <Item>
                        <div className="rightSection">
                            <div className="graphRight">
                                {showtimer ?
                                    <CountdownPage />
                                    :
                                    <TimerDonutChart />
                                }
                            </div>

                        </div>
                    </Item>

                </Grid>
            </Grid>

        </Box>
    )
}

export default TimerPage