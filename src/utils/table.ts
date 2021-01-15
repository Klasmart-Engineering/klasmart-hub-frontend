import { TableLocalization } from "kidsloop-px/dist/types/components/Table/Base";
import { IntlShape } from "react-intl";
import { merge } from "lodash";

export const getTableLocalization = (intl: IntlShape, localization: TableLocalization): TableLocalization => merge<TableLocalization, TableLocalization>({
    toolbar: {
        numSelected: (num) => `${num} selected`,
    },
    search: {
        placeholder: `Search`,
    },
    groupTabs: {
        selectLabel: `Group by`,
        selectNone: `No group`,
        tabAll: `All`,
    },
    head: {
        hideColumnButton: `Hide`,
    },
    checkboxDropdown: {
        allGroupsPages: `All groups & pages`,
        allPages: `All pages`,
        thisPage: `This page`,
        none: `None`,
    },
    columnSelector: {
        addButton: `Add columns`,
        listTitle: `Select columns`,
    },
    body: {
        noData: `No data found`,
    },
    rowMoreMenu: {
        moreMenuButton: `More actions`,
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
    },
}, localization);
