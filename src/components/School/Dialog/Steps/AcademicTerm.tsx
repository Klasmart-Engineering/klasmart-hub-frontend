import AcademicTermTable, { AcademicTermRow } from "../../AcademicTerm/Table";
import { SchoolStepper } from "./shared";
import { EntityStepContent } from "@/utils/entitySteps";
import { Alert } from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { DEFAULT_ROWS_PER_PAGE, pageChangeToDirection, ServerCursorPagination, serverToTableOrder, tableToServerOrder } from "@/utils/table";
import { SchoolFilter, useGetPaginatedSchools } from "@/api/schools";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { usePermission } from "@/utils/permissions";
import { PageChange } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { Order } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Head";
import { Info as InfoIcon } from "@mui/icons-material";
import { CursorTableData } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Cursor/Table";
import { Filter } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import { mapAcademicTermNodeToAcademicTermRow, useGetAllAcademicTerms } from "@/api/academicTerms";
import { buildOrganizationSchoolFilter } from "@/operations/queries/getPaginatedOrganizationSchools";

const useStyles = makeStyles((theme) => createStyles({
    info: {
        backgroundColor: `transparent`,
        color: theme.palette.grey[800],
        paddingBottom: theme.spacing(2),
    }
}));

export default function AcademicTermStep (props: EntityStepContent<SchoolStepper>) {
    const {
        value,
        disabled,
        onChange,
        loading: stepLoading,
        isEdit,
    } = props;

    const classes = useStyles();
    const intl = useIntl();
    const currentOrganization = useCurrentOrganization();


    // const canView = usePermission({
    //     OR: [ `view_academic_term_20116` ],
    // });

    const canView = usePermission({
        OR: [ `view_school_20110`, `view_my_school_20119` ], // change to at some point view_academic_term_20116
    });

    const [ tableFilters, setTableFilters ] = useState<Filter[]>([]);
    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `name`,
    });
    
    const paginationFilter = buildOrganizationSchoolFilter({
        organizationId: currentOrganization?.id ?? ``,
        search: serverPagination.search,
    });
    
    const {
        loading,
        data,
        refetch,
        fetchMore, 
    } = useGetAllAcademicTerms({
        variables: {
            direction: `FORWARD`,
            count: serverPagination.rowsPerPage,
            order: serverPagination.order,
            orderBy: serverPagination.orderBy,
            filter: paginationFilter
        },
        skip: !currentOrganization?.id || !canView,
        notifyOnNetworkStatusChange: true,
    });

    console.log(data);
    

    const handlePageChange = async (pageChange: PageChange, order: Order, cursor: string | undefined, count: number) => {
        const direction = pageChangeToDirection(pageChange);
        await fetchMore({
            variables: {
                count,
                cursor,
                direction,
            },
        });
    };

    const handleTableChange = async (tableData: CursorTableData<AcademicTermRow>) => {
        setTableFilters(tableData?.filters ?? []);
        setServerPagination({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            search: tableData.search,
            rowsPerPage: tableData.rowsPerPage,
        });
    };
    

    const rows = data?.schoolsConnection?.edges?.filter((edge)=> edge.node.id === value.id)
        .map((schoolEdge) => schoolEdge.node.academicTermsConnection.edges)
        .flatMap((academicTermEdgeArray) => academicTermEdgeArray.map((academicTermEdge) => mapAcademicTermNodeToAcademicTermRow(academicTermEdge.node)))
        ?? [];

        console.log(rows);
        

    return (
        <>
            <Alert severity="info" className={classes.info} icon={<InfoIcon color="action"/>}>
                {intl.formatMessage({
                    id: `academicTerm.todo`,
                    defaultMessage: `Academic term can be used to configure when classes and class rosters should be active. Adding academic years to a school is optional.`,
                })}
            </Alert>
            <AcademicTermTable
                rows={rows}
                loading={loading}
                order={serverToTableOrder(serverPagination.order)}
                orderBy={serverPagination.orderBy}
                rowsPerPage={serverPagination.rowsPerPage}
                search={serverPagination.search}
                total={rows.length}
                hasNextPage={false}
                hasPreviousPage={false}
                startCursor={undefined}
                endCursor={undefined}
                onPageChange={handlePageChange}
                onTableChange={handleTableChange}
                schoolId={value.id}
            />
        </>
    );
}
