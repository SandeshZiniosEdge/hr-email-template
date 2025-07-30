import { ReactNode, ReactElement } from "react";

const If = ({
  condition,
  children,
}: {
  children: ReactNode;
  condition: boolean;
}): ReactElement | null => {
  // <-- Use ReactElement here
  return condition ? <>{children}</> : null;
};

export default If;
