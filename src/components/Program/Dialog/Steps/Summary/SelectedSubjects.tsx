import { useGetAllPaginatedSubjects } from "@/api/subjects";
import SubjectTable,
{ SubjectRow } from "@/components/Subject/Table";
import { buildSubjectIdsFilter } from "@/operations/queries/getPaginatedOrganizationSubjects";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    Program,
    Status,
    Subject,
} from "@/types/graphQL";
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
} from "@material-ui/core";
import { Order } from "kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "kidsloop-px/dist/types/components/Table/Cursor/Table";
import React,
{
    useEffect,
    useState,
} from "react";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {

}

export default function SelectedSubjectsTable (props: EntityStepContent<Program>) {
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

    const paginationFilter = buildSubjectIdsFilter(value?.subjects?.map((subject) => subject.id ?? ``) ?? []);

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
        skip: !currentOrganization?.organization_id,
        notifyOnNetworkStatusChange: true,
        context: {
            requestTrackerId: `SelectedSubjectsTable`,
        },
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
