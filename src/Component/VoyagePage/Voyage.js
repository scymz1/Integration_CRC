import Filter from "./Filter/Filter";
import * as React from 'react';
import {Box, Tab, Tabs, Typography} from "@mui/material";
import Scatter from "./Result/Scatter";
import Pie from "./Result/Pie";
import Bar from "./Result/Bar";
import Table from "./Result/Table";
import ResponsiveAppBar from "../NavBar";
import {useParams} from 'react-router';


function TabPanel(props) {
    const {children, value, index} = props;


    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            style={{width: '100%'}}
            // id={`vertical-tabpanel-${index}`}
            // aria-labelledby={`vertical-tab-${index}`}
            // {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default function Voyage() {
    const [value, setValue] = React.useState(0);

    const { id } = useParams();

    React.useEffect(()=>{
        switch (id) {
            case "Scatter":
                setValue(0)
                break;
            case "Bar":
                setValue(1)
                break;
            case "Pie":
                setValue(2)
                break;
            case "Table":
                setValue(3)
                break;
            default:
                setValue(0)
        }
        //setValue(id?id:"Scatter")
    },[])

    const handleChange = (event, newValue) => {
        setValue(newValue)
    };

    return (
        <div>
            <ResponsiveAppBar/>
            <Filter/>
            <Box sx={{bgcolor: 'background.paper', display: 'flex'}}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    sx={{borderRight: 1, borderColor: 'divider'}}
                >
                    <Tab label="Scatter"/>
                    <Tab label="Bar"/>
                    <Tab label="Pie"/>
                    <Tab label="Table"/>
                </Tabs>
                    <TabPanel value={value} index={0}>
                        <Scatter/>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Bar/>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Pie/>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Table/>
                    </TabPanel>
            </Box>
        </div>
    );
}
