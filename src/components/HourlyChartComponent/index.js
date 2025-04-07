import './index.css';
import React from "react";
import DoughnutChart from "../DonutChartComponent";
import TimeLineChart from '../TimeLineChart';
import { Box } from "@mui/material";

function TodayCharts() {
    return (
        <Box
            sx={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                width: '100%',
            }}
        >
            <Box
                sx={{
                    flex: '1 1 0%',
                    minWidth: '500px',
                    borderRadius: '8px',
                }}
            >
                <TimeLineChart />
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
