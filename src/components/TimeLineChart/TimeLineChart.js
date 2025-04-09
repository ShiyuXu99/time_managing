import * as React from 'react';
import Paper from '@mui/material/Paper';
import {
    Scheduler,
    DayView,
    Appointments,
    AppointmentTooltip,
    AppointmentForm,
    CurrentTimeIndicator,
} from '@devexpress/dx-react-scheduler-material-ui';
import moment from "moment";
import {useEffect, useState} from "react";
import useTaskStore from "../../store/useTasksStore";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import {EditingState, IntegratedEditing} from "@devexpress/dx-react-scheduler";
import {Appointment, CustomCommandButtons, CustomTimeIndicator, CustomTimeTableCell} from "./TimeLineTasksForm";
import {getCategoryById} from "../../utils/service/taskCategories";
import {TextField} from "@mui/material";
import {addTask, calculateDurationIfMissing, deleteTask, updateTask} from "../../utils/service/taskAPI";
import {getAuth} from "firebase/auth";
import {serverTimestamp, Timestamp} from "firebase/firestore";
import {removeSessionFromDailySummary, updateDailySummary} from "../../utils/service/dailySummaries";
import {format} from "date-fns";


export default function TimeLineChart() {
    const [chartData, setChartData] = useState([]);
    const [formVisible, setFormVisible] = useState(false);

    const todayTaskSummaries = useTaskStore(state => state.todayTaskSummaries);
    const taskCategories = useTaskStore(state => state.taskCategories);
    const { currentUser } = getAuth();
    const userId = currentUser?.uid;

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

                allHours.push(
                    moment(startDate).hour(),
                    moment(endDate).hour()
                );

                data.push({
                    title: taskCategoryData?.name || 'Task',
                    categoryId: id,
                    startDate: startDate,
                    endDate: endDate,
                    color: taskCategoryData?.color || '#4285F4',
                    taskId: item.taskId,
                    notes: item.notes,
                    id: item.id
                });
            });
        });

        setChartData(data);
    }, [todayTaskSummaries, taskCategories]);

    const handleCommitChanges = async ({added, changed, deleted}) => {
        const dateString = format(new Date(), 'yyyy-MM-dd');

        if (changed) {
            const changedId = Object.keys(changed)[0]
            const newData = changed[changedId]
            const sessionData = chartData.find((item) => item.id === Object.keys(changed)[0])
            const startTime = newData.startDate || sessionData.startDate;
            const endTime = newData.endDate || sessionData.endDate;
            const notes = newData.notes || sessionData.notes || '';
            const duration = calculateDurationIfMissing(startTime, endTime);

            const updateTaskData = {
                userId,
                startTime,
                endTime,
                notes,
                duration,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }


            const oldData = {
                dateString,
                categoryId: sessionData.categoryId,
                sessionId: sessionData.id
            }

            const updatedData = {
                ...oldData,
                duration,
                startTime,
                endTime,
                notes,
                taskId: sessionData.taskId
            }

            try {
                await updateTask(userId, sessionData.taskId, updateTaskData)
                await updateDailySummary(userId, oldData, updatedData)
            } catch (error) {
                console.error('Error creating category:', error);
                // setWarningMessage('Failed to create category. Please try again.');
            }
        }
        if(deleted){
            console.log(deleted)
            const sessionData = chartData.find((item) => item.id === deleted)
            await removeSessionFromDailySummary(userId, dateString,sessionData.categoryId, sessionData.id )
            await deleteTask(userId, sessionData.taskId)
        }
    }

    const CustomOverlay = ({ children, ...props }) => (
        <Dialog
            open={formVisible}
            onClose={
            () => setFormVisible(false)
        }
            fullWidth
            maxWidth="sm"
        >
            <DialogContent>{children}</DialogContent>
        </Dialog>
    );
    return (
        <Box sx={{ maxWidth: '400px' }}>
            <Paper>
                <Box sx={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: '95vh' }}>
                    <Scheduler data={chartData} height={'auto'}>
                        {/* 1. First: View Configuration */}
                        <DayView
                            startDayHour={0}
                            endDayHour={24}
                            cellDuration={60}
                            //disable double click add cell
                            timeTableCellComponent={CustomTimeTableCell}
                        />

                        <EditingState onCommitChanges={handleCommitChanges} />
                        <IntegratedEditing />

                        {/* 2. Core Components */}
                        <Appointments
                            appointmentComponent={Appointment}
                        />

                        {/* 3. Tooltip (MUST come after Appointments) */}
                        <AppointmentTooltip
                            showCloseButton
                            showOpenButton
                            showDeleteButton
                        />

                        {/* 4. Other Plugins */}
                        <CurrentTimeIndicator indicatorComponent={CustomTimeIndicator} />

                        {/* 5. Form (only include ONCE) */}
                        <AppointmentForm
                            visible={formVisible}
                            onVisibilityChange={setFormVisible}
                            overlayComponent={CustomOverlay}
                            selectComponent = {() => null}
                            booleanEditorComponent= {() => null}
                            // onCommitButtonClick={()=> alert('something')}
                        />
                    </Scheduler>
                </Box>
            </Paper>
        </Box>
    );
}