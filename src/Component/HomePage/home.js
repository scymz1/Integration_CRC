import * as React from "react";
import {useEffect, useState} from "react";
import TrackVisibility from "react-on-screen";
import {Animated} from "react-animated-css";
import {Box, Button, Divider, List, ListItem} from "@mui/material";
import ResponsiveAppBar from "../NavBar";
import Container from "@mui/material/Container";
import BarComponent from "./HomePagePlotly/BarHome";
import PieComponent from "./HomePagePlotly/PieHome";
import ScatterComponent from "./HomePagePlotly/ScatterHome";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import TableHome from "./HomePagePlotly/TableHome/TableHome";
import PAST from "../PAST/PAST";
import {PASTContext} from "../PAST/PASTApp";
// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//   },
// });


export default function Home() {
  const HomeContext = React.createContext({});
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
  const dataSet = "0";
  const sample = [ <BarComponent/>, <PieComponent/>, < TableHome/>];
  return (
    // <ThemeProvider theme={darkTheme}>
      <div>
        <HomeContext.Provider value={{dataSet, page:"home"}}>
          <ResponsiveAppBar context={HomeContext}/>
        </HomeContext.Provider>
        <Container maxWidth={false}>
        <ScatterComponent/>
          <List>
            {sample.map((label, index) => (
              <ListItem key={index}>
                <TrackVisibility partialVisibility>
                  {({isVisible}) => (
                    <Animated
                      animationIn="slideInLeft"
                      animationOut="fadeOut"
                      animationInDelay="600"
                      isVisible={isVisible}
                      animationInDuration ="1600"
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
