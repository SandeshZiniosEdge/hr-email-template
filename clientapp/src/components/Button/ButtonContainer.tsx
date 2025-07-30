import { ReactNode } from "react";
import "./button.scss";

const ButtonContainer = ({
  children,
  className = "",
  align,
}: {
  className?: string;
  children?: ReactNode;
  align?: "right";
}) => {
  return (
    <div
      className={`imt-button-container ${className} ${
        align == "right" ? "imt-buttons-right" : ""
      }`}>
      {children}
    </div>
  );
};

export default ButtonContainer;
