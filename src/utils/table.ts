import { TableLocalization } from "kidsloop-px/dist/types/components/Table/Common/BaseTable";
import { merge } from "lodash";
import { IntlShape } from "react-intl";

export const getTableLocalization = (intl: IntlShape, localization: TableLocalization): TableLocalization => merge<TableLocalization, TableLocalization>({
    toolbar: {
        numSelected: (num) => `${num} selected`,
    },
    search: {
        placeholder: intl.formatMessage({
            id: `groups_searchPlaceholder`,
        }),
    },
    groupTabs: {
        selectLabel: intl.formatMessage({
            id: `groups_groupBy`,
        }),
        selectNone: intl.formatMessage({
            id: `groups_none`,
        }),
        tabAll: intl.formatMessage({
            id: `groups_allResults`,
        }),
    },
    head: {
        hideColumnButton: intl.formatMessage({
            id: `groups_hideButton`,
        }),
    },
    checkboxDropdown: {
        allGroupsPages: intl.formatMessage({
            id: `groups_allGroupsPages`,
        }),
        allPages: intl.formatMessage({
            id: `groups_allPages`,
        }),
        thisPage: intl.formatMessage({
            id: `groups_thisPage`,
        }),
        none: intl.formatMessage({
            id: `groups_none`,
        }),
    },
    columnSelector: {
        addButton: intl.formatMessage({
            id: `groups_addColumnsButton`,
        }),
        listTitle: intl.formatMessage({
            id: `groups_selectColumnsTitle`,
        }),
    },
    body: {
        noData: intl.formatMessage({
            id: `groups_noData`,
        }),
    },
    rowMoreMenu: {
        moreMenuButton: intl.formatMessage({
            id: `groups_rowMoreActions`,
        }),
    },
    pagination: {
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
        fromToTotal: (from: number, to: number, count: number) => intl.formatMessage({
            id: `generic_tableFromOf`,
        }, {
            from,
            to,
            count,
        }),
        total: (total) => intl.formatMessage({
            id: `generic_tableTotal`,
        }, {
            total,
        }),
    },
}, localization);
