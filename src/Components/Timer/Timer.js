import React from 'react'
import {useEffect, useState} from 'react'
import '../../App.css'
import {projectFirestore} from '../../firebase/config'
import TimerDonutChart from './TimerDonutChart'
import AddTaskModal from "./AddTaskModal";
import AddCircleIcon from '@mui/icons-material/AddCircle';import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import {
    Box, Button,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar, ListItemIcon,
    ListItemText,
    Paper,
    Slider,
    styled
} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import Avatar from '@mui/material/Avatar';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function Timer(){
    const [color, setColor] = useState(null)
    const [dense, setDense] = React.useState(false);

    const data = [
        {
            title: "学习",
            time: '3h',
            color: "#498583",
        },
        {
            title: "画画",
            time:'1h',
            color: "#959BB9",
        },
        {
            title: "吃饭",
            time: '2.5h',
            color: "#B98564",
        },
    ]

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

    function generate(element) {
        return data.map((value) =>
            React.cloneElement(element, {
                key: value,
            }),
        );
    }

    useEffect(()=>{
            projectFirestore.collection('adminUser').doc('colorCode').onSnapshot((doc)=>{
                setColor(doc.data());
            })
    },[])

    return(
        <Box sx={{ flexGrow: 1 }} className = "box">

            <Grid container spacing={2}>
                <Grid item xs = {2.5}>
                    <Item>
                        <div className="leftSection">
                            <Grid container >
                                <Grid item xs={12} alignItems={"center"}>
                                    <Box sx={{ width: '80%', height: '20vh', paddingTop: '30px', paddingLeft: '20px' }}>
                                        <h2>Add Time</h2>
                                        <Slider
                                            aria-label="Custom marks"
                                            defaultValue={30}
                                            step={10}
                                            valueLabelDisplay="auto"
                                            marks={marks}
                                            min={20} max={70}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <box>
                                        <h2>Task Lists</h2>
                                        <List dense={dense}>
                                            {data.map((val, key) => (
                                                <ListItem secondaryAction={
                                                    <IconButton
                                                        edge="end"
                                                        style={{ color: val.color}}>
                                                        <AddCircleIcon sx={{ fontSize: "30px" }}/>
                                                    </IconButton>
                                                }
                                                >
                                                    <ListItemAvatar>
                                                        <CircleIcon
                                                            style={{ color: val.color}}
                                                            sx={{ fontSize: "30px" }}
                                                        />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary= {val.title}
                                                        secondary={val.time}
                                                    />


                                                    {/*<IconButton edge="end">*/}
                                                    {/*    <AddCircleIcon style={{ color: val.color}}/>*/}
                                                    {/*</IconButton>*/}

                                                </ListItem>
                                            ))}
                                        </List>


                                        <AddTaskModal/>

                                    </box>
                                </Grid>
                            </Grid>

                        </div>
                    </Item>
                </Grid>
                <Grid item xs = {9.5}>
                    <Item>
                        <div className="rightSection">
                            <TimerDonutChart/>
                        </div>
                    </Item>

                </Grid>
            </Grid>
            </Box>
    )
}

export default Timer