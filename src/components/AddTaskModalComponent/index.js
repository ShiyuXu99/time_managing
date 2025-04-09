import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircleIcon from '@mui/icons-material/Circle';
import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
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
    const [selectedColor, setSelectedColor] = useState('');
    const [taskName, setTaskName] = useState('');
    const [warningMessage, setWarningMessage] = useState('')
    const { currentUser } = useAuth();
    const userId = currentUser?.uid;
    const handleOpen = () => setOpen(true);


    const handleClose = async () => {
        const categoryData = {
            name: taskName,
            color: selectedColor,
            // icon: icon // Include icon if needed
        };

        try {
            const result = await addTaskCategory(userId, categoryData);
            console.log('Category created:', result);
            setOpen(false); // Close modal/dialog on success
            setTaskName('');
            setSelectedColor('');
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
                    <Dialog open={open} onClose={()=> setOpen(false)} maxWidth="xs" fullWidth>
                        <DialogTitle>Add Task</DialogTitle>
                        <DialogContent>
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                pt: 1,
                                alignItems: 'center' // This ensures vertical alignment
                            }}>
                                <FormControl sx={{ flex: 1 }} size="small">
                                    <InputLabel id="color-select-label">Color</InputLabel>
                                    <Select
                                        labelId="color-select-label"
                                        value={selectedColor}
                                        label="Select Color"
                                        onChange={(e) => setSelectedColor(e.target.value)}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{
                                                    width: 20,
                                                    height: 20,
                                                    backgroundColor: selected,
                                                    borderRadius: '50%'
                                                }} />
                                                {colorList.find(c => c.value === selected)?.label}
                                            </Box>
                                        )}
                                    >
                                        {colorList.map((color) => (
                                            <MenuItem key={color.value} value={color.value}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box sx={{
                                                        width: 20,
                                                        height: 20,
                                                        backgroundColor: color.value,
                                                        borderRadius: '50%'
                                                    }} />
                                                    {color.label}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    autoFocus
                                    margin="none" // Changed from "dense" to prevent misalignment
                                    label="Task Name"
                                    type="text"
                                    sx={{ flex: 2 }} // Gives more space to text field
                                    variant="outlined"
                                    size="small"
                                    required
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true // Ensures label doesn't float and cause misalignment
                                    }}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={()=> setOpen(false)}>Cancel</Button>
                            <Button
                                onClick={handleClose}
                                variant="contained"
                                disabled={!taskName.trim()}
                            >
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
        </div>
    )
}

export default AddTaskModal