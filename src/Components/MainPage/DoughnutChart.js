import {Doughnut} from 'react-chartjs-2';
import React, {useEffect, useState} from "react";

import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {getTodayDoughnutData} from "../utils/calculateTodayData";
import {getFireBaseData} from "../utils/handleFireBase";
import {formatSecondsToHourMinute} from "../utils/generalCalculation";

function DoughnutChart() {
    const [data, setData] = useState()

    useEffect(() => {
        getFireBaseData('taskDataByDate', setData, getTodayDoughnutData)
    }, [])

    ChartJS.register(ArcElement, Tooltip, Legend);

    const options = {
        cutout: '80%',
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            animateScale: true
        },
    };

    const hoverLabel = {
        id: 'hoverLabel',

        afterDraw(chart, args, options) {
            const {ctx} = chart;
            ctx.save();

            ctx.font = 'bold 30px montserrat';
            // ctx.fillStyle = 'grey'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'

            let xPos = chart.getDatasetMeta(0).data[0].x;
            let yPos = chart.getDatasetMeta(0).data[0].y;

            if (chart._active.length) {
                let labelName = chart.config.data.labels[chart._active[0].index];
                let valueNum = chart.config.data.datasets[chart._active[0].datasetIndex].data[chart._active[0].index]
                let color = chart.config.data.datasets[chart._active[0].datasetIndex].backgroundColor[chart._active[0].index]
                ctx.fillStyle = `${color}`

                const [hour, min] = formatSecondsToHourMinute(valueNum * 60)


                ctx.fillText(`${labelName}: ${hour}h ${min} Min`, xPos, yPos)
            }
            else{
                const sumWithInitial = chart.config.data.datasets[0]['data'].reduce(
                    (accumulator, currentValue) => accumulator + currentValue, 0
                );
                const [hour, min] = formatSecondsToHourMinute(sumWithInitial * 60)

                ctx.fillText(`Total: ${hour}h ${min} Min`, xPos, yPos)
            }
            ctx.restore()
        }
    }


    return (
        <div>
            { data && data['labels'].length !== 0 ?
                <Doughnut
                    style={{width:'450px', height:'450px'}}
                data={data}
                options={options}
                plugins={[hoverLabel]}
            />
                :
                <div></div>
            }
        </div>

    )
}


export default DoughnutChart;