import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useTaskStore from '../store/useTasksStore';
import { getCategoryById } from '../utils/tasksCategoryHelper';

const localizer = momentLocalizer(moment);

const TimeLineChart = ({ showByHours }) => {
    const [events, setEvents] = useState([]);
    const [timeRange, setTimeRange] = useState({ startHour: 9, endHour: 17 });
    const currentDate = moment().toDate();

    const todayTaskSummaries = useTaskStore(state => state.todayTaskSummaries);
    const taskCategories = useTaskStore(state => state.taskCategories);

    const categoryMap = useMemo(() => {
        const map = {};
        (taskCategories || []).forEach(cat => {
            map[cat.id] = cat;
        });
        return map;
    }, [taskCategories]);

    useEffect(() => {
        if (!todayTaskSummaries || !todayTaskSummaries.categories) return;

        const newEvents = [];
        const allHours = [];

        Object.entries(todayTaskSummaries.categories).forEach(([id, category]) => {
            const taskCategoryData = categoryMap[id];

            category.sessions.forEach((session) => {
                const startMillis = session.start.seconds * 1000 + session.start.nanoseconds / 1000000;
                const endMillis = session.end.seconds * 1000 + session.end.nanoseconds / 1000000;

                const startDate = new Date(startMillis);
                const endDate = new Date(endMillis);

                allHours.push(moment(startDate).hour(), moment(endDate).hour());

                newEvents.push({
                    title: taskCategoryData?.name || 'Task',
                    start: startDate,
                    end: endDate,
                    categoryId: id,
                    color: taskCategoryData?.color || '#4285F4',
                });
            });
        });

        setEvents(newEvents);

        if (allHours.length > 0) {
            const minHour = Math.min(...allHours);
            const maxHour = Math.max(...allHours);
            const middle = Math.round((minHour + maxHour) / 2);
            const startHour = Math.max(0, middle - 4);
            const endHour = Math.min(24, middle + 4);
            setTimeRange({ startHour, endHour });
        }
    }, [todayTaskSummaries, categoryMap]);

    const eventStyleGetter = (event) => {
        const backgroundColor = event.color || '#4285F4';
        return {
            style: {
                backgroundColor,
                borderRadius: '6px',
                border: 'none',
                color: 'white',
                padding: '4px',
                fontSize: '0.85rem',
            },
        };
    };

    return (
        <div className="time_graph_div" style={{
            height: '100%',
            backgroundColor: '', // light blue background for the whole calendar
        }}>
            <Calendar
                localizer={localizer}
                events={events}
                defaultView={Views.DAY}
                views={{ day: true }}
                step={15}
                timeslots={2}
                defaultDate={currentDate}
                min={new Date(currentDate.setHours(timeRange.startHour, 0, 0))}
                max={new Date(currentDate.setHours(timeRange.endHour, 0, 0))}
                eventPropGetter={eventStyleGetter}
            />
        </div>
    );
};

export default TimeLineChart;
