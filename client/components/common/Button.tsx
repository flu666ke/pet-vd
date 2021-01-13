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
    color: "#544545",
    "&:disabled": {
      opacity: "0.5",
      color: "#787878",
    },
    "&:hover": {
      background: theme.palette.primary.light,
    },
  },
  secondary: {
    background: theme.palette.secondary.main,
    color: "#544545",
    "&:disabled": {
      opacity: "0.5",
      color: "#787878",
    },
    "&:hover": {
      background: theme.palette.secondary.light,
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
    color: "#fff",
  },
  circularSecondary: {
    color: theme.palette.primary.main,
  },
}));

interface ButtonProps {
  color: "primary" | "secondary"
  size: "normal" | "small"
  loading: boolean
  children: any
  disabled: boolean
  fullWidth?: boolean
  type: "button" | "reset" | "submit"
}

export default function Button({ color, size, loading, children, disabled, ...restProps }: ButtonProps) {
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
          }}
        />
      ) : (
          children
        )}
    </ButtonMaterial>
  );
};
