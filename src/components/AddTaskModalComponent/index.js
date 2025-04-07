import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircleIcon from '@mui/icons-material/Circle';
import { Button, MenuItem, TextField } from "@mui/material";
import React, { useState } from 'react';
import './index.css';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { colorList } from "../../utils/colorList";
import {useAuth} from "../../hooks/useAuth";
import {addTaskCategory} from "../../utils/service/taskCategories";

function AddTaskModal() {
    const [open, setOpen] = useState(false);
    const [color, setColor] = useState('');
    const [name, setName] = useState('');
    const [warningMessage, setWarningMessage] = useState('')
    const { currentUser } = useAuth();
    const userId = currentUser?.uid;
    const handleOpen = () => setOpen(true);


    const handleClose = async () => {
        const categoryData = {
            name: name,
            color: color,
            // icon: icon // Include icon if needed
        };

        try {
            const result = await addTaskCategory(userId, categoryData);
            console.log('Category created:', result);
            setOpen(false); // Close modal/dialog on success
            setName('');
            setColor('#3b82f6');
            // setIcon('task');
            // setSuccessMessage('Category created successfully!');

        } catch (error) {
            console.error('Error creating category:', error);
            if (error.message.includes('already exists')) {
                setWarningMessage(error.message);
            } else {
                setWarningMessage('Failed to create category. Please try again.');
            }
        }
    };

    return (
        <div>
                <Button
                    variant="outlined"
                    startIcon={<AddCircleIcon/>}
                    onClick={handleOpen}
                >
                    Add Task
                </Button>
                <div>
                    <Dialog
                        PaperProps={{sx: {minHeight: "25%", width: '570px'}}}
                        open={open} onClose={handleClose}>
                        <DialogTitle>Add Task</DialogTitle>
                        <DialogContent>
                            <div className="initialize_inputs">
                                <div className="color_input">
                                    <TextField
                                        id="outlined-select-currency"
                                        select
                                        label="Select Color"
                                        value={color}
                                        style={{width: 140}}
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
                                    // helperText="Name for task"
                                    color='primary'
                                    onChange={(event) => {
                                        setName(event.target.value)
                                    }}
                                />
                            </div>
                            {warningMessage && <p className="warning_message"> {warningMessage} </p>}
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
                                }}>Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </div>
        </div>
    )
}

export default AddTaskModal