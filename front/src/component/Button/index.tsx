import "./index.css";
import React, { Fragment } from "react";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label: string;
  primary?: boolean;
  warning?: boolean;
  small?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  primary,
  warning,
  small,
  disabled,
  ...props
}) => {
  return (
    <Fragment>
      <button
        {...props}
        className={[
          "button",
          primary && "button-primary",
          warning && "button-warning",
          small && "button-small",
        ].join(" ")}
        disabled={disabled}
      >
        {label}
      </button>
    </Fragment>
  );
};

export default Button;
