import { MouseEvent, forwardRef } from "react";
import "./custom.scss";

import Trash from "../../assets/icons/deleteIcon.svg";
import CrossSmall from "../../assets/icons/cross-small.svg";
import Edit from "../../assets/icons/edit_Icon.svg";
import Button from "../Button/Button";
import { mergeString } from "../../helpers/mergeString";

const ImageWithClass = ({
  src,
  className,
}: {
  src: string;
  className?: string;
}) => <img src={src} alt="icon" className={className ?? `imt-action-icon`} />;

const IconDictionary = {
  trash: <ImageWithClass src={Trash} />,
  "cross-small": <ImageWithClass src={CrossSmall} />,
  edit: <ImageWithClass src={Edit} className="imt-icon-h-15" />,
};
const Action = forwardRef<
  HTMLButtonElement,
  {
    icon: keyof typeof IconDictionary;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    disableBackground?: boolean;
    className?: string;
  }
>(({ icon, onClick, disableBackground, className }, ref) => {
  return (
    <Button
      ref={ref}
      isWrapper
      className={mergeString(!disableBackground && "imt-action", className)}
      onClick={onClick}
    >
      {IconDictionary[icon]}
    </Button>
  );
});

export default Action;
