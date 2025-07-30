import { ButtonHTMLAttributes } from "react";
import "./custom.scss";
import { mergeString } from "../../helpers/mergeString";

const Clickable = ({
  type = "button",
  className,
  fitType,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { fitType?: "max" | "fit" }) => {
  return (
    <button
      className={mergeString(
        "imt-clickable",
        className,
        fitType === "max" ? "imt-clickable-max" : "imt-clickable-fit"
      )}
      type={type}
      {...props}
    />
  );
};

export default Clickable;
