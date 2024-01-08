import React from 'react'
import {useEffect, useState} from 'react'
import {Button, MenuItem, TextField, ThemeProvider} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircleIcon from '@mui/icons-material/Circle';
import './index.css'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {theme} from "../../theme";
import {colorList} from "../utils/colorList";
import {projectFirestore} from "../../firebase/config"

function AddTaskModal() {
    const [open, setOpen] = useState(false);
    const [color, setColor] = useState('');
    const [name, setName] = useState('');
    const [data, setData] = useState({});

    const [warning, setWarning] = useState(false);

    useEffect(() => {
        projectFirestore.collection('adminUser').doc('taskLists').onSnapshot((doc) => {
            setData(doc.data())
        })
    }, [])

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        let key = color + '(╯°□°）╯︵ ┻━┻' + name;
        if(data && Object.keys(data).includes(key)) setWarning(true)
        else{
            let tempData = data? data : {};
            tempData[key] = {
                title: name,
                color: color,
                time: 0
            }
            projectFirestore.collection("adminUser").doc("taskLists").set(tempData)
            setWarning(false)
            setOpen(false);
        }

    }

    return (
        <div>
            <ThemeProvider theme={theme}>

                <Button
                    variant="outlined"
                    startIcon={<AddCircleIcon/>}
                    onClick={handleOpen}
                >
                    Add Task
                </Button>
                <div>
                    <Dialog
                        PaperProps={{sx: {height: "25%", width: '570px'}}}
                        open={open} onClose={handleClose}>
                        <DialogTitle>Add Task</DialogTitle>
                        <DialogContent>
                            <div className="initialize_inputs">
                                <div className="color_input">
                                    <TextField
                                        id="outlined-select-currency"
                                        select
                                        label="Select"
                                        value={color}
                                        helperText="select color"
                                        style={{width: 100}}
                                        onChange={(event) => {
                                            setColor(event.target.value)
                                        }}
                                        color='primary'
                                    >
                                        {colorList.map((option) => (
                                            <MenuItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {<CircleIcon style={{color: option.value}}/>}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>

                                <TextField
                                    className="text_input"
                                    required
                                    id="outlined-required"
                                    label="Task Name"
                                    helperText="Name for task"
                                    color='primary'
                                    onChange={(event) => {
                                        setName(event.target.value)
                                    }}
                                />
                            </div>
                            {warning && <p className="warning_message"> *This task has already been created. Please use another name.</p>}
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="outlined"
                                onClick={handleClose}
                                sx={{
                                    ':hover': {
                                        bgcolor: 'primary.main', // theme.palette.primary.main
                                        color: 'white',
                                    },
                                }}
                            >
                                Add
                            </Button>
                            <Button
                                variant="outlined"
                                color='primary'
                                sx={{
                                    ':hover': {
                                        bgcolor: 'primary.main', // theme.palette.primary.main
                                        color: 'white',
                                    },
                                }}
                                onClick={() => {
                                    setOpen(false)
                                    setWarning(false)
                                }}>Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </ThemeProvider>
        </div>
    )
}

export default AddTaskModal