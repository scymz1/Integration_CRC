import React from 'react'
import HardCodeTableHome from './HardCodeTable'
import { Button,Typography, Card, CardContent, Box } from "@mui/material";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const featuredPosts = {
    title: "Data Visualization - Scatter",
    date: "June 14, Tue",
    description:
      "The sobriquet was first applied around 1879. While it was not intended as flattering, it washardly inappropriate. The Academicians at whom it was aimed had worked and socialized in NewYork, the Hudson's port city, and had painted the river and its shores with varying frequency.Most important, perhaps, was that they had all maintained with a certain fidelity a manner oftechnique and composition consistent with those of America's first popular landscape artist,Thomas Cole, who built a career painting the Catskill Mountain scenery bordering the HudsonRiver. A possible implication in the term applied to the group of landscapists was that many ofthem had, like Cole, lived on or near the banks of the Hudson. Further, the river had long servedas the principal route to other sketching grounds favored by the Academicians, particularly theAdirondacks and the mountains of Vermont and New Hampshire.different ways.",
  };


  
function TableHome() {
    const navigate = useNavigate();
    const GotoVoyagePage = () => {
      navigate('/');
    }
  return (
    <div>
         <Card sx={{ display: "flex" }} style={{ background: 'transparent', boxShadow: 'none'}}>
        <Box sx={{margin: 2, padding:2, borderRadius: '10px'}} style={{backgroundColor: "#f1f1f1"}}>
          <CardContent sx={{ flex: "1 0 auto" }} >
            <Button
              variant="text"
              style={{ fontSize: "24px" }}
              component={Link}
              to="/Bar"
            >
              Data Visualization - Bar Charts
            </Button>
            <div>
              <CardContent>
                <Typography variant="subtitle1" color="textSecondary">
                  {featuredPosts.date}
                </Typography>
                <Typography variant="subtitle1" paragraph>
                  {featuredPosts.description}
                </Typography>
                <Button variant="text" type="button" onClick={GotoVoyagePage}>
                  Continue reading...
                </Button>
              </CardContent>
            </div>
          </CardContent>
        </Box>

        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
           <HardCodeTableHome/>
          </CardContent>
        </Box>
      </Card>
    </div>
  )
}

export default TableHome