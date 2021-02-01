import { createMuiTheme } from '@material-ui/core/styles';
import { red, green, blueGrey } from '@material-ui/core/colors';

const colors = {
  primary: '#2E151B',
  primaryLight: '#DA7B93',
  secondary: '#1C3334',
  secondaryLight: '#376E6F',
  background: '#2F4454',
  error: red.A400,
  warning: red.A400,
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
      // main: colors.error,
      main: colors.primaryLight,
    },
    warning: {
      main: colors.warning,
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
    h2: {
      fontSize: 32,
      fontWeight: 600,
      textTransform: 'uppercase',
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: 15,
      fontWeight: 500,
    },
  },
  overrides: {
    MuiInputBase: {
      input: {
        '&:-webkit-autofill': {
          transitionDelay: '9999s',
          transitionProperty: 'background-color, color',
        },
      },
    },
  },
});

export default theme;