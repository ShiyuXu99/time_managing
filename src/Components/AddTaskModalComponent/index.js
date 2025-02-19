import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircleIcon from '@mui/icons-material/Circle';
import { Button, MenuItem, TextField } from "@mui/material";
import React, { useState } from 'react';
import './index.css';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useStore from "../../store/store";
import { colorList } from "../../utils/colorList";

function AddTaskModal() {
    const [open, setOpen] = useState(false);
    const [color, setColor] = useState('');
    const [name, setName] = useState('');
    const [data, setData] = useState({});
    const [warning, setWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('')
    const addToTaskLists = useStore(state => state.addToTaskLists);


    const handleOpen = () => setOpen(true);

    const handleClose = async () => {
        if (!color || !name) {
            setWarningMessage('Fields can not be empty')
            setWarning(true);
            return;
        }
        const result = await addToTaskLists(name, color);
        if(!result?.success){
            setWarningMessage(result?.message)
            setWarning(true);
        }
        else{
            setOpen(false)
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
                            {warning && <p className="warning_message"> {warningMessage} </p>}
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
        </div>
    )
}

export default AddTaskModal