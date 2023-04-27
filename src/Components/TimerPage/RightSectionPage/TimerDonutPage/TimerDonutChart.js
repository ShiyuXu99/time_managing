import { Doughnut } from 'react-chartjs-2';
import './index.css'
import React, { useCallback, useState } from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

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
        </div>

    )

}
//     const [activeIndex, setActiveIndex] = useState(0);
//     const [data, setData] = useState([
//
//         { name: "学习", value: 3, color:'#3f7451' },
//         { name: "吃饭", value: 5, color:'#6E8E64'},
//         { name: "画画", value: 2, color:'#498583' },
//         { name: "睡觉", value: 4, color:'#FF8042' }
//     ])
//
//     const renderActiveShape = (props) => {
//         const RADIAN = Math.PI / 180;
//         const {
//             cx,
//             cy,
//             midAngle,
//             innerRadius,
//             outerRadius,
//             startAngle,
//             endAngle,
//             fill,
//             payload,
//             percent,
//             value
//         } = props;
//         const sin = Math.sin(-RADIAN * midAngle);
//         const cos = Math.cos(-RADIAN * midAngle);
//         const sx = cx + (outerRadius + 10) * cos;
//         const sy = cy + (outerRadius + 10) * sin;
//         const mx = cx + (outerRadius + 30) * cos;
//         const my = cy + (outerRadius + 30) * sin;
//         const ex = mx + (cos >= 0 ? 1 : -1) * 22;
//         const ey = my;
//         const textAnchor = cos >= 0 ? "start" : "end";
//
//         return (
//             <g>
//                 <text x={cx} y={cy - 10} dy={8}
//                       textAnchor="middle"
//                       fill={fill}
//                       fontSize={30}
//                 >
//                     {`${payload.name}`}
//                 </text>
//                 <text x={cx} y={cy + 30} dy={8}
//                       textAnchor="middle"
//                       fill={fill}
//                       fontSize={20}
//                 >
//                     {`${payload.value}`}
//                 </text>
//
//                 <Sector
//                     cx={cx}
//                     cy={cy}
//                     innerRadius={innerRadius}
//                     outerRadius={outerRadius}
//                     startAngle={startAngle}
//                     endAngle={endAngle}
//                     fill={fill}
//                 />
//                 <Sector
//                     cx={cx}
//                     cy={cy}
//                     startAngle={startAngle}
//                     endAngle={endAngle}
//                     innerRadius={outerRadius + 6}
//                     outerRadius={outerRadius + 10}
//                     fill={fill}
//                 />
//                 <path
//                     d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
//                     stroke={fill}
//                     fill="none"
//                 />
//                 <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
//                 <text
//                     x={ex + (cos >= 0 ? 1 : -1) * 12}
//                     y={ey}
//                     textAnchor={textAnchor}
//                     fill="#333"
//                     fontSize={20}
//                 >{`PV ${value}`}</text>
//                 <text
//                     x={ex + (cos >= 0 ? 1 : -1) * 12}
//                     y={ey}
//                     dy={18}
//                     textAnchor={textAnchor}
//                     fill="#999"
//                 >
//                     {/*{`(Rate ${(percent * 100).toFixed(2)}%)`}*/}
//                     {`Time Spend: ${payload.value} h`}
//                 </text>
//             </g>
//         );
//     };
//
//     const onPieEnter = useCallback(
//         (_, index) => {
//             setActiveIndex(index);
//         },
//         [setActiveIndex]
//     );
//
//
//     return (
//         <div className="donutGraph">
//
//             <ResponsiveContainer width="100%" height={450}>
//
//             <PieChart >
//                 <Pie
//                     activeIndex={activeIndex}
//                     activeShape={renderActiveShape}
//                     data={data}
//                     cx= "50%"
//                     cy={250}
//                     innerRadius={125}
//                     outerRadius={160}
//                     fill="#8884d8"
//
//                     dataKey="value"
//                     onMouseEnter={onPieEnter}
//                 >
//                     {data.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                 </Pie>
//             </PieChart>
//             </ResponsiveContainer>
//         </div>
//     )
//
// }
//
//
//
// // ChartJS.register(ArcElement, Tooltip, Legend);
// //
// // const data = {
// //     labels: ['画画', '学习', '吃饭'],
// //     datasets: [
// //         {
// //             label: '# of Votes',
// //             data: [12, 19, 3],
// //             backgroundColor: [
// //                 '#498583',
// //                 '#6E8E64',
// //                 '#7E9D86',
// //
// //             ],
// //             borderColor: [
// //                 '#498583',
// //                 '#6E8E64',
// //                 '#7E9D86',
// //             ],
// //             borderWidth: 1,
// //         },
// //     ]
// // };
// //
// // const options = {
// //     responsive: true,
// //     // maintainAspectRatio: false,
// //     cutout: '80%',
// //     plugins: {
// //         legend: {
// //             display: false,
// //         },
// //     },
// // };
//





export default TimerDonutChart;