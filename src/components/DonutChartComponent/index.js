import { Doughnut } from 'react-chartjs-2';
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatSecondsToHourMinute } from "../../utils/generalCalculation";
import {useAuth} from "../../hooks";
import useTaskStore from "../../store/useTasksStore";
import {getCategoryById} from "../../utils/tasksCategoryHelper";

function DoughnutChart() {
    const [chartData, setChartData] = useState(null);
    const { currentUser } = useAuth();
    const todayTaskSummaries = useTaskStore(state => state.todayTaskSummaries);
    const taskCategories = useTaskStore(state => state.taskCategories);

    // Transform daily summary to chart.js format
    useEffect(() => {
        if (!todayTaskSummaries || !todayTaskSummaries.categories) {
            return; // Exit if data hasn't loaded
        }

        const labels = [];
        const data = [];
        const backgroundColor = [];

        Object.entries(todayTaskSummaries.categories).forEach(([id, category], index) => {
            const taskCategoryData = taskCategories && getCategoryById(id, taskCategories);
            labels.push(taskCategoryData?.name);
            data.push(category.duration / 60);
            backgroundColor.push(taskCategoryData?.color);
        });

        setChartData({
            labels,
            datasets: [{
                label: 'Time Spent (minutes)',
                data,
                backgroundColor,
                borderColor: '#fff',
                borderWidth: 2,
            }],
        });
    }, [todayTaskSummaries, taskCategories]);

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
            const { ctx } = chart;
            ctx.save();

            ctx.font = 'bold 30px montserrat';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            let xPos = chart.getDatasetMeta(0).data[0].x;
            let yPos = chart.getDatasetMeta(0).data[0].y;

            if (chart._active.length) {
                let labelName = chart.config.data.labels[chart._active[0].index];
                let valueNum = chart.config.data.datasets[chart._active[0].datasetIndex].data[chart._active[0].index];
                let color = chart.config.data.datasets[chart._active[0].datasetIndex].backgroundColor[chart._active[0].index];
                ctx.fillStyle = `${color}`;

                const [hour, min] = formatSecondsToHourMinute(valueNum * 60);
                ctx.fillText(`${labelName}: ${hour}h ${min} Min`, xPos, yPos);
            } else {
                const sumWithInitial = chart.config.data.datasets[0]['data'].reduce(
                    (accumulator, currentValue) => accumulator + currentValue, 0
                );
                const [hour, min] = formatSecondsToHourMinute(sumWithInitial * 60);
                ctx.fillText(`Total: ${hour}h ${min} Min`, xPos, yPos);
            }
            ctx.restore();
        }
    };

    return (
        <div>
            {chartData && chartData.labels.length > 0 ? (
                <Doughnut
                    style={{ width: '450px', height: '450px' }}
                    data={chartData}
                    options={options}
                    plugins={[hoverLabel]}
                />
            ) : (
                <div style={{
                    width: '450px',
                    height: '450px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'gray'
                }}>
                    No data available for today
                </div>
            )}
        </div>
    );
}

export default DoughnutChart;