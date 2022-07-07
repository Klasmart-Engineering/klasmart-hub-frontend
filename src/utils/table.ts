import { SortOrder } from "@/types/graphQL";
import { TableLocalization } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/BaseTable";
import { Order } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Head";
import { PageChange } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Pagination/shared";
import { CursorTableData } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Cursor/Table";
import { merge } from "lodash";
import { IntlShape } from "react-intl";

export const DEFAULT_ROWS_PER_PAGE = 10;

export interface ServerCursorPagination {
    search: string;
    rowsPerPage: number;
    order: SortOrder;
    orderBy: string;
    cursor?: string;
}

export interface TableProps<T> {
    rows: T[];
    disabled?: boolean;
    loading?: boolean;
    selectedIds?: string[];
    order?: string;
    orderBy?: string;
    rowsPerPage?: number;
    search?: string;
    cursor?: string;
    total?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    startCursor?: string;
    endCursor?: string;
    showSelectables?: boolean;
    onPageChange?: (pageChange: PageChange, order: Order, cursor: string | undefined, rowsPerPage: number) => Promise<void>;
    onTableChange?: (tableData: CursorTableData<T>) => Promise<void>;
    onSelected?: (ids: string[]) => void;
    refetch?: () => Promise<any> | void;
    hideFilters?: boolean;
}

export const getTableLocalization = (intl: IntlShape, localization: TableLocalization): TableLocalization => merge<TableLocalization, TableLocalization>({
    numSelected: (num) => `${num} selected`,
    placeholder: intl.formatMessage({
        id: `groups_searchPlaceholder`,
    }),
    selectLabel: intl.formatMessage({
        id: `groups_groupBy`,
    }),
    selectNone: intl.formatMessage({
        id: `groups_none`,
    }),
    tabAll: intl.formatMessage({
        id: `groups_allResults`,
    }),
    hideColumnButton: intl.formatMessage({
        id: `groups_hideButton`,
    }),
    selectAll: `Select All`, // TODO: translate
    addButton: intl.formatMessage({
        id: `groups_addColumnsButton`,
    }),
    listTitle: intl.formatMessage({
        id: `groups_selectColumnsTitle`,
    }),
    noData: intl.formatMessage({
        id: `groups_noData`,
    }),
    moreMenuButton: intl.formatMessage({
        id: `groups_rowMoreActions`,
    }),
    nextPage: intl.formatMessage({
        id: `groups_nextTooltip`,
    }),
    prevPage: intl.formatMessage({
        id: `groups_previousTooltip`,
    }),
    firstPage: intl.formatMessage({
        id: `groups_firstTooltip`,
    }),
    lastPage: intl.formatMessage({
        id: `groups_lastTooltip`,
    }),
    rowsPerPage: intl.formatMessage({
        id: `groups_rowsPerPage`,
    }),
    total: (total) => intl.formatMessage({
        id: `generic_totalResults`,
    }, {
        total,
    }),
}, localization);

export const serverToTableOrder = (order: SortOrder): Order => {
    switch (order) {
    case `ASC`: return `asc`;
    case `DESC`: return `desc`;
    }
};

export const tableToServerOrder = (order: Order): SortOrder => {
    switch (order) {
    case `asc`: return `ASC`;
    case `desc`: return `DESC`;
    }
};

export const pageChangeToDirection = (pageChange: PageChange) => {
    return [ `first`, `next` ].includes(pageChange) ? `FORWARD` : `BACKWARD`;
};
