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
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

let currentDate = moment().format("YYYY-MM-DD");
const hour = moment().hour()

export default function TimeLineChart({showByHours}) {
    const [data, setData] = useState()

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'adminUser', 'todayData'), (doc) => {
            setData(doc.data());
        });
        return () => unsubscribe();

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
        <div className="time_graph_div">
            {/*<Paper >*/}
            {/*        <Scheduler*/}
            {/*            data={data}*/}
            {/*            height={'auto'}*/}
            {/*        >*/}
            {/*            <ViewState*/}
            {/*                currentDate={currentDate}*/}
            {/*            />*/}
            {/*            {showByHours?*/}
            {/*                <DayView*/}
            {/*                    startDayHour={hour -2 < 0 ? 0 : hour -  2}*/}
            {/*                    endDayHour={hour + 2}*/}
            {/*                    cellDuration={15}*/}
            {/*                />*/}
            {/*                :*/}
            {/*                <DayView*/}
            {/*                    startDayHour={0}*/}
            {/*                    endDayHour={24}*/}
            {/*                    cellDuration={30}*/}
            {/*                />*/}
            {/*            }*/}
            {/*            /!*<Appointments />*!/*/}
            {/*            <Appointments*/}
            {/*                appointmentComponent={Appointment}*/}
            {/*            />*/}
            {/*        </Scheduler>*/}
            {/*</Paper>*/}
        </div>

    );
}

