import React from 'react'
import {
    Paper,
    styled
} from "@mui/material";
import './Stats.css'
import TimeLineChart from "../components/StatesData/TimeLineChart/TimeLineChart";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function Stats(){
    return (
        <div className="stat_page">
                <div className="left_stat_container">
                    <div className="upper_row_container">
                        <Item className="graph_container">

                        </Item>
                        <Item className="graph_container">

                        </Item>
                    </div>

                    <div className="lower_row_container">
                        <Item className="main_graph_container">

                        </Item>
                    </div>
                </div>
            <div className="right_stat_container">
                <Item className="time_graph_container">
                    <div className="today_graph_container_big">
                    <TimeLineChart showByHours={false}/>
                    </div>
                </Item>
            </div>

        </div>
    )
}

export default Stats