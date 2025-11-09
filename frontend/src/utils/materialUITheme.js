import { createTheme } from '@mui/material/styles'

// https://imagecolorpicker.com/color-code/318d3f
// primary - colore principale dell'applicazione
// altri valori possibili: primary, secondary, error, warning, info, success 
const theme = createTheme({
  palette: {
    primary: {
      main: '#318d3f',
      light: '#5aa465',
      dark: '#277132',
      contrastText: '#fff',
    },
  },
});

export default theme;