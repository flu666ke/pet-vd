import ButtonMaterial from "@material-ui/core/Button";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) => ({
  base: {
    lineHeight: "normal",
  },
  primary: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.light,
    "&:disabled": {
      opacity: "0.5",
      color: theme.palette.grey,
    },
    "&:hover": {
      background: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
  },
  secondary: {
    background: theme.palette.secondary.main,
    color: theme.palette.primary.light,
    "&:disabled": {
      opacity: "0.5",
      color: theme.palette.grey,
    },
    "&:hover": {
      background: theme.palette.secondary.light,
      color: theme.palette.primary.main,
    },
  },
  shadow: {
    boxShadow:
      "0 2px 5px 0 rgba(0, 0, 0, 0.26), 0 2px 10px 0 rgba(0, 0, 0, 0.16)",
    "&:active": {
      boxShadow: "inset 0 0 12px 0 rgba(0, 0, 0, 0.5)",
    },
  },
  normal: {
    height: 56,
  },
  small: {
    height: 46,
    padding: "0px 5px",
  },
  circularPrimary: {
    color: theme.palette.primary.light,
  },
  circularSecondary: {
    color: theme.palette.primary.light,
  },
}));

interface ButtonProps {
  color: "primary" | "secondary"
  size?: "normal" | "small"
  loading?: boolean
  children: any
  disabled?: boolean
  fullWidth?: boolean
  type?: "button" | "reset" | "submit"
  onClick?: (e: any) => void
}

export default function Button({ color, size = 'normal', loading = false, children, disabled, ...restProps }: ButtonProps) {
  const classes = useStyles();
  return (
    <ButtonMaterial
      className={clsx(
        classes.base,
        classes.shadow,
        classes[color],
        classes[size]
      )}
      disabled={disabled || loading}
      {...restProps}
    >
      {loading ? (
        <CircularProgress
          size={30}
          color={color}
          classes={{
            colorPrimary: classes.circularPrimary,
            colorSecondary: classes.circularSecondary
          }}
        />
      ) : (
          children
        )}
    </ButtonMaterial>
  );
};
