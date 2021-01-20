import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2E151B',
      light: '#DA7B93'
    },
    secondary: {
      main: '#1C3334',
      light: '#376E6F',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#2F4454',
    },
  },
  // container: {
  //   auth: {
  //     maxWidth: 630,
  //     width: '100%',
  //     margin: '0 auto',
  //     padding: '55px 15px 25px'
  //   }
  // }
});

export default theme;