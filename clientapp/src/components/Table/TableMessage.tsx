import { useRef } from "react";
import "./table.scss";
import { mergeString } from "../../helpers/mergeString";

const TableMessage = ({
  message = "No records to display",
  search,
  disableShadow = false,
}: {
  message?: string;
  search?: string;
  disableShadow?: boolean;
}) => {
  const searchRef = useRef<string>(search ?? "");

  return (
    <div
      className={mergeString(
        "imt-table-empty",
        !disableShadow && "imt-table-shadow"
      )}
    >
      <p className="no-data-found">
        {searchRef.current
          ? `No records found for '${searchRef.current}'`
          : message}
      </p>
    </div>
  );
};

export default TableMessage;
