import React from 'react'
import "../App.css"
import {SidebarData} from "./SidebarData";
import { useNavigate } from "react-router-dom";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText, ThemeProvider
} from "@mui/material";
import TimerIcon from '@mui/icons-material/Timer';
import PollIcon from '@mui/icons-material/Poll';

function InboxIcon() {
    return null;
}

function Sidebar(){
    let navigate = useNavigate()

    return(
        <div className="Sidebar">
                <List  sx={{
                    width: 220,
                    alignItems:"center",
                    justifyContent: "center",
                }}>
                    {SidebarData.map((val) => (
                        <ListItem
                            key={val.title}
                        >
                            <ListItemButton
                                onClick={()=>{
                                    navigate(val.link)
                                }}
                            >
                                <ListItemIcon sx={{paddingLeft: '15px'}}>
                                    {val.title === 'Timer' ?
                                        <TimerIcon sx={{color: '#3c4c65'}}/>
                                        :
                                        <PollIcon sx={{color: '#3c4c65'}}/>}
                                </ListItemIcon>
                                <ListItemText
                                    primary={val.title}
                                    primaryTypographyProps={{
                                        fontSize: 16,
                                        fontFamily: 'Montserrat',
                                        color: '#3c4c65',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            {/*        </Drawer>*/}
            {/*</div>*/}
                {/*{SidebarData.map((val, key)=>{*/}
                {/*    return(*/}
                {/*        <li className= "row"*/}
                {/*            id = {window.location.pathname === val.link ? "active" : ""}*/}
                {/*            key = {key}*/}
                {/*            onClick={()=>{*/}
                {/*                navigate(val.link)*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            <div id = "icon">*/}
                {/*                {val.icon}*/}
                {/*            </div>*/}
                {/*            <div id = "title">*/}
                {/*                {val.title}*/}
                {/*            </div>*/}
                {/*        </li>*/}
                {/*    )*/}
                {/*})}*/}
            {/*</ul>*/}
        </div>
    )
}

export default Sidebar