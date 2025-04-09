import * as React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Paper from '@mui/material/Paper';
import {useEffect, useRef} from "react";
import useTaskStore from "../../store/useTasksStore";
import {getCategoryById} from "../../utils/tasksCategoryHelper";
import {Box} from "@mui/material";
import './index.css'

// Setup the localizer using moment
const localizer = momentLocalizer(moment);

export default function TimeLineChartBig({ showByHours }) {
    const [events, setEvents] = React.useState([]);
    const todayTaskSummaries = useTaskStore(state => state.todayTaskSummaries);
    const taskCategories = useTaskStore(state => state.taskCategories);
    const calendarRef = useRef(null);

    useEffect(() => {
        if (calendarRef.current && events.length > 0) {
            const scrollTime = new Date().setHours(9, 0, 0, 0); // Set time to 9 AM
            calendarRef.current.scrollToTime(scrollTime);
        }
    }, [events]); // This effect runs when `events` are set

    // Transform data to React Big Calendar format
    useEffect(() => {
        if (!todayTaskSummaries || !todayTaskSummaries.categories) return;

        const formattedEvents = [];

        Object.entries(todayTaskSummaries.categories).forEach(([id, category]) => {
            const taskCategoryData = taskCategories && getCategoryById(id, taskCategories);

            category.sessions.forEach((session) => {
                const start = new Date(session.start.seconds * 1000);
                const end = new Date(session.end.seconds * 1000);

                formattedEvents.push({
                    title: taskCategoryData?.name || 'Task',
                    start,
                    end,
                    allDay: false,
                    resource: id,
                    color: taskCategoryData?.color || '#4285F4',
                });
            });
        });

        setEvents(formattedEvents);
    }, [todayTaskSummaries, taskCategories]);

    // Custom event component with colors
    const Event = ({ event }) => (
        <div style={{
            backgroundColor: event.color,
            color: 'white',
            padding: '2px 5px',
            borderRadius: '3px',
            height: '100%',
            fontSize: '0.85rem'
        }}>
            <strong>{event.title}</strong>
            <div>
                {/*{moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}*/}
            </div>
        </div>
    );

    // Custom toolbar to switch views
    const CustomToolbar = (toolbar) => {
        return (
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}>

          <button onClick={() => toolbar.onNavigate('PREV')}>Back</button>
          <span style={{ margin: '0 10px' }}>{toolbar.label}</span>
          <button onClick={() => toolbar.onNavigate('NEXT')}>Next</button>
            </div>
        );
    };

    return (
        <Box sx={{
            maxWidth: '400px',
            maxHeight: '100%'
        }}>
            <Paper>
                <Box sx={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    maxHeight: '95vh',
                }}>

                    <Calendar
                        localizer={localizer}
                        events={events}
                        defaultView={'day'}
                        views={'day'}
                        step={90}
                        timeslots={1}
                        components={{
                            event: Event,
                            toolbar: CustomToolbar,
                        }}
                        onSelectEvent={(event) => {
                            alert(`Selected: ${event.title}\nFrom: ${moment(event.start).format('LLL')}\nTo: ${moment(event.end).format('LLL')}`);
                        }}

                        eventPropGetter={(event) => ({
                            style: {
                                backgroundColor: event.color,
                                borderColor: event.color,
                            },
                        })}
                    />
                </Box>
            </Paper>
        </Box>
    );
}