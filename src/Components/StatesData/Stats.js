import React from 'react'
import {
    Paper,
    styled
} from "@mui/material";
import Box from '@mui/material/Box';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function Stats(){
    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/*<Box className="box">*/}
                {/*<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>*/}
                <div className="stat_container">
                    <div className="upper_row_container">
                        <div className="graph_container">

                        </div>
                        <div className="graph_container">

                        </div>
                        <div className="graph_container">

                        </div>
                    </div>
                </div>
                    <Item className="leftBlock">
                        </Item>
                    <Item className="rightBlock">
                        <div className="rightSection">

                        </div>
                    </Item>
                {/*</Box>*/}
            {/*</Box>*/}
        </div>
    )
}

export default Stats