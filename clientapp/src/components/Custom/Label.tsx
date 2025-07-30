import { FC, LabelHTMLAttributes } from "react";

const fontSizeKeys = {
  sm: "imt-font-sm",
  md: "imt-font-md",
  lg: "imt-font-lg",
};

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  size?: "sm" | "md" | "lg";
}

const Label: FC<LabelProps> = ({ size = "md", children, className = "", ...props }) => (
  <label className={`${fontSizeKeys[size]} ${className}`} {...props}>
    {children}
  </label>
);

export default Label;
