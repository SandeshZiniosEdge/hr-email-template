import { Suspense } from "react";
import RightCheckSvg from "../../assets/icons/rightIT.svg";
import WrongCheckSvg from "../../assets/icons/wrongIT.svg";
import LoadingSvg from "../../assets/icons/loading.svg";

const IconDictionary = {
  "correct-tick": RightCheckSvg,
  "wrong-tick": WrongCheckSvg,
};

export interface IconProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "ref"> {
  icon: keyof typeof IconDictionary;
  className?: string;
}

const Icon = ({ icon, className, ...props }: IconProps) => {
  const Component = IconDictionary[icon];
  return (
    <Suspense fallback={<img src={LoadingSvg} alt="loading" />}>
      {Component && (
        <img src={Component} className={className} alt={icon} {...props} />
      )}
    </Suspense>
  );
};

export default Icon;
