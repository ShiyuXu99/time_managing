import { Doughnut } from 'react-chartjs-2';
import './index.css'
import React, { useCallback, useState } from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import AddTaskModal from "./AddTaskModal/AddTaskModal";
import {Button} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

function TimerDonutChart() {
    ChartJS.register(ArcElement, Tooltip, Legend);

    const options = {
        cutout:'80%',
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            animateScale: true
        },
    };

    const hoverLabel = {
        id: 'hoverLabel',
        afterDraw(chart, args, options) {
            const {ctx } = chart;
            ctx.save();

            if(chart._active.length){
                let labelName = chart.config.data.labels[chart._active[0].index];
                let valueNum = chart.config.data.datasets[chart._active[0].datasetIndex].data[chart._active[0].index]

                ctx.font='bold 30px sans-serif';
                ctx.fillStyle = 'grey'
                ctx.textAlign = 'center'
                ctx.textBaseline ='middle'

                let xPos = chart.getDatasetMeta(0).data[0].x;
                let yPos = chart.getDatasetMeta(0).data[0].y;
                ctx.fillText(`${labelName}: ${valueNum}`,xPos, yPos)
            }
            ctx.restore()
        }
    }

    const data = {
        labels: ['画画', '吃饭', '娱乐', '写作业', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
            },
        ],
    };

    return (
        <div className="graphDiv" >
            <div className="graphDivInner" >

            <Doughnut
                data={data}
                options={options}
                plugins = {[hoverLabel]}
            />
            </div>

            <div className="add_task_btn_container">
                <AddTaskModal/>
            </div>
        </div>

)
}





export default TimerDonutChart;