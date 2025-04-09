import React from "react";
import DoughnutChart from "../DonutChartComponent";
import TimeLineChart from '../TimeLineChart/TimeLineChart';
import { Box } from "@mui/material";

function TodayCharts() {
    return (
        <Box
            sx={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
            }}
        >
            <Box
                sx={{
                    flex: '1 1 0%',
                    minWidth: '300px',
                    borderRadius: '8px',
                    maxHeight:'100%'
                }}
            >
                <TimeLineChart/>
            </Box>

            <Box
                sx={{
                    flex: '1 1 0%',
                    minWidth: '200px',
                    borderRadius: '8px',
                    padding: '16px',
                    alignContent:'center'
                }}
            >
                <DoughnutChart />
            </Box>
        </Box>
    );
}

export default TodayCharts;
