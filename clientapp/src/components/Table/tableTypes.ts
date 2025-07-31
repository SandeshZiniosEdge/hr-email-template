import { ReactNode } from "react";

type SortState = { value: undefined | "asc" | "desc"; name: string };

type RowDefinition<T = unknown> = {
  label: string;
  accessor?: string;
  hasSort?: boolean;
  sortKey?: string;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  isSticky?: boolean;
  condition?: boolean;
  headerClass?: string;
  width?: number;
};

interface TableProps<T> {
  keyGen?: (row: T) => string | number;
  data: Array<T> | undefined;
  definition: RowDefinition<T>[];
  isExpandable?: boolean;
  renderExpandable?: (instance: T, index: number) => ReactNode;
  rowClass?: ((item: T) => string) | string;
  onSortChange?: (
    sort: string,
    name: string,
    value: string
  ) => Promise<void> | void;
  titleRenderer?: (item: T, index: number) => ReactNode;
  isActionSticky?: boolean;
  search?: string;
  sortValue?: { name: string; value: "asc" | "desc" };
  defaultSort?: string;
  disableShadow?: boolean;
  disableExpandable?: (row: T) => boolean;
  tableOnMobile?: boolean;
  titleClass?: (data: T) => string;
}

interface TableRowProps<T> {
  isExpandable?: boolean;
  renderExpandable?: (item: T, index: number) => ReactNode;
  data: T;
  definition: RowDefinition<T>[];
  rowClass?: string | ((item: T) => string);
  isActionSticky?: boolean;
  index: number;
  disableExpandable?: (row: T) => boolean;
}

interface MobileTableProps<T> {
  data: T;
  titleRenderer?: (instance: T, index: number) => ReactNode;
  showExpandedInMobile?: boolean;
  renderExpandable?: (item: T, index: number) => ReactNode;
  disableExpandable?: (row: T) => boolean;
  definition: Record<string, KeyDef>;
  index: number;
  titleClass?: (data: T) => string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Renderer = (data: any) => ReactNode;
interface KeyDefiner {
  k: string | Renderer;
  value: string | Renderer;
}

type KeyDef = string | Renderer | KeyDefiner;

export type {
  SortState,
  RowDefinition,
  TableProps,
  TableRowProps,
  MobileTableProps,
};
