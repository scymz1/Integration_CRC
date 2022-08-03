import * as React from "react";
import {useEffect, useState} from "react";
import TrackVisibility from "react-on-screen";
import {Animated} from "react-animated-css";
import {Box, Button, Divider, List, ListItem} from "@mui/material";
import Navbar from "../CommonComponent/NavBar";
import Container from "@mui/material/Container";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import BarComponent from "./Component/BarSample";
import PieComponent from "./Component/PieSample";
import ScatterComponent from "./Component/ScatterSample";
// import TableHome from "./HomePagePlotly/TableHome/TableHome";
// import SankeyHome from "./HomePagePlotly/SankeyHome";
// import StoryHome from "./HomePagePlotly/StoryHome";
// import NetworkHome from "./HomePagePlotly/NetworkHome";
//import PAST from "../PAST/PAST";
//import {PASTContext} from "../PAST/PASTApp";
// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//   },
// });
import {
  useWindowSize,
} from '@react-hook/window-size'


export default function Home() {
//   const HomeContext = React.createContext({});
  const [width, height] = useWindowSize()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // for smoothly scrolling
    });
  };
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
  }, []);
  const dataset = "0";
  const state = {dataset, pageType: "home"};
  const sample = [<ScatterComponent/>, <BarComponent/>, <PieComponent/>];
  return (
    // <ThemeProvider theme={darkTheme}>
      <div>
        <Navbar state={state}/>
        <Container maxWidth={false}>
          {/* <NetworkHome/> */}
          <List>
            {sample.map((label, index) => (
              <ListItem key={index}>
                <TrackVisibility offset={width<800?1200:200}>
                  {({isVisible}) => (
                    <Animated
                      animationIn="slideInLeft"
                      animationOut="fadeOut"
                      isVisible={isVisible}
                      animationInDelay= {400}
                      animationOutDelay= {500}
                      animationOutDuration = {3000}
                    >
                      {label}
                      <Divider/>
                    </Animated>
                  )}
                </TrackVisibility>
              </ListItem>
            ))}

          </List>
          <Box display="flex"
               justifyContent="flex-end"
               alignItems="flex-end" padding={4}>
            {showButton && (
              <Button variant="outlined" onClick={scrollToTop} startIcon={<ArrowDropUpIcon/>}>
                Up
              </Button>
            )}
          </Box>
        </Container>
      </div>
  );
}
