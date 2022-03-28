import { ProgramForm } from "@/api/programs";
import { useGetAllPaginatedSubjects } from "@/api/subjects";
import SubjectTable,
{ SubjectRow } from "@/components/Subject/Table";
import { buildSubjectIdsFilter } from "@/operations/queries/getPaginatedOrganizationSubjects";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { EntityStepContent } from "@/utils/entitySteps";
import { mapSubjectNodeToSubjectRow } from "@/utils/subjects";
import {
    DEFAULT_ROWS_PER_PAGE,
    pageChangeToDirection,
    ServerCursorPagination,
    serverToTableOrder,
    tableToServerOrder,
} from "@/utils/table";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { Order } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Cursor/Table";
import React,
{
    useEffect,
    useState,
} from "react";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {

}

export default function SelectedSubjectsTable (props: EntityStepContent<ProgramForm>) {
    const {
        value,
        disabled,
    } = props;
    const classes = useStyles();
    const currentOrganization = useCurrentOrganization();
    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `name`,
    });

    const paginationFilter = buildSubjectIdsFilter(value?.subjects ?? []);

    const {
        data,
        refetch,
        fetchMore,
        loading,
    } = useGetAllPaginatedSubjects({
        variables: {
            direction: `FORWARD`,
            count: serverPagination.rowsPerPage,
            orderBy: serverPagination.orderBy,
            order: serverPagination.order,
            filter: paginationFilter,
        },
        skip: !currentOrganization?.id,
        notifyOnNetworkStatusChange: true,
    });

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

    const handleTableChange = async (tableData: CursorTableData<SubjectRow>) => {
        if (loading) return;
        setServerPagination({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            search: ``,
            rowsPerPage: tableData.rowsPerPage,
        });
    };

    useEffect(() => {
        refetch({
            count: serverPagination.rowsPerPage,
            order: serverPagination.order,
            orderBy: serverPagination.orderBy,
        });
    }, [
        serverPagination.order,
        serverPagination.orderBy,
        serverPagination.rowsPerPage,
    ]);

    const rows = data?.subjectsConnection?.edges
        .map((edge) => mapSubjectNodeToSubjectRow(edge.node))
        ?? [];

    return (
        <SubjectTable
            hideFilters
            disabled={disabled}
            rows={rows}
            loading={loading}
            hasNextPage={data?.subjectsConnection?.pageInfo.hasNextPage}
            hasPreviousPage={data?.subjectsConnection?.pageInfo.hasPreviousPage}
            startCursor={data?.subjectsConnection?.pageInfo.startCursor}
            endCursor={data?.subjectsConnection?.pageInfo.endCursor}
            total={data?.subjectsConnection?.totalCount}
            order={serverToTableOrder(serverPagination.order)}
            orderBy={serverPagination.orderBy}
            rowsPerPage={serverPagination.rowsPerPage}
            refetch={refetch}
            onPageChange={handlePageChange}
            onTableChange={handleTableChange}
        />
    );

}
