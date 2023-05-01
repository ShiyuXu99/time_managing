import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    DayView,
    Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import moment from "moment";
import {useEffect, useState} from "react";
import {projectFirestore} from "../../../firebase/config";
import {formatTodayGraphData} from "../../utils/calculateTodayData";

let currentDate = moment().format("YYYY-MM-DD");
const hour = moment().hour()

export default function TimeLineChart({showByHours}) {
    const [data, setData] = useState()

    useEffect(() => {
        projectFirestore.collection('adminUser').doc('todayData').onSnapshot((doc) => {
            const dataToday = formatTodayGraphData(doc.data())
            setData(dataToday)
        })

    }, [])


    const Appointment = ({ children, style, data, ...restProps }) => (
        <Appointments.Appointment
            {...restProps}
            data={data}
            style={{
                ...style,
                backgroundColor: data.color,
                color: "white"
            }}
        >
            {children}
        </Appointments.Appointment>
    );


    return (
        <div>
            <Paper>
                <Scheduler
                    data={data}
                    height={900}
                >
                    <ViewState
                        currentDate={currentDate}
                    />
                    {showByHours?
                        <DayView
                            startDayHour={hour -2 < 0 ? 0 : hour -  2}
                            endDayHour={hour + 2}
                            cellDuration={15}
                        />
                        :
                        <DayView
                            startDayHour={0}
                            endDayHour={24}
                            cellDuration={30}
                        />
                    }
                    {/*<Appointments />*/}
                    <Appointments
                        // appointmentComponent={Appointment}
                        appointmentComponent={Appointment}
                    />
                </Scheduler>
            </Paper>
        </div>

    );
}


//
// const Appointment = ({children, style, ...restProps}) => (
//     <Appointments.Appointment
//         {...restProps}
//         style={{
//             ...style,
//             backgroundColor: '#FFC107',
//             borderRadius: '8px',
//         }}
//     >
//         {children}
//     </Appointments.Appointment>
// );
