import React, { useState } from 'react'
import { IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Slider } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import AddTaskModal from "./AddTaskModal/AddTaskModal";
import TimerModal from "../RightSectionPage/TimerModal";
import '../../App.css'


function LeftSection({ handleShowTimer, timerKey}) {
    const marks = [
        {
            value: 30,
            label: '30min',
        },
        {
            value: 60,
            label: '60min',
        },
    ];

    const data = [
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
            title: "学习",
            time: '3h',
            color: "#498583",
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
            title: "学习",
            time: '3h',
            color: "#498583",
        },
    ]

    // const [show, setShow] = useState(false);

    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    console.log(timerKey)


    return (
        <div className="leftSection">

            <div style={{ width: '90%', height: '14vh', paddingTop: '15px', paddingLeft: '20px' }}>
                <h3>Add Time</h3>
                <Slider
                    aria-label="Custom marks"
                    defaultValue={30}
                    step={5}
                    valueLabelDisplay="auto"
                    marks={marks}
                    min={20} max={70}
                />
            </div>

            <div style={{ width: '95%', marginLeft: '5px', marginTop: '20px' }}>
                <h3>Task Lists</h3>
                <List style={{ maxHeight: '65vh', overflow: 'auto' }} >
                    {data.map((val, key) => (
                        <ListItem style={{ marginTop: '-1%' }}>
                            <ListItemAvatar>
                                <IconButton
                                    style={{ color: val.color }}
                                >
                                    <CircleIcon sx={{ fontSize: "25px" }} />
                                </IconButton>
                            </ListItemAvatar>
                            <ListItemText
                                primaryTypographyProps={{ fontSize: '14px' }}
                                secondaryTypographyProps={{ fontSize: '12px' }}
                                primary={val.title}
                                secondary={val.time}
                            />
                            <ListItemIcon>
                                <IconButton
                                    edge="end"
                                    style={{ color: val.color, marginRight: '1.5px' }}
                                >
                                    <DriveFileRenameOutlineIcon sx={{ fontSize: "25px" }} />
                                </IconButton>

                                <IconButton edge="end"
                                    style={{ color: val.color }}
                                    onClick={handleShowTimer}
                                >
                                    <PlayCircleFilledWhiteIcon sx={{ fontSize: "25px" }} />
                                </IconButton>
                            </ListItemIcon>
                        </ListItem>
                    ))}
                </List>
            </div>
            {/* <TimerModal
                handleShow = {handleShow}
                show = {show}
                handleClose = {handleClose}
            /> */}
            <AddTaskModal />


        </div>

    )
}


export default LeftSection;