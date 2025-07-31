// import RouteMap from "@/router/RouteMap";
import { useCallback, useEffect } from "react";
import { create } from "zustand";

export type ImtModules =
  | "cases"
  | "hospital"
  | "corporations"
  | "case_status"
  | "case_priority"
  | "billingCode"
  | "billing-history"
  | "case_type"
  | "licenses"
  | "request"
  | "notifications"
  | "eula"
  | "role-management"
  | "profile"
  | "users-external"
  | "users-internal"
  | "users-associate"
  | "eula-acceptance"
  | "invite"
  | "notifications-list"
  | "contact-queries"
  | "tags"
  | "care-team";

type SortState = {
  label?: string;
  value: undefined | "asc" | "desc";
  name: string;
};

interface UseFilterParams<T, X> {
  initState?: T;
  initMasterState?: X;
  module?: ImtModules;
  defaultSort?: string;
  isFilterApplied?: boolean;
}

interface UseFilterStoreType<S = unknown, MS = unknown> {
  Sort: SortState | undefined;
  SortTerm?: string;
  Page: number;
  PageSize: number;
  SearchTerm: string | undefined;
  Filter: S;
  appliedFilters: S;
  masterStore: MS;
  activeModule: ImtModules | undefined;
}

const initialFilterStore = {
  Page: 1,
  SortTerm: "",
  Sort: undefined,
  SearchTerm: "",
  masterStore: {},
  Filter: {},
  appliedFilters: {},
  activeModule: undefined,
  PageSize: 10,
};

const useFilterStore = create<UseFilterStoreType>(() => initialFilterStore);

type UseFilterSetterFn = {
  setMasterStateKey: (k: string, v: unknown) => void;
  setFilterKey: (k: string, v: unknown) => void;
  resetFilter: () => void;
  applyFilter: () => void;
};
type UseFilterReturn<T = unknown, X = unknown> = UseFilterStoreType<T, X> &
  UseFilterSetterFn;

const useFilter = <T = unknown, X = unknown>({
  initState,
  initMasterState,
  module,
  defaultSort,
  isFilterApplied = true,
}: UseFilterParams<T, X> = {}): UseFilterReturn<T, X> => {
  const state = useFilterStore();

  const setMasterStateKey = useCallback((k: string, v: unknown) => {
    useFilterStore.setState((prev: any) => ({
      masterStore: { ...(prev.masterStore as object), [k]: v },
    }));
  }, []);

  const setFilterKey = useCallback(
    (k: string, v: unknown) => {
      useFilterStore.setState((prev: any) => {
        const partialNext: Partial<UseFilterStoreType> = {
          Page: !isFilterApplied ? 1 : prev.Page,
          Filter: { ...(prev.Filter as object), [k]: v },
        };
        if (!isFilterApplied) {
          partialNext["appliedFilters"] = {
            ...(prev.Filter as object),
            [k]: v,
          };
        }

        return partialNext;
      });
    },
    [isFilterApplied]
  );

  const applyFilter = useCallback(() => {
    useFilterStore.setState((prev: any) => ({
      Page: 1,
      appliedFilters: prev.Filter,
    }));
  }, []);

  const resetFilter = useCallback(() => {
    useFilterStore.setState((prev: any) => ({
      ...prev,
      Filter: initState,
      appliedFilters: initState,
      activeModule: module,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module]);

  useEffect(() => {
    if (module && state.activeModule !== module) {
      const sorter = defaultSort?.split(":");
      const nextState: Partial<UseFilterStoreType> = {
        masterStore: initMasterState,
        Filter: initState,
        appliedFilters: initState,
        SortTerm: defaultSort,
        activeModule: module,
        Sort: undefined,
        Page: 1,
        SearchTerm: "",
        PageSize: 10,
      };

      if (sorter && sorter?.length > 1) {
        nextState["Sort"] = {
          name: sorter[0] ?? "",
          value: (sorter[1] as SortState["value"]) ?? "asc",
        };
      }

      useFilterStore.setState(nextState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module]);

  const returnState =
    module && module !== state.activeModule
      ? {
          ...initialFilterStore,
          SortTerm: defaultSort,
          masterStore: initMasterState,
          Filter: initState,
          appliedFilters: initState,
        }
      : state;

  return {
    ...returnState,
    setMasterStateKey,
    setFilterKey,
    resetFilter,
    applyFilter,
  } as UseFilterReturn<T, X>;
};

function setFilterStoreKey(key: "SearchTerm", value: string): void;
function setFilterStoreKey(key: "Page", value: number): void;
function setFilterStoreKey(key: "PageSize", value: number): void;
function setFilterStoreKey(key: string, value: unknown) {
  useFilterStore.setState({ Page: 1, [key]: value });
}

function setStoreSort(Sort: SortState) {
  useFilterStore.setState({
    Sort,
    SortTerm: `${Sort.name}:${Sort.value}`,
    Page: 1,
  });
}

// const resetFilterStore = () => {
//   const pathname = location.pathname;
//   // const r = RouteMap.find((i) => i.path === pathname);

//   // const state = useFilterStore.getState();

//   // const willReset =
//   //   r &&
//   //   (Array.isArray(r?.module)
//   //     ? state?.activeModule && !r.module.includes(state?.activeModule)
//   //     : r?.module !== state.activeModule);
//   // let message = "";
//   // if (r?.module !== state.activeModule) {
//   //   message = "Module changed will reset";
//   // } else {
//   //   message = "Module bound not crossed";
//   // }
//   console.log("[useFilter]", pathname, message);

//   if (willReset) {
//     useFilterStore.setState(initialFilterStore);
//   }
// };

export default useFilter;
export { useFilterStore, setFilterStoreKey, setStoreSort };
export type { SortState, UseFilterStoreType };
