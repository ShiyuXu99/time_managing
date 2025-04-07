import * as React from 'react';
import Paper from '@mui/material/Paper';
import {
    Scheduler,
    DayView,
    Appointments,
    AppointmentTooltip,
    AppointmentForm,
} from '@devexpress/dx-react-scheduler-material-ui';
import moment from "moment";
import {useEffect, useState} from "react";
import useTaskStore from "../store/useTasksStore";
import {getCategoryById} from "../utils/tasksCategoryHelper";
import Box from "@mui/material/Box";


const CustomFormLayout = (props) => {
    return (
        <AppointmentForm.BasicLayout
            {...props}
            style={{
                width: '100%',
                maxWidth: '300px',
                padding: '16px',
                boxSizing: 'border-box',
            }}
        />
    );
};

export default function TimeLineChart() {
    const [chartData, setChartData] = useState([]);
    const [timeRange, setTimeRange] = useState({ startHour: 9, endHour: 17 }); // Default 9 AM - 5 PM
    const currentDate = moment().format("YYYY-MM-DD");

    const todayTaskSummaries = useTaskStore(state => state.todayTaskSummaries);
    const taskCategories = useTaskStore(state => state.taskCategories);

    // Transform daily summary to scheduler format and calculate optimal time range
    useEffect(() => {
        if (!todayTaskSummaries || !todayTaskSummaries.categories) {
            return;
        }

        const data = [];
        const allHours = [];

        Object.entries(todayTaskSummaries.categories).forEach(([id, category]) => {
            const taskCategoryData = taskCategories && getCategoryById(id, taskCategories);

            category.sessions.forEach((item) => {
                const startMillis = item.start.seconds * 1000 + item.start.nanoseconds / 1000000;
                const endMillis = item.end.seconds * 1000 + item.end.nanoseconds / 1000000;

                const startDate = new Date(startMillis);
                const endDate = new Date(endMillis);

                // Collect hours for range calculation
                allHours.push(
                    moment(startDate).hour(),
                    moment(endDate).hour()
                );

                data.push({
                    title: taskCategoryData?.name || 'Task',
                    startDate: startDate,
                    endDate: endDate,
                    color: taskCategoryData?.color || '#4285F4',
                    id: `${id}-${startMillis}` // Unique ID for each session
                });
            });
        });

        setChartData(data);

        // Calculate optimal 8-hour window if we have data
        if (allHours.length > 0) {
            const minHour = Math.min(...allHours);
            const maxHour = Math.max(...allHours);

            // Center the 8-hour window around the data
            const middleHour = Math.round((minHour + maxHour) / 2);
            const startHour = Math.max(0, middleHour - 4);
            const endHour = Math.min(24, middleHour + 4);

            setTimeRange({
                startHour,
                endHour,
                // Store these for reference if needed
                dataStartHour: minHour,
                dataEndHour: maxHour
            });
        }
    }, [todayTaskSummaries, taskCategories]);

    const Appointment = ({ children, style, data, ...restProps }) => (
        <Appointments.Appointment
            {...restProps}
            data={data}
            style={{
                ...style,
                backgroundColor: data.color,
                color: "white",
                borderRadius: '4px',
                fontSize: '0.875rem',
            }}
        >
            {children}
        </Appointments.Appointment>
    );

    return (
        <Box sx={{
            maxWidth: '500px',
            maxHeight: '95vh',          // max viewport height
            overflowY: 'auto',           // scroll vertically if content overflows
            overflowX: 'hidden',
        }}>
            <Paper>
                <Scheduler
                    data={chartData}
                    height={'auto'}
                    scrollingStrategy="standard"

                >
                        <DayView
                            startDayHour={0}
                            endDayHour={24}
                            cellDuration={60}
                        />
                    <Appointments
                        appointmentComponent={Appointment}
                    />
                    <AppointmentTooltip
                        showCloseButton
                        showOpenButton
                        showDeleteButton
                    />
                    <AppointmentForm
                        basicLayoutComponent={CustomFormLayout}
                    />
                </Scheduler>
            </Paper>
        </Box>
    );
}