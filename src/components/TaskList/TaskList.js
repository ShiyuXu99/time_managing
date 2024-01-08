import React, {useEffect, useState} from 'react'
import {
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    Paper,
    styled, ThemeProvider
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import EditTaskTime from "./EditTaskTime";
import {theme} from "../../theme";
import CustomizedSlider from "../Slider/Slider";
import {projectFirestore} from "../../firebase/config";
import './index.css'
import {getFireBaseData, updateFireBaseData} from "../utils/handleFireBase";
import {calculateTimeByDate, recordTodayData, updateTodayDataAndTaskData} from "../utils/calculateTimeSpend";
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function TaskList({ handleShowTimer, showTimer, taskLists, taskByDate, todayData}) {
    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState()
    const defaultSliderVal = 30;
    const [sliderValue, setSliderValue] = useState(defaultSliderVal)
    const [hoveredItem, setHoveredItem] = useState(null);


    const handleOpen = (val) => {
        setOpen(true)
        setEditItem(val)
    };


    const handleAddTime= (timerItem)=> {
        const totalSeconds = sliderValue * 60;

        const [dateDataUpdated, todayDataUpdated] = updateTodayDataAndTaskData(totalSeconds, timerItem, taskByDate, todayData)
        updateFireBaseData('todayData', todayDataUpdated)
        updateFireBaseData('taskDataByDate', dateDataUpdated)
    }


    return (
        <div className="left_container">

            <Item className="task_container">
                <div className="task_block">
                <div className="headerBox">
                    <p className="header_text">Task Lists</p>
                </div>

                <CustomizedSlider
                    setSliderValue = {setSliderValue}
                    defaultValue = {defaultSliderVal}
                />

                <List className="list" >
                    {taskLists && Object.keys(taskLists).map((val) => (
                        <ListItem key={val}>
                            <ListItemAvatar>
                            <IconButton
                                disabled={showTimer}
                                style={{ color: taskLists[val].color }}
                                onClick={() => handleAddTime(val)}
                                onMouseEnter={() => setHoveredItem(val)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                {hoveredItem === val ? <AddCircleIcon sx={{ fontSize: "28px" }} /> : <CircleIcon sx={{ fontSize: "28px" }} />}
                                </IconButton>
                            </ListItemAvatar>
                            <ListItemText
                                primaryTypographyProps={{ fontSize: '14px' }}
                                secondaryTypographyProps={{ fontSize: '12px' }}
                                primary={taskLists[val].title}
                            />
                            <ListItemIcon>
                                <IconButton
                                    edge="end"
                                    disableFocusRipple
                                    disableRipple
                                    disabled= {showTimer}
                                    style={showTimer?  { color: 'grey', marginRight: '1.5px'}: { color: taskLists[val].color, marginRight: '1.5px' }}
                                    onClick={() => handleOpen(val)}
                                >
                                    <DriveFileRenameOutlineIcon sx={{ fontSize: "18px" }} />
                                </IconButton>

                                <IconButton edge="end"
                                    disabled= {showTimer}
                                    style={showTimer? { color: 'grey' } : { color: taskLists[val].color }}
                                    onClick={() => handleShowTimer(val)}
                                >
                                    <PlayCircleFilledWhiteIcon sx={{ fontSize: "30px" }} />
                                </IconButton>
                            </ListItemIcon>
                        </ListItem>
                    ))}
                </List>
                </div>

            </Item>
            {open && <EditTaskTime
                open={open}
                setOpen={setOpen}
                editItem={editItem}
                todayData={todayData}
                taskLists={taskLists}
                taskByDate={taskByDate}
            />}

        </div>

    )
}


export default TaskList;