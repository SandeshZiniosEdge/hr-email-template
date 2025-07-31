import { ReactNode } from "react";
import "./custom.scss";

const SubHeader = ({ children }: { children: ReactNode }) => {
  return <div className="imt-subheader">{children}</div>;
};

export default SubHeader;
