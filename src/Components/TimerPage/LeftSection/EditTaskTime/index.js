import React from 'react'
import {useEffect, useState} from 'react'
import {Button, Input, InputAdornment, MenuItem, Modal, TextField, ThemeProvider, Typography} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircleIcon from '@mui/icons-material/Circle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import './index.css'
import {projectFirestore} from "../../../../firebase/config";
import {theme} from "../../../../theme";


function EditTaskTime({open, setOpen, editItem}) {
    const [color, setColor] = useState('');
    const [name, setName] = useState('');
    const [data, setData] = useState({});

    const colorList = [
        {
            value: '#597493',
        },
        {
            value: '#959BB9',
        },
        {
            value: '#7E9D86',
        },

    ];

    useEffect(() => {
        projectFirestore.collection('adminUser').doc('taskDatas').onSnapshot((doc) => {
            setData(doc.data())
        })
    }, [])


    const handleClose = () => {
        projectFirestore.collection("adminUser").doc("taskDatas").set({
            ...data,
            [name]: {
                name: name,
                color: color,
                time: 0
            }
        })
        setOpen(false);
    }

    return (
        <div>
            <ThemeProvider theme={theme}>
                <div>
                    <Dialog
                        PaperProps={{sx: { height: '380px', width: '570px'}}}
                        open={open} onClose={handleClose}>
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogContent>
                            <div className="initialize_inputs">
                                <div className="color_input">
                                    <TextField
                                        id="outlined-select-currency"
                                        select
                                        label="Select"
                                        value={editItem.color}
                                        helperText="Task color"
                                        style={{width: 70}}
                                        onChange={(event) => {
                                            setColor(event.target.value)
                                        }}
                                        color='primary'
                                        variant="standard"
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
                                    label="task name"
                                    defaultValue={editItem.title}
                                    helperText="Name for task"
                                    color='primary'
                                    variant="standard"
                                    onChange={(event) => {
                                        setName(event.target.value)
                                    }}
                                />
                            </div>

                            <div>
                                <h3>Edit Time Spend</h3>
                            </div>
                            <div className="initialize_inputs">
                                <div className="color_input">


                                    <TextField
                                        id="outlined-number"
                                        label="Hours"
                                        type="number"
                                        style={{width: 70}}
                                        defaultValue='1'

                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>


                                <TextField
                                    id="outlined-number"
                                    label="Minutes"
                                    type="number"
                                    style={{width: 120}}
                                    defaultValue='1'

                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </div>


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
                                onClick={() => setOpen(false)}>Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </ThemeProvider>
        </div>
    )
}

export default EditTaskTime