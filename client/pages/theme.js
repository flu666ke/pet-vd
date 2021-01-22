import { createMuiTheme } from '@material-ui/core/styles';
import { red, green, blueGrey } from '@material-ui/core/colors';

const colors = {
  primary: '#2E151B',
  primaryLight: '#DA7B93',
  secondary: '#1C3334',
  secondaryLight: '#376E6F',
  background: '#2F4454',
  error: red.A400,
  success: green[600],
  grey: blueGrey[700],
  // darkGrey: '#616161',
  // lightBlack: '#4a4a4a',
  black: '#000000'
};

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary, // темно красный
      light: colors.primaryLight // светлой красный
    },
    secondary: {
      main: colors.secondary, // темно-зеленый
      light: colors.secondaryLight, // светло-зеленый
    },
    error: {
      main: colors.error,
    },
    success: {
      main: colors.success,
    },
    background: {
      default: colors.background, // серый бекграунд
    },
    grey: {
      700: colors.grey
    }
  },
  typography: {
    // h1: {
    //   fontSize: 50,
    //   fontWeight: 700,
    //   color: colors.primary
    // },
    h2: {
      fontSize: 32,
      fontWeight: 600,
      textTransform: 'uppercase',
      color: colors.primary
    },
    // h3: {
    //   fontSize: 26,
    //   fontWeight: 700,
    //   textTransform: 'uppercase',
    //   color: colors.grey
    // },
    // menu: {
    //   fontSize: 18,
    //   fontWeight: 500,
    //   color: colors.secondary
    // },
    // subtitle: {
    //   fontSize: 16,
    //   fontWeight: 400,
    //   color: colors.grey
    // },
    // caption: {
    //   fontSize: 12,
    //   fontWeight: 400,
    //   color: colors.grey
    // },
    // button: {
    //   fontSize: 18,
    //   fontWeight: 500,
    //   textTransform: 'uppercase'
    // },
    // tabs: {
    //   fontSize: 14,
    //   fontWeight: 500,
    //   textTransform: 'uppercase',
    //   color: colors.grey
    // },
    // table: {
    //   fontSize: 14,
    //   fontWeight: 400,
    //   color: colors.grey
    // }
  },
});

export default theme;