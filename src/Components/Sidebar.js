import React from 'react'
import "../App.css"
import {SidebarData} from "./SidebarData";
import { useNavigate } from "react-router-dom";



function Sidebar(){
    let navigate = useNavigate()

    return(
        <div className="Sidebar">
            <ul className="SidebarList">
                {SidebarData.map((val, key)=>{
                    return(
                        <li className= "row"
                            // id = {window.location.pathname === val.link ? "active" : ""}
                            key = {key}
                            onClick={()=>{
                                // window.location.pathname = val.link
                                navigate(val.link)
                            }}
                        >
                            <div id = "icon">
                                {val.icon}
                            </div>
                            <div id = "title">
                                {val.title}
                            </div>


                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Sidebar