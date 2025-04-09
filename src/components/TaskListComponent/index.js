import React, { useState } from 'react'
import {
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    Paper,
    styled,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import EditTaskTime from "./EditTaskTime";
import CustomizedSlider from "../SliderComponent/Slider";
import './index.css'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { serverTimestamp} from 'firebase/firestore';
import {getAuth} from "firebase/auth";
import {addTask} from "../../utils/service/taskAPI";
import useTaskStore from "../../store/useTasksStore";
import AddTaskModal from "../AddTaskModalComponent";
import {colorList} from "../../utils/colorList";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function TaskList({ handleShowTimer, showTimer}) {
    const [open, setOpen] = useState(false);
    const [editTaskItem, setEditItem] = useState()
    const defaultSliderVal = 30;
    const [sliderValue, setSliderValue] = useState(defaultSliderVal)
    const [hoveredItem, setHoveredItem] = useState(null);
    const taskLists = useTaskStore(state => state.taskCategories);
    const { currentUser } = getAuth();
    const userId = currentUser?.uid;

    const colorOrderMap = colorList.reduce((acc, colorObj, index) => {
        acc[colorObj.value.toLowerCase()] = index; // Order is determined by position in colorList
        return acc;
    }, {});

    const sortedTaskList = taskLists.slice().sort((a, b) => {
        const aIndex = colorOrderMap[a.color.toLowerCase()] ?? Infinity;
        const bIndex = colorOrderMap[b.color.toLowerCase()] ?? Infinity;
        return aIndex - bIndex;
    });


    const handleOpen = (val) => {
        setOpen(true)
        setEditItem(val)
    };

    const handleAddTime= async (categoryId, name)=> {
        const totalSeconds = sliderValue * 60;
        const now = new Date();
        const startTime = new Date(now.getTime() - totalSeconds * 1000);
        const endTime = now;

        const taskData = {
            name: name,
            // description: taskData.description || '',
            categoryId: categoryId || null,
            startTime: startTime,
            endTime: endTime,
            duration: totalSeconds || 0,
            createdAt: serverTimestamp(),
            notes:'',
        }

        try{
            const result = await addTask(userId, taskData)
            console.log(result, "add Tasks")
        } catch (error) {
            console.error('Error creating category:', error);
            // setWarningMessage('Failed to create category. Please try again.');
        }
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
                    {sortedTaskList?.map((val) => (
                        <ListItem key={val?.id}>
                            <ListItemAvatar>
                            <IconButton
                                disabled={showTimer}
                                style={{ color: val?.color }}
                                onClick={() => handleAddTime(val?.id, val?.name)}
                                onMouseEnter={() => setHoveredItem(val?.id)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                {hoveredItem === val?.id ? <AddCircleIcon sx={{ fontSize: "28px" }} /> : <CircleIcon sx={{ fontSize: "28px" }} />}
                                </IconButton>
                            </ListItemAvatar>
                            <ListItemText
                                primaryTypographyProps={{ fontSize: '14px' }}
                                secondaryTypographyProps={{ fontSize: '12px' }}
                                primary={val?.name}
                            />
                            <ListItemIcon>
                                <IconButton
                                    edge="end"
                                    disableFocusRipple
                                    disableRipple
                                    disabled= {showTimer}
                                    style={showTimer?  { color: 'grey', marginRight: '1.5px'}: { color: val?.color, marginRight: '1.5px' }}
                                    onClick={() => handleOpen(val)}
                                >
                                    <DriveFileRenameOutlineIcon sx={{ fontSize: "18px" }} />
                                </IconButton>

                                <IconButton edge="end"
                                    disabled= {showTimer}
                                    style={showTimer? { color: 'grey' } : { color: val?.color }}
                                    onClick={() => handleShowTimer(val?.id)}
                                >
                                    <PlayCircleFilledWhiteIcon sx={{ fontSize: "30px" }} />
                                </IconButton>
                            </ListItemIcon>
                        </ListItem>
                    ))}
                </List>
                </div>
                {open && <EditTaskTime
                    open={open}
                    setOpen={setOpen}
                    taskInfo={editTaskItem}
                />}
                <AddTaskModal/>
            </Item>

        </div>

    )
}


export default TaskList;