import { FC } from "react";
import Label from "../Custom/Label";
import If from "../Custom/IF";
import "./checkbox.scss";
import { mergeString } from "../../helpers/mergeString";
import Clickable from "../Custom/Clickable";

interface Checkbox {
  checked?: boolean;
  onChange?: (checked: boolean) => Promise<void> | void;
  label?: string;
  labelPosition?: "right" | "left";
  size?: "sm" | "md" | "lg";
  type?: "circle" | "default";
  disabled?: boolean;
  className?: string;
}

const Checkbox: FC<Checkbox> = ({
  checked,
  onChange,
  label,
  labelPosition = "right",
  size = "md",
  type = "default",
  disabled,
  className,
}) => {
  return (
    <Clickable
      className={mergeString(
        "imt-checkbox-container",
        disabled && "imt-checkbox-container-disabled"
      )}
      onClick={() => onChange && onChange(!checked)}
      disabled={disabled}
    >
      <If condition={labelPosition === "right" && !!label}>
        <Label size={size} htmlFor="imt-checkbox" className="imt-check-label">
          {label}
        </Label>
      </If>
      <If condition={type === "default"}>
        <div
          className={mergeString(
            "imt-checkbox",
            disabled && "imt-checkbox-container-disabled"
          )}
        >
          <span
            className={`imt-custom-checkbox ${checked ? "imt-checked" : ""}`}
          ></span>
        </div>
      </If>
      <If condition={type === "circle"}>
        <div
          className={mergeString(
            "imt-circular-checkbox",
            checked && "imt-circular-active",
            disabled && "imt-disabled",
            className
          )}
        />
      </If>
      <If condition={labelPosition === "left" && !!label}>
        <Label size={size} htmlFor="imt-checkbox">
          {label}
        </Label>
      </If>
    </Clickable>
  );
};

export default Checkbox;
