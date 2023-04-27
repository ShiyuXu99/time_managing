import React from 'react'
import { useEffect, useState } from 'react'
import { Box, Button, MenuItem, Modal, TextField, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircleIcon from '@mui/icons-material/Circle';
import { projectFirestore } from '../../../../firebase/config'

import './index.css'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


function AddTaskModal() {
    const [open, setOpen] = useState(false);
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

    const handleOpen = () => setOpen(true);
    const handleClickOpen = () => {
        setOpen(true);
    };

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
            <div className="bottomButton"
            >
                <Button
                    variant="outlined"
                    startIcon={<AddCircleIcon />}
                    onClick={handleOpen}
                >
                    Add Task
                </Button>
            </div>
            {/* 
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
        
                    <div className='modal-form '>
                    <h2 className='AddTaskTitle'>Add Tasks</h2>
                    <div className='model-form-item'>
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Select Color"
                        value={color}
                        onChange={(event)=>{setColor(event.target.value)}}
                        // helperText="Please select a color"
                        style = {{width: 100}}
                    >
                        {colorList.map((option) => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                            >
                                {<CircleIcon style={{ color: option.value }} />}
                            </MenuItem>
                        ))}
                    </TextField>
                    <span className='space'>
                        <TextField
                            required
                            id="outlined-select-currency"
                            label="Task Name"
                            onChange={(event)=>{setName(event.target.value)}}
                        />
                    </span>
                    </div>
                    <div className='btndiv'>
                        <Button
                            variant="outlined"
                            // startIcon={<AddCircleOutlineIcon />}
                            onClick={handleClose}
                            style = {{width: 200}}
                        >
                            Add
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() =>setOpen(false)}
                            style = {{width: 200}}
                        >
                            Cancel
                        </Button>
                    </div>
                    </div>
            </Modal> */}




            <div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle >Add Task</DialogTitle>
                    <DialogContent>
                        <div className='model-form-item'>
                            <TextField
                                id="outlined-select-currency"
                                select
                                label="Select Color"
                                value={color}
                                onChange={(event) => { setColor(event.target.value) }}
                                // helperText="Please select a color"
                                style={{ width: 150 }}
                            >
                                {colorList.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {<CircleIcon style={{ color: option.value }} />}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <span className='space'>
                                <TextField
                                    required
                                    id="outlined-select-currency"
                                    label="Task Name"
                                    onChange={(event) => { setName(event.target.value) }}
                                />
                            </span>
                        </div>
                    </DialogContent>
                    <DialogActions>
                    <Button
                            variant="outlined"
                            // startIcon={<AddCircleOutlineIcon />}
                            onClick={handleClose}
                            // style={{ width: 200 }}
                        >
                            Add
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => setOpen(false)}>Cancel</Button>
                   
                    </DialogActions>
                </Dialog>
            </div>



        </div>
    )
}

export default AddTaskModal