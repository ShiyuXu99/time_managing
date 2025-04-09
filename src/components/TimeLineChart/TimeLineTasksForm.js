import {Appointments, AppointmentTooltip, DayView} from "@devexpress/dx-react-scheduler-material-ui";
import moment from "moment";

export const CustomTimeIndicator = ({ top, ...restProps }) => (
    <div
        {...restProps}
        style={{
            ...restProps.style,
            top,
            height: '2px',
            backgroundColor: '#59b3ec', // your desired color
            zIndex: 10,
            position: 'absolute',
            width: '100%',
        }}
    />
);

export const Appointment = ({ style, data, ...restProps }) => (
    <Appointments.Appointment
        {...restProps}
        data={data}
        style={{
            ...style,
            backgroundColor: data.color,
            color: "white",
            fontSize: '0.875rem',
            padding: '8px',
            display: 'flex',
            justifyContent:'center',
            alignItems: 'center',
        }}
    >
        <span style={{ fontWeight: 'bold', marginRight: '8px' }}>
            {data.title}
        </span>
        <span style={{ fontSize: '0.75rem' }}>
            {moment(data.startDate).format('hh:mm A')} - {moment(data.endDate).format('hh:mm A')}
        </span>
    </Appointments.Appointment>
);

export const CustomTimeTableCell = (props) => {
    return (
        <DayView.TimeTableCell
            {...props}
            onDoubleClick={(e) => {
                e.stopPropagation();
            }}
        />
    );
};

export const CustomCommandButtons = ({ id, setFormVisible, setTooltipVisible, ...restProps }) => {
    // Customize Edit (Open) Button
    if (id === 'open') {
        return (
            <div>
                <AppointmentTooltip.CommandButton
                    id={id}
                    {...restProps}
                    text="Edit Event"
                    // icon={<EditIcon fontSize="small" />}
                    // style={{ color: '#1976d2' }} // Blue color
                    onExecute={() => {
                        setFormVisible(true);
                        setTooltipVisible(false);
                    }}
                />
            </div>
        );
    }

    // Customize Delete Button
    if (id === 'delete') {
        return (
            <AppointmentTooltip.CommandButton
                id={id}
                {...restProps}
                text="Delete Event"
                // icon={<DeleteIcon fontSize="small" />}
                style={{ color: '#d32f2f' }} // Red color
                // onExecute={(e) => {
                //     e.stopPropagation();
                // }}
            />
        );
    }

    return <AppointmentTooltip.CommandButton id={id} {...restProps} />;
};