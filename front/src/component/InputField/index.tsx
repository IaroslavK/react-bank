import "./index.css";
import React, { useState } from "react";
import openEyeImage from "../../images/password-show.svg";
import closedEyeImage from "../../images/password-hide.svg";
import errorOpenEyeImage from "../../images/password-show-red.svg";
import errorClosedEyeImage from "../../images/password-hide-red.svg";

type InputFieldProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string;
  imageSrc?: string;
  payment?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  imageSrc,
  payment,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>([]);
  const [eyeImage, setEyeImage] = useState({
    open: openEyeImage,
    closed: closedEyeImage,
  });
  const [labelColor, setLabelColor] = useState("currentColor");
  const [inputFilled, setInputFilled] = useState(false);

  const validatePassword = (value: string) => {
    if (props.type === "password" && value.length < 5) {
      setErrors(["Sorry, the password is too simple"]);
      setEyeImage({
        open: errorOpenEyeImage,
        closed: errorClosedEyeImage,
      });
      setLabelColor("red");
    } else {
      setErrors([]);
      setEyeImage({
        open: openEyeImage,
        closed: closedEyeImage,
      });
      setLabelColor("black");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validatePassword(e.target.value);
    props.onChange && props.onChange(e);
    setInputFilled(
      Array.from(document.querySelectorAll("input")).every(
        (input) => input.value
      )
    );
  };

  const containerClass = payment ? "input with-dollar" : "input";
  const inputClass = errors.length ? "input-alert" : containerClass;

  return (
    <div className="input-field">
      <label className="input-label" style={{ color: labelColor }}>
        {label}
      </label>
      <div className="input-t">
        <input
          {...props}
          className={inputClass}
          type={showPassword ? "text" : props.type}
          onChange={handleInputChange}
        />
        {payment && <span className="payment">$</span>}
        {props.type === "password" && (
          <div className="input-image-container">
            {showPassword ? (
              <img
                className="input-image"
                src={eyeImage.open}
                alt="Open Eye"
                onClick={toggleShowPassword}
              />
            ) : (
              <img
                className="input-image"
                src={eyeImage.closed}
                alt="Closed Eye"
                onClick={toggleShowPassword}
              />
            )}
          </div>
        )}
      </div>
      {errors.map((error: string, index: number) => (
        <div key={index} className="error-message">
          {error}
        </div>
      ))}
    </div>
  );
};

export default InputField;
