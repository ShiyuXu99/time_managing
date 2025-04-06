import { Doughnut } from 'react-chartjs-2';
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatSecondsToHourMinute } from "../../utils/generalCalculation";
import {getDailySummaryRealtime} from "../../utils/service/taskAPI";
import {useAuth} from "../../hooks";
import useTaskStore from "../../store/useTaskCategoriesStore";

function DoughnutChart() {
    const [data, setData] = useState(null);
    const { currentUser } = useAuth(); // Get current user
    const { getCategoryById } = useTaskStore();

    useEffect(() => {
        if (!currentUser?.uid) return;

        // Subscribe to realtime daily summary updates
        const unsubscribe = getDailySummaryRealtime(
            currentUser.uid,
            new Date(),
            (summary) => {
                console.log(summary)
                const chartData = transformSummaryToChartData(summary);
                setData(chartData);
            }
        );

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [currentUser?.uid]);

    // Transform daily summary to chart.js format
    const transformSummaryToChartData = (summary) => {
        const labels = [];
        const chartData = [];
        const backgroundColors = [];
        const hoverColors = [];

        // Extract categories and durations
        Object.entries(summary.categories || {}).forEach(([categoryId, catData]) => {
            const category = getCategoryById(categoryId);
            labels.push(category?.name); // You'll need to implement getCategoryName
            chartData.push(catData.duration / 60); // Convert seconds to minutes
            backgroundColors.push(category?.color); // Implement getCategoryColor
            // hoverColors.push(getCategoryHoverColor(categoryId));
        });

        return {
            labels,
            datasets: [{
                data: chartData,
                backgroundColor: backgroundColors,
                hoverBackgroundColor: hoverColors,
                borderWidth: 1
            }]
        };
    };

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
            {data && data.labels.length > 0 ? (
                <Doughnut
                    style={{ width: '450px', height: '450px' }}
                    data={data}
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