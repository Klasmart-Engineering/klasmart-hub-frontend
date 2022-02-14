import {
    SubjectEdge,
    useGetAllPaginatedSubjects,
} from "@/api/subjects";
import SubjectsTable,
{ SubjectRow } from "@/components/Subject/Table";
import {
    buildOrganizationSubjectFilter,
    buildSubjectsFilters,
} from "@/operations/queries/getPaginatedOrganizationSubjects";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Program } from "@/types/graphQL";
import { EntityStepContent } from "@/utils/entitySteps";
import { mapSubjectNodeToSubjectRow } from "@/utils/subjects";
import {
    DEFAULT_ROWS_PER_PAGE,
    pageChangeToDirection,
    ServerCursorPagination,
    serverToTableOrder,
    tableToServerOrder,
} from "@/utils/table";
import { useValidations } from "@/utils/validations";
import { FormHelperText } from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { Filter } from "kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import { Order } from "kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "kidsloop-px/dist/types/components/Table/Cursor/Table";
import React,
{
    useEffect,
    useState,
} from "react";

const useStyles = makeStyles((theme) => createStyles({}));

export default function SubjectStep (props: EntityStepContent<Program>) {
    const {
        value,
        disabled,
        onChange,
    } = props;
    const classes = useStyles();
    const { required } = useValidations();
    const currentOrganization = useCurrentOrganization();
    const [ tableFilters, setTableFilters ] = useState<Filter[]>([]);
    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `name`,
    });

    const paginationFilter = buildOrganizationSubjectFilter({
        organizationId: currentOrganization?.organization_id ?? ``,
        search: serverPagination.search,
        filters: buildSubjectsFilters(tableFilters),
    });

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
    });

    const selectedIds = value.subjects?.map((subject) => subject.id ?? ``) ?? [];
    const selectedSubjectsError = required()(selectedIds);

    const handleSelected = (ids: string[]) => {
        onChange?.({
            ...value,
            subjects: ids.map((id) => ({
                id: id ?? ``,
            })),
        });
    };

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
            search: tableData.search,
            rowsPerPage: tableData.rowsPerPage,
        });
        setTableFilters(tableData?.filters ?? []);
    };

    useEffect(() => {
        refetch({
            count: serverPagination.rowsPerPage,
            order: serverPagination.order,
            orderBy: serverPagination.orderBy,
            search: serverPagination.search,
        });
    }, [
        serverPagination.order,
        serverPagination.orderBy,
        serverPagination.rowsPerPage,
        serverPagination.search,
        tableFilters,
    ]);

    const rows = data?.subjectsConnection?.edges
        .map((edge: SubjectEdge) => mapSubjectNodeToSubjectRow(edge.node))
        ?? [];

    return (
        <>
            <SubjectsTable
                disabled={disabled}
                showSelectables={!disabled}
                selectedIds={disabled ? undefined : selectedIds}
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
                onSelected={handleSelected}
                onPageChange={handlePageChange}
                onTableChange={handleTableChange}
            />
            {!disabled && <FormHelperText error>{selectedSubjectsError === true ? ` ` : selectedSubjectsError}</FormHelperText>}
        </>
    );
}
