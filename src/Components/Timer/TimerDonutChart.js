import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import '../../App.css'

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
    labels: ['画画', '学习', '吃饭'],
    datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3],
            backgroundColor: [
                '#498583',
                '#6E8E64',
                '#7E9D86',

            ],
            borderColor: [
                '#498583',
                '#6E8E64',
                '#7E9D86',
            ],
            borderWidth: 1,
        },
    ]
};

const options = {
    responsive: true,
    // maintainAspectRatio: false,
    cutout: '80%',
    plugins: {
        legend: {
            display: false,
        },
    },
};


function TimerDonutChart() {
    return (
        <div className="donutGraph">
            <Doughnut
                data={data}
                options={options}
                // height={'100vh'}
            />
        </div>
        )

}

export default TimerDonutChart;