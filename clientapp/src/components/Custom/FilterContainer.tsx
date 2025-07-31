import { ReactNode } from "react";
import "./custom.scss";
import { mergeString } from "../../helpers/mergeString";

import { RowDefinition } from "../Table/tableTypes";

import { SortState } from "../../store/useFilter";

type Wrapper = { children?: ReactNode; className?: string };

const getSortFilterLabel = (label: string, val: SortState["value"]) => {
  if (!label) return "";
  const isDate = ["date", "created"].some((t) =>
    label.toLowerCase().includes(t)
  );
  const d = val === "asc" ? "Oldest first" : "Newest first";
  const e = val === "asc" ? "Asc" : "Desc";
  const l = mergeString(`${label}:`, isDate ? d : e);
  return l;
};

const FilterContainer = ({
  children,
  className,
  definition,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
Wrapper & { definition?: RowDefinition<any>[] }) => {
  return (
    <div className={mergeString("imt-filter-container", className)}>
      {children}
    </div>
  );
};

const FilterChild = ({ children, className = "" }: Wrapper) => (
  <div className={mergeString("imt-filter-holder", className)}>{children}</div>
);

const FilterLabel = ({ children, className }: Wrapper) => (
  <p className={mergeString("imt-filter-label", className)}>{children}</p>
);

const FilterDateChild = ({
  //@ts-expect-error children separator
  children: [label, ...Children],
  className,
}: Wrapper) => (
  <div className={mergeString("imt-filter-date", className)}>
    {label}
    <div className="imt-filter-child">{Children}</div>
  </div>
);

export { FilterContainer, FilterChild, FilterLabel, FilterDateChild };
