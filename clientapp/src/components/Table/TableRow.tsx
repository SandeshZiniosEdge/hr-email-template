import If from "../Custom/IF";
import Arrow from "../../assets/icons/acc.svg";
import { TableRowProps } from "./tableTypes";
import { Fragment, ReactNode, useEffect, useState } from "react";

const TableRow = <T extends object>({
  isExpandable = false,
  renderExpandable,
  data,
  definition,
  rowClass = () => "",
  isActionSticky,
  index,
  disableExpandable = () => false,
}: TableRowProps<T>) => {
  const [isExpaded, setIsExpaded] = useState(false);

  useEffect(() => {
    if (isExpaded) setIsExpaded(false);
  }, [data]);

  return (
    <Fragment>
      <tr
        className={`imt-table-row ${
          typeof rowClass === "function" ? rowClass(data) : rowClass
        }`}
      >
        {definition.map(
          (
            {
              accessor,
              render,
              className = "",
              isSticky,
              condition = true,
              width,
              label,
            },
            idx
          ) =>
            condition ? (
              <td
                key={accessor ?? idx}
                className={`${isSticky ? "imt-action-stick" : ""} ${
                  isActionSticky && isSticky ? "imt-action-stick-2" : ""
                } ${className} w-${width}`}
                style={
                  ["Billing Status", "Resend Invite"].includes(label)
                    ? { padding: "10px" }
                    : {}
                }
              >
                {render
                  ? render(data, index)
                  : (accessor &&
                      (data[accessor as keyof typeof data] as ReactNode)) ??
                    "-"}
              </td>
            ) : null
        )}
        <If condition={isExpandable && !disableExpandable(data)}>
          <td className={isActionSticky ? "imt-action-stick" : ""}>
            <button
              className="imt-accordion-button"
              onClick={() => setIsExpaded((prev) => !prev)}
            >
              <img
                src={Arrow}
                alt="acc"
                className={isExpaded ? "rotateDown" : "rotateUp"}
              />
            </button>
          </td>
        </If>
      </tr>
      <If condition={isExpaded}>
        <tr>
          <td colSpan={definition.length + 1}>
            {renderExpandable && isExpaded
              ? renderExpandable(data, index)
              : null}
          </td>
        </tr>
      </If>
    </Fragment>
  );
};

export default TableRow;
