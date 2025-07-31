import { Fragment, useEffect, useMemo, useState } from "react";
import type { SortState, TableProps } from "./tableTypes";
import If from "../Custom/IF";
import TableRow from "./TableRow";

import TableContainer from "./TableContainer";
import TableMessage from "./TableMessage";
import Clickable from "../Custom/Clickable";
import "./table.scss";
import { mergeString } from "../../helpers/mergeString";
import { setStoreSort, useFilterStore } from "../../store/useFilter";
// import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

const SortIcon = ({
  sort,
  value,
}: {
  value: string | undefined;
  sort: SortState;
}) => {
  return null;
  // if (sort.name === value && sort.value === "desc") {
  //   return <FaSortAmountDown color="#000" />;
  // }
  // return <FaSortAmountUp color="#000" />;
};

const Table = <T extends object>({
  keyGen,
  data = [],
  definition,
  isExpandable = false,
  rowClass,
  renderExpandable,
  onSortChange,
  titleRenderer,
  isActionSticky,
  search,
  sortValue,
  defaultSort,
  disableShadow = false,
  disableExpandable,
  tableOnMobile = false,
  titleClass,
}: TableProps<T>) => {
  const { SearchTerm, Sort } = useFilterStore();

  const [sorter, setSorter] = useState<SortState>(() => {
    const initSplit = defaultSort?.split(":") ?? [];
    return {
      value: (initSplit[1] as SortState["value"]) ?? "asc",
      name: initSplit[0] ?? "",
    };
  });

  const onSort = (key?: string) => {
    return () => {
      if (!key) return;

      const nextState = sortValue ?? { ...sorter };
      if (nextState.name === key) {
        nextState.value = nextState.value === "asc" ? "desc" : "asc";
      } else {
        nextState.name = key;
        nextState.value = "asc";
      }
      if (onSortChange)
        onSortChange(
          `${nextState.name}:${nextState.value}`,
          nextState.name,
          nextState.value
        );

      if (!sortValue) {
        setSorter(nextState);
      }

      setStoreSort(nextState);
    };
  };

  const MobileDefinition = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mobileDefinition: any = {};

    definition.forEach(({ label, render, accessor, condition = true }) => {
      if (condition) {
        mobileDefinition[label] = render ?? accessor ?? "";
      }
    });

    return mobileDefinition;
  }, [definition]);

  useEffect(() => {
    if (Sort) {
      setSorter(Sort);
    } else if (sortValue) {
      setSorter(sortValue);
    }
  }, [sortValue, Sort]);

  if (!data.length) {
    return <TableMessage search={SearchTerm ?? search} disableShadow />;
  }

  return (
    <Fragment>
      <TableContainer
        disableShadow={disableShadow}
        className={mergeString(!tableOnMobile && "imt-table-hidden")}
      >
        <table className={mergeString("imt-table")}>
          <thead className="imt-head">
            <tr>
              {definition.map(
                ({
                  label,
                  sortKey,
                  hasSort = false,
                  isSticky,
                  condition = true,
                  headerClass = "",
                  width,
                }) =>
                  condition ? (
                    <th
                      className={mergeString(
                        headerClass,
                        "imt-sort",
                        sortKey === sorter.name && "imt-current-sort",
                        isSticky && "imt-action-stick",
                        isSticky && isActionSticky && "imt-action-stick-2",
                        `w-${width}`
                      )}
                      key={label}
                    >
                      <Clickable onClick={hasSort ? onSort(sortKey) : () => {}}>
                        {label}
                        <If condition={hasSort}>
                          <SortIcon value={sortKey} sort={sorter} />
                        </If>
                      </Clickable>
                    </th>
                  ) : (
                    <Fragment key={label + "disabled"} />
                  )
              )}
              <If condition={isExpandable}>
                <th className={isActionSticky ? "imt-action-stick" : ""}></th>
              </If>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <TableRow
                key={keyGen ? keyGen(item) : index}
                isExpandable={isExpandable}
                data={item}
                definition={definition}
                rowClass={rowClass}
                renderExpandable={renderExpandable}
                disableExpandable={disableExpandable}
                isActionSticky={isActionSticky}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </TableContainer>
    </Fragment>
  );
};

export default Table;
