import React from 'react'
import {useEffect, useState} from 'react'
import {Button, MenuItem, TextField, ThemeProvider} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import './index.css'
import {theme} from "../../../theme";
import EditTaskItem from "./EditTaskItem";
import {getTitleAndColor} from "../../../utils/generalCalculation";
import {updateFireBaseData} from "../../../utils/handleFireBase";
import moment from "moment";
import useStore from "../../../store/store";
import {colorList} from "../../../utils/colorList";


function EditTaskTime({open, setOpen, editItem, todayData, taskLists, taskByDate}) {
    const [originalColor, originalName] = getTitleAndColor(editItem)
    const [warning, setWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('')
    const [color, setColor] = useState('');
    const [name, setName] = useState('');
    const updateTaskList = useStore(state => state.updateTaskList);

    const itemData = todayData && todayData[editItem]
    const [recordChange, setRecordChange] = useState([])

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

    const handleClose = async () => {
        // let newData = todayData;
        // let newDataByDate = taskByDate;
        // const currentDate = moment().format("MM/DD/YYYY");
        //
        // recordChange.forEach(([originalSeconds, value], index) => {
        //     let endTime = moment(itemData[index]['endTime'])
        //     let newStartTime = endTime.clone().subtract(value, 'second')
        //
        //
        //     if(!endTime.isSame(newStartTime, 'd')){
        //         newStartTime = endTime.clone().startOf('day')
        //         value = moment(endTime).diff(moment(endTime.clone().startOf('day')), 'second')
        //     }
        //
        //     newData[editItem][index]['startTime'] = newStartTime.format('YYYY-MM-DDTHH:mm:ss.sssZ')
        //     newDataByDate[currentDate][editItem] = taskByDate[currentDate][editItem] - originalSeconds + value;
        // })
        // updateFireBaseData('todayData', newData)
        // updateFireBaseData('taskDataByDate', newDataByDate)

        if (!color || !name) {
            setWarningMessage('Fields can not be empty')
            setWarning(true);
            return;
        }
        const result = await updateTaskList(name, color);
        if (!result?.success) {
            setWarningMessage(result?.message)
            setWarning(true);
        } else {
            setOpen(false)
        }
    }

    return (
        <div>
            <ThemeProvider theme={theme}>
                <div>
                    <Dialog
                        PaperProps={{sx: { minHeight: '250px', width: '570px'}}}
                        open={open} onClose={handleClose}>
                        <DialogTitle>Edit Task</DialogTitle>
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
                            {
                                itemData && itemData.map((itemElement, index) =>{
                                    return(
                                        <EditTaskItem
                                            key={index}
                                            editItem={editItem}
                                            recordChange={recordChange}
                                            setRecordChange={setRecordChange}
                                            itemElement={itemElement}
                                            index={index}
                                        />
                                        )
                                })
                            }

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
                                Save
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