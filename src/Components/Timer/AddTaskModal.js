import React from 'react'
import {Box, Button, MenuItem, Modal, TextField, Typography} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CircleIcon from '@mui/icons-material/Circle';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // alignItems: 'center',
    // textAlign:'center',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    '& .MuiTextField-root': { m: 2, width: '30ch' },
};



function AddTaskModal(){
    const [open, setOpen] = React.useState(false);
    const [currency, setCurrency] = React.useState('EUR');
    const currencies = [
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


    const handleChange = (event) => {
        setCurrency(event.target.value);
    };
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return(
        <div>
            <Button
                variant="outlined"
                startIcon={<AddCircleIcon />}
                onClick={handleOpen}
            >
                Add Task
            </Button>
            {/*<Button onClick={handleOpen}>Open modal</Button>*/}
            <Modal
                hideBackdrop
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Box sx={style}
                     component="form"
                     // sx={{
                     //     '& .MuiTextField-root': { m: 1, width: '25ch' },
                     // }}
                     noValidate
                     autoComplete="off"
                >
                    <h2>Add Tasks</h2>
                    <div>
                    <TextField
                        required
                        id="outlined-required"
                        label="Task Name"
                        // defaultValue="Please Enter Task Name"
                    />
                    </div>

                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Select"
                        value={currency}
                        onChange={handleChange}
                        helperText="Please select a color"
                    >
                        {currencies.map((option) => (
                            <MenuItem
                                key={option.value}
                                value= {option.value}
                            >
                                {/*{option.label}*/}
                                {<CircleIcon style={{ color: option.value}}/>}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button variant="outlined"  onClick={handleClose}> Add Task</Button>


                </Box>
            </Modal>
        </div>
    )
}

export default AddTaskModal