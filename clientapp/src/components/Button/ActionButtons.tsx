import { ReactNode } from "react";

const ActionButtons = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => <div className={`imt-action-button-container ${className}`}>{children}</div>;

export default ActionButtons;
