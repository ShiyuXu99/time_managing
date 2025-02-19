// import React from 'react'
// import "../App.css"
// import {SidebarData} from "./SidebarData";
// import { useNavigate } from "react-router-dom";
// import {
//     List,
//     ListItem,
//     ListItemButton,
//     ListItemIcon,
//     ListItemText, ThemeProvider
// } from "@mui/material";
// import TimerIcon from '@mui/icons-material/Timer';
// import PollIcon from '@mui/icons-material/Poll';
//
//
// function Sidebar(){
//     let navigate = useNavigate()
//
//     return(
//         <div className="Sidebar">
//                 <List  sx={{
//                     width: 200,
//                     alignItems:"center",
//                     justifyContent: "center",
//                 }}>
//                     {SidebarData.map((val) => (
//                         <ListItem
//                             key={val.title}
//                         >
//                             <ListItemButton
//                                 onClick={()=>{
//                                     navigate(val.link)
//                                 }}
//                             >
//                                 <ListItemIcon sx={{paddingLeft: '15px'}}>
//                                     {val.title === 'Timer' ?
//                                         <TimerIcon sx={{color: '#3c4c65'}}/>
//                                         :
//                                         <PollIcon sx={{color: '#3c4c65'}}/>}
//                                 </ListItemIcon>
//                                 <ListItemText
//                                     primary={val.title}
//                                     primaryTypographyProps={{
//                                         fontSize: 16,
//                                         fontFamily: 'Montserrat',
//                                         color: '#3c4c65',
//                                     }}
//                                 />
//                             </ListItemButton>
//                         </ListItem>
//                     ))}
//                 </List>
//         </div>
//     )
// }
//
// export default Sidebar

import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TimerIcon from "@mui/icons-material/Timer";
import PollIcon from "@mui/icons-material/Poll";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

export default function CollapsibleDrawer() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate(); // Hook to navigate programmatically

    const handleDrawerToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const menuItems = [
        { text: "Timer", icon: <TimerIcon />, path: "/" },
        { text: "Stats", icon: <PollIcon />, path: "/stats" },
    ];

    return (
        <Box sx={{ display: "flex" }}>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerToggle}>
                        {open ? (
                            theme.direction === "rtl" ? (
                                <ChevronRightIcon />
                            ) : (
                                <ChevronLeftIcon />
                            )
                        ) : (
                            theme.direction === "rtl" ? (
                                <ChevronLeftIcon />
                            ) : (
                                <ChevronRightIcon />
                            )
                        )}
                    </IconButton>
                </DrawerHeader>
                <List sx={{ marginTop: "auto", marginBottom: "auto" }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                }}
                                onClick={() => navigate(item.path)} // Navigate to the path
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
}
