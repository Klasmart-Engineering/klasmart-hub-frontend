import {
    ProgramFilter,
    useGetAllPaginatedPrograms,
} from "@/api/programs";
import ProgramsTable,
{ ProgramRow } from "@/components/Program/Table";
import { buildOrganizationProgramFilter } from "@/operations/queries/getPaginatedOrganizationPrograms";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    isActive,
    School,
} from "@/types/graphQL";
import { EntityStepContent } from "@/utils/entitySteps";
import { isUuid } from "@/utils/pagination";
import { mapProgramNodeToProgramRow } from "@/utils/programs";
import {
    DEFAULT_ROWS_PER_PAGE,
    pageChangeToDirection,
    ServerCursorPagination,
    serverToTableOrder,
    tableToServerOrder,
} from "@/utils/table";
import { useValidations } from "@/utils/validations";
import {
    createStyles,
    FormHelperText,
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

export default function ProgramsStep (props: EntityStepContent<School>) {
    const {
        value,
        disabled,
        onChange,
    } = props;
    const classes = useStyles();
    const { required } = useValidations();
    const currentOrganization = useCurrentOrganization();
    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `name`,
    });

    const paginationFilter = buildOrganizationProgramFilter({
        organizationId: currentOrganization?.organization_id ?? ``,
        search: serverPagination.search,
    });

    const {
        data,
        refetch,
        fetchMore,
        loading,
    } = useGetAllPaginatedPrograms({
        variables: {
            direction: `FORWARD`,
            count: serverPagination.rowsPerPage,
            orderBy: serverPagination.orderBy,
            order: serverPagination.order,
            filter: paginationFilter,
        },
        skip: !currentOrganization?.organization_id,
        fetchPolicy: `cache-and-network`,
        notifyOnNetworkStatusChange: true,
    });

    const selectedIds = value?.programs?.map((program) => program.id ?? ``) ?? [];

    const selectedProgramsError = required()(selectedIds);

    const handleTableChange = async (tableData: CursorTableData<ProgramRow>) => {
        if (loading) return;
        setServerPagination({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            search: tableData.search,
            rowsPerPage: tableData.rowsPerPage,
        });
    };

    const handlePageChange = async (pageChange: PageChange, order: Order, cursor: string | undefined, count: number) => {
        const direction = pageChangeToDirection(pageChange);
        fetchMore({
            variables: {
                count,
                cursor,
                direction,
            },
        });
    };

    const handleSelected = (ids: string[]) => {
        onChange?.({
            ...value,
            programs: ids.map((id) => ({
                id: id ?? ``,
            })),
        });
    };

    useEffect(() => {
        refetch({
            count: serverPagination.rowsPerPage,
            order: serverPagination.order,
            orderBy: serverPagination.orderBy,
            filter: paginationFilter,
        });
    }, [
        serverPagination.search,
        serverPagination.order,
        serverPagination.orderBy,
        serverPagination.rowsPerPage,
    ]);

    const rows = data?.programsConnection?.edges
        .filter((edge) => isActive(edge.node))
        .map((edge) => mapProgramNodeToProgramRow(edge.node))
        ?? [];

    return (
        <>
            <ProgramsTable
                showSelectables
                rows={rows}
                disabled={disabled}
                selectedIds={disabled ? undefined : selectedIds}
                loading={loading}
                total={data?.programsConnection?.totalCount}
                rowsPerPage={serverPagination.rowsPerPage}
                search={serverPagination.search}
                hasNextPage={data?.programsConnection?.pageInfo.hasNextPage}
                hasPreviousPage={data?.programsConnection?.pageInfo.hasPreviousPage}
                startCursor={data?.programsConnection?.pageInfo.startCursor}
                endCursor={data?.programsConnection?.pageInfo.endCursor}
                refetch={refetch}
                order={serverToTableOrder(serverPagination.order)}
                orderBy={serverPagination.orderBy}
                onPageChange={handlePageChange}
                onTableChange={handleTableChange}
                onSelected={handleSelected}
            />
            {!disabled && <FormHelperText error>{selectedProgramsError === true ? ` ` : selectedProgramsError}</FormHelperText>}
        </>
    );
}
