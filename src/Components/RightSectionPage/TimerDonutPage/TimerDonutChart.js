import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import '../../../App.css'
import React, { useCallback, useState } from "react";
import {PieChart, Pie, Sector, Cell, ResponsiveContainer} from "recharts";
import {Button} from "@mui/material";



function TimerDonutChart() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [data, setData] = useState([

        { name: "学习", value: 3, color:'#3f7451' },
        { name: "吃饭", value: 5, color:'#6E8E64'},
        { name: "画画", value: 2, color:'#498583' },
        { name: "睡觉", value: 4, color:'#FF8042' }
    ])

    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const {
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            startAngle,
            endAngle,
            fill,
            payload,
            percent,
            value
        } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? "start" : "end";

        return (
            <g>
                <text x={cx} y={cy - 10} dy={8}
                      textAnchor="middle"
                      fill={fill}
                      fontSize={30}
                >
                    {`${payload.name}`}
                </text>
                <text x={cx} y={cy + 30} dy={8}
                      textAnchor="middle"
                      fill={fill}
                      fontSize={20}
                >
                    {`${payload.value}`}
                </text>

                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path
                    d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                    stroke={fill}
                    fill="none"
                />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text
                    x={ex + (cos >= 0 ? 1 : -1) * 12}
                    y={ey}
                    textAnchor={textAnchor}
                    fill="#333"
                    fontSize={20}
                >{`PV ${value}`}</text>
                <text
                    x={ex + (cos >= 0 ? 1 : -1) * 12}
                    y={ey}
                    dy={18}
                    textAnchor={textAnchor}
                    fill="#999"
                >
                    {/*{`(Rate ${(percent * 100).toFixed(2)}%)`}*/}
                    {`Time Spend: ${payload.value} h`}
                </text>
            </g>
        );
    };

    const onPieEnter = useCallback(
        (_, index) => {
            setActiveIndex(index);
        },
        [setActiveIndex]
    );


    return (
        <div className="donutGraph">

            <ResponsiveContainer width="100%" height={450}>

            <PieChart >
                <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={data}
                    cx= "50%"
                    cy={250}
                    innerRadius={125}
                    outerRadius={160}
                    fill="#8884d8"

                    dataKey="value"
                    onMouseEnter={onPieEnter}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
            </PieChart>
            </ResponsiveContainer>
        </div>
    )

}



// ChartJS.register(ArcElement, Tooltip, Legend);
//
// const data = {
//     labels: ['画画', '学习', '吃饭'],
//     datasets: [
//         {
//             label: '# of Votes',
//             data: [12, 19, 3],
//             backgroundColor: [
//                 '#498583',
//                 '#6E8E64',
//                 '#7E9D86',
//
//             ],
//             borderColor: [
//                 '#498583',
//                 '#6E8E64',
//                 '#7E9D86',
//             ],
//             borderWidth: 1,
//         },
//     ]
// };
//
// const options = {
//     responsive: true,
//     // maintainAspectRatio: false,
//     cutout: '80%',
//     plugins: {
//         legend: {
//             display: false,
//         },
//     },
// };






export default TimerDonutChart;