import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
  },
});

export const switchTheme = createTheme({
  palette: {
    mode: 'dark',
    dataSet: {
      main:"#1b5e20"
    },
    type:{
      main:"#311b92"
    }
  },
  // components: {
  //   MuiToggleButton: {
  //     styleOverrides: {
  //       root: {
  //         "&.Mui-selected": {
  //           color: "#1b5e20",
  //         },
  //       }
  //     }
  //   }
  // }
})