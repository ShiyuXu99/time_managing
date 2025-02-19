import './index.css'
import React from "react";
import AddTaskModal from "../AddTaskModalComponent";
import DoughnutChart from "../DonutChartComponent";
import TimeLineChart from '../TimeLineChart';


function ToodayCharts() {
    return (
        <div className="graphDiv" >
            <div className="today_graph_container_left">
                <TimeLineChart showByHours={true}/>
            </div>
            <div className="today_graph_container_right">
                <div className="graphDivInner" >
                    <DoughnutChart/>
                </div>

                <div className="add_task_btn_container">
                    <AddTaskModal/>
                </div>
            </div>


        </div>

)
}





export default ToodayCharts;