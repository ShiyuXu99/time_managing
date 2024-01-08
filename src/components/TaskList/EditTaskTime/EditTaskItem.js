
import React, {useState} from 'react'

import './index.css'
import {TextField} from "@mui/material";
import {formatSecondsToHourMinute, getTitleAndColor} from "../../utils/generalCalculation";
import moment from "moment";
import CircleIcon from '@mui/icons-material/Circle';

function EditTaskItem({editItem, itemElement, setRecordChange, recordChange, index}) {
    const startTime = moment(itemElement['startTime'])
    const endTime = moment(itemElement['endTime'])

    const [originalColor, originalName] = getTitleAndColor(editItem)
    const seconds = moment(endTime).diff(moment(itemElement['startTime']), 'second')
    const min = Math.floor(seconds/60)



    const handleMinUpdate = (event) =>{
        let temp = recordChange
        temp[index] = [seconds, event.target.value * 60]

        setRecordChange(temp)
    }

    return (
        <div className="edit_task_item_container">
            <div className="label_container">
                <div>
                    <CircleIcon
                        style={{color: originalColor}}
                    />
                </div>
        <div>
            {startTime.format('hh:mm A')}
        </div>

            </div>
            <div className="task_edit_element">
                <TextField
                    id="outlined-number"
                    label="Minutes"
                    type="number"
                    style={{width: 120}}
                    defaultValue={min}
                    variant="standard"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleMinUpdate}
                />
            </div>


        </div>
    )
}

export default EditTaskItem