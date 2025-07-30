import { ButtonHTMLAttributes, forwardRef, CSSProperties } from "react";
import "./button.scss";
// import { navigate } from "@/store/usePageParams";
import { Spinner } from "react-activity";

enum ButtonVariants {
  default = "imt-default",
  outline = "imt-outline",
  "outline-danger" = "imt-outline-danger",
  "outline-success" = "imt-outline-success",
  "filled-danger" = "imt-filled-danger",
}

enum ButtonSize {
  lg = "imt-lg",
  md = "imt-md",
  sm = "imt-sm",
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: keyof typeof ButtonVariants;
  size?: keyof typeof ButtonSize;
  to?: string;
  isWrapper?: boolean;
  customStyles?: CSSProperties;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      isLoading,
      children,
      className = "",
      variant = "default",
      type = "button",
      size = "lg",
      to,
      isWrapper = false,
      customStyles,
      ...props
    },
    ref
  ) => {
    // Merge existing styles with custom styles, giving priority to custom styles
    const mergedStyles = customStyles
      ? {
          ...props.style,
          ...customStyles,
        }
      : props.style;
    if (isWrapper) {
      return (
        <button
          ref={ref}
          type={type}
          {...props}
          style={mergedStyles}
          className={`imt-button-2 ${className} `}
        >
          {children}
        </button>
      );
    }
    if (to) {
      return (
        <button
          ref={ref}
          type={type}
          {...props}
          disabled={isLoading || props.disabled}
          onClick={() => {}}
          style={mergedStyles}
          className={`imt-button ${ButtonVariants[variant]} ${className} ${ButtonSize[size]}`}
        >
          {!isLoading ? children : <Spinner size={13} />}
        </button>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        {...props}
        disabled={isLoading || props.disabled}
        style={mergedStyles}
        className={`imt-button ${ButtonVariants[variant]} ${className} ${ButtonSize[size]}`}
      >
        {!isLoading ? children : <Spinner size={13} />}
      </button>
    );
  }
);

export default Button;
