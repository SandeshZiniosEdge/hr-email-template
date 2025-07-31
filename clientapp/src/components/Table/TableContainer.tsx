import { ReactNode } from "react";
import "./table.scss";
import { mergeString } from "../../helpers/mergeString";

const TableContainer = ({
  children,
  disableShadow,
  className,
}: {
  children?: ReactNode;
  disableShadow?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={mergeString(
        "imt-table-container",
        !disableShadow && "imt-table-shadow",
        className
      )}
    >
      {children}
    </div>
  );
};

export default TableContainer;
