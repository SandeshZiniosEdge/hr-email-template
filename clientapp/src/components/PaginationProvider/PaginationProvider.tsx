import { FC, useMemo } from "react";
import ReactPaginate from "react-paginate";

import "./pagination.scss";
import { setFilterStoreKey, useFilterStore } from "../../store/useFilter";
import SelectWrapper from "../SelectWrapper";

interface PaginationProviderProps {
  pagination: {
    currentPage?: number;
    recordsPerPage?: number;
    totalRecords?: number;
    numberOfPages?: number;
  };
  onPageChange?: (selected: number) => void;
  hidden?: boolean;
}

const PaginationProvider: FC<PaginationProviderProps> = ({
  pagination,
  onPageChange,
  hidden,
}) => {
  const { Page, PageSize } = useFilterStore();
  const perPageOptions = useMemo(
    () => [
      { label: "5", value: "5" },
      { label: "10", value: "10" },
      { label: "15", value: "15" },
      { label: "25", value: "25" },
      { label: "50", value: "50" },
      { label: "100", value: "100" },
    ],
    []
  );

  if (hidden || !pagination.totalRecords) {
    return null;
  }

  const _onPageChange = ({ selected }: { selected: number }) => {
    if (onPageChange) onPageChange(selected);
    setFilterStoreKey("Page", selected + 1);
  };

  const pageNumber = pagination.currentPage ? pagination.currentPage : Page;
  return (
    <div className="imt-pagination">
      <div className="pageItems">
        <p>
          {`Items ${(pageNumber - 1) * PageSize + 1} - ${Math.min(
            pageNumber * PageSize,
            pagination.totalRecords
          )}  of ${pagination.totalRecords}`}
        </p>
      </div>
      <ReactPaginate
        pageCount={pagination.numberOfPages ?? 1}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        onPageChange={_onPageChange}
        containerClassName="pagination"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        activeClassName="page-active"
        previousLabel={"<"}
        nextLabel={">"}
        previousClassName={Page === 1 ? "hidden" : "prevNext"}
        nextClassName={
          Page === pagination.numberOfPages ? "hidden" : "prevNext"
        }
        forcePage={pageNumber - 1}
      />
      <div className="flex gap-10 items-center">
        <p>Page size: </p>
        <SelectWrapper
          options={perPageOptions}
          getOptionValue={(i) => i.label}
          getOptionLabel={(i) => i.value}
          value={{ label: String(PageSize), value: String(PageSize) }}
          onChange={(v) => setFilterStoreKey("PageSize", parseInt(v!.value))}
        />
        <div className="pageNumber">
          <p>
            - Page {pageNumber} of {pagination.numberOfPages}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaginationProvider;
