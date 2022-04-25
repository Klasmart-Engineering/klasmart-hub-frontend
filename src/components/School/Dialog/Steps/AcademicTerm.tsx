import AcademicTermTable, { AcademicTermRow } from "../../AcademicTerm/Table";
import { SchoolStepper } from "./shared";
import { EntityStepContent } from "@/utils/entitySteps";
import { Alert } from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { DEFAULT_ROWS_PER_PAGE, pageChangeToDirection, ServerCursorPagination, serverToTableOrder, tableToServerOrder } from "@/utils/table";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { usePermission } from "@/utils/permissions";
import { PageChange } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { Order } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Head";
import { Info as InfoIcon } from "@mui/icons-material";
import { CursorTableData } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Cursor/Table";
import {builAcademicTermFilter,
     useGetPaginatedAcademicTerms } from "@/api/academicTerms";
import { mapAcademicTermNodeToAcademicTermRow } from "@/utils/academicTerms";

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
    } = props;

    const classes = useStyles();
    const intl = useIntl();
    const currentOrganization = useCurrentOrganization();

    const canView = usePermission({
        OR: [ `view_academic_term_20116` ],
    });

    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `name`,
    });

    const paginationFilter = builAcademicTermFilter({ search: serverPagination.search });

    const {
        loading,
        data,
        refetch: refetchAcacemicTerms,
        fetchMore, 
    } = useGetPaginatedAcademicTerms({
        variables: {
            id: value.id,
            direction: `FORWARD`,
            count: serverPagination.rowsPerPage,
            cursor: serverPagination.cursor,
            order: serverPagination.order,
            orderBy: serverPagination.orderBy,
            filter: paginationFilter,
        },
        skip: !currentOrganization?.id || !canView || !value,
        notifyOnNetworkStatusChange: true,
    });
    
    const handlePageChange = async (pageChange: PageChange, order: Order, cursor: string | undefined, count: number) => {
        const direction = pageChangeToDirection(pageChange);
        await fetchMore({
            variables: {
                count,
                cursor,
                direction
            },
        });
    };

    const handleTableChange = async (tableData: CursorTableData<AcademicTermRow>) => {
        setServerPagination({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            rowsPerPage: tableData.rowsPerPage,
            search: tableData.search,
        });
    };

    useEffect(() => {
        refetchAcacemicTerms({
            count: serverPagination.rowsPerPage,
            order: serverPagination.order,
            orderBy: serverPagination.orderBy,
            search: serverPagination.search,
        });
        }, [
            currentOrganization?.id,
    ]);
    
    const rows = data?.schoolNode?.academicTermsConnection?.edges.map((edge) => mapAcademicTermNodeToAcademicTermRow(edge.node)) ?? []
        
    return (
        <>
            {!disabled && (
                <Alert severity="info" className={classes.info} icon={<InfoIcon color="action"/>}>
                {intl.formatMessage({
                    id: `academicTerm.info`,
                    defaultMessage: `Academic term can be used to configure when classes and class rosters should be active. Adding academic years to a school is optional.`,
                })}
            </Alert>
            )}
            <AcademicTermTable
                disabled={disabled}
                rows={rows}
                loading={loading}
                order={serverToTableOrder(serverPagination.order)}
                orderBy={serverPagination.orderBy}
                rowsPerPage={serverPagination.rowsPerPage}
                search={serverPagination.search}
                cursor={serverPagination.cursor}
                total={data?.schoolNode?.academicTermsConnection?.totalCount}
                hasNextPage={data?.schoolNode?.academicTermsConnection?.pageInfo.hasNextPage}
                hasPreviousPage={data?.schoolNode?.academicTermsConnection?.pageInfo.hasPreviousPage}
                startCursor={data?.schoolNode?.academicTermsConnection?.pageInfo.startCursor}
                endCursor={data?.schoolNode?.academicTermsConnection?.pageInfo.endCursor}
                onPageChange={handlePageChange}
                onTableChange={handleTableChange}
                schoolId={value.id}
            />
        </>
    );
}
