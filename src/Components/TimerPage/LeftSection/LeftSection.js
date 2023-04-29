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

import './index.css'
import EditTaskTime from "./EditTaskTime";
import {theme} from "../../../theme";
import CustomizedSlider from "./Slider/Slider";
import {projectFirestore} from "../../../firebase/config";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function LeftSection({ handleShowTimer, showTimer }) {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState()
    const [editItem, setEditItem] = useState()


    const handleOpen = (val) => {
        setOpen(true)
        setEditItem(data[val])
    };

    useEffect(() => {
        projectFirestore.collection('adminUser').doc('taskLists').onSnapshot((doc) => {
            setData(doc.data())
        })
    }, [])


    return (
        <div className="left_container">
            <Item className="task_container">
                <div className="task_block">
                <div className="headerBox">
                    <p className="header_text">Task Lists</p>
                </div>
                <List className="list" >
                    {data && Object.keys(data).map((val) => (
                        <ListItem key={val}>
                            <ListItemAvatar>
                                <IconButton
                                    disabled= {showTimer}
                                    style={showTimer? { color: 'grey' } : { color: data[val].color }}
                                >
                                    <CircleIcon sx={{ fontSize: "28px" }} />
                                </IconButton>
                            </ListItemAvatar>
                            <ListItemText
                                primaryTypographyProps={{ fontSize: '14px' }}
                                secondaryTypographyProps={{ fontSize: '12px' }}
                                primary={data[val].title}
                                secondary={data[val].time}
                            />
                            <ListItemIcon>
                                <IconButton
                                    edge="end"
                                    disableFocusRipple
                                    disableRipple
                                    disabled= {showTimer}
                                    style={showTimer?  { color: 'grey', marginRight: '1.5px'}: { color: data[val].color, marginRight: '1.5px' }}
                                    onClick={() => handleOpen(val)}
                                >
                                    <DriveFileRenameOutlineIcon sx={{ fontSize: "18px" }} />
                                </IconButton>

                                <IconButton edge="end"
                                    disabled= {showTimer}
                                    style={showTimer? { color: 'grey' } : { color: data[val].color }}
                                    onClick={() => handleShowTimer(val)}
                                >
                                    <PlayCircleFilledWhiteIcon sx={{ fontSize: "30px" }} />
                                </IconButton>
                            </ListItemIcon>
                        </ListItem>
                    ))}
                </List>
                </div>

                <Item className= "slider_container">
                    <div className="headerBox">

                        <p className="header_text">Add Time</p>
                    </div>

                    <div className="sliderBox">
                        <ThemeProvider theme={theme}>

                        <CustomizedSlider
                        />
                        </ThemeProvider>
                    </div>

                </Item>
            </Item>
            {open && <EditTaskTime
                open={open}
                setOpen={setOpen}
                editItem={editItem}
            />}

        </div>

    )
}


export default LeftSection;