import { HTMLAttributes } from "react";
import "./custom.scss";

const Container = ({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`imt-container ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Container;
