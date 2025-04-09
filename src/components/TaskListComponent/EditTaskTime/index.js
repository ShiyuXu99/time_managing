import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {colorList} from "../../../utils/colorList";
import {deleteTaskCategory, updateTaskCategory} from "../../../utils/service/taskCategories";
import {getAuth} from "firebase/auth";
import {serverTimestamp} from "firebase/firestore";
import {addTask} from "../../../utils/service/taskAPI";

function EditTaskTime({ open, setOpen, taskInfo }) {
    const [taskName, setTaskName] = useState(taskInfo?.name || '');
    const [selectedColor, setSelectedColor] = useState(taskInfo.color);
    const [error, setError] = useState('');
    const { currentUser } = getAuth();
    const userId = currentUser?.uid;

    console.log(taskInfo)
    const handleClose = () => {
        setOpen(false);
        setError('');
    };

    const handleSave = async () => {
        if (!taskName.trim()) {
            setError('Task name is required');
            return;
        }

        const updateData = {
            name: taskName.trim(),
            color: selectedColor,
            icon: 'task',
            createdAt: serverTimestamp(),
        }

        try{
            await updateTaskCategory(userId, taskInfo.id, updateData);
            handleClose();
        } catch (error) {
            console.error('Error creating category:', error);
            // setWarningMessage('Failed to create category. Please try again.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task? It will make your records uncategorized')) {
            try {
                await deleteTaskCategory(userId, taskInfo.id);
                handleClose();
            } catch (error) {
                console.error('Error creating category:', error);
                // setWarningMessage('Failed to create category. Please try again.');
            }
            handleClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.1)' } }}
        >
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', gap: 2, pt: 1, alignItems: 'center' }}>
                    <FormControl sx={{ flex: 1 }} size="small">
                        <InputLabel id="color-select-label">Color</InputLabel>
                        <Select
                            labelId="color-select-label"
                            value={selectedColor}
                            label="Color"
                            onChange={(e) => setSelectedColor(e.target.value)}
                            renderValue={(selected) => (
                                <Box sx={{
                                    width: 20,
                                    height: 20,
                                    backgroundColor: selected,
                                    borderRadius: '50%'
                                }} />
                            )}
                        >
                            {colorList.map((color) => (
                                <MenuItem key={color.value} value={color.value}>
                                    <Box sx={{
                                        width: 20,
                                        height: 20,
                                        backgroundColor: color.value,
                                        borderRadius: '50%'
                                    }} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        autoFocus
                        margin="none"
                        label="Task Name"
                        type="text"
                        sx={{ flex: 2 }}
                        variant="outlined"
                        size="small"
                        required
                        value={taskName}
                        onChange={(e) => {
                            setTaskName(e.target.value);
                            setError('');
                        }}
                        error={!!error}
                        helperText={error}
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <IconButton
                        onClick={handleDelete}
                        color="error"
                        sx={{ ml: 1 }}
                    >
                        <DeleteIcon />
                    </IconButton>
                    <Box>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button
                            onClick={handleSave}
                            variant="contained"
                            sx={{ ml: 1 }}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default EditTaskTime;