import {
    ProgramFilter,
    useDeleteProgram,
    useGetAllPaginatedPrograms,
} from "@/api/programs";
import ProgramTable,
{ ProgramRow } from "@/components/Program/Table";
import { buildProgramOrganizationFilter } from "@/operations/queries/getPaginatedOrganizationPrograms";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { isUUID } from "@/utils/pagination";
import { mapProgramEdgesToPrograms } from "@/utils/programs";
import {
    DEFAULT_ROWS_PER_PAGE,
    pageChangeToDirection,
    serverToTableOrder,
    TableState,
    tableToServerOrder,
} from "@/utils/table";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import { useSnackbar } from "kidsloop-px";
import { Order } from "kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "kidsloop-px/dist/types/components/Table/Cursor/Table";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {}

export default function ProgramsPage (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const currentOrganization = useCurrentOrganization();
    const [ deleteProgram ] = useDeleteProgram();
    const { enqueueSnackbar } = useSnackbar();
    const [ tableState, setTableState ] = useState<TableState>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `name`,
    });

    const searchFilter: ProgramFilter[] = [
        {
            ...isUUID(tableState.search ?? ``)
                ? {
                    id: {
                        operator: `eq`,
                        value: tableState.search ?? ``,
                    },
                }
                : {
                    name: {
                        operator: `contains`,
                        value: tableState.search ?? ``,
                        caseInsensitive: true,
                    },
                },
        },
    ];
    const queryFilter = buildProgramOrganizationFilter(currentOrganization?.organization_id, searchFilter);

    const {
        data,
        refetch,
        fetchMore: fetchMorePrograms,
        loading: loadingPrograms,
    } = useGetAllPaginatedPrograms({
        variables: {
            direction: `FORWARD`,
            count: tableState.rowsPerPage,
            orderBy: `name`,
            order: `ASC`,
            filter: queryFilter,
        },
        skip: !currentOrganization?.organization_id,
        notifyOnNetworkStatusChange: true,
    });

    const handleTableChange = async (tableData: CursorTableData<ProgramRow>) => {
        if (loadingPrograms) return;
        setTableState({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            search: tableData.search,
            rowsPerPage: tableData.rowsPerPage,
        });
    };

    const handlePageChange = async (pageChange: PageChange, order: Order, cursor: string | undefined, count: number) => {
        const direction = pageChangeToDirection(pageChange);
        await fetchMorePrograms({
            variables: {
                count,
                cursor,
                direction,
            },
        });
    };

    const handleDeleteProgram = async (id: string) => {
        await deleteProgram({
            variables: {
                id,
            },
        });
        refetch?.();
        try {
            enqueueSnackbar(intl.formatMessage({
                id: `programs_deleteSuccess`,
            }), {
                variant: `success`,
            });
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `generic_createError`,
            }), {
                variant: `error`,
            });
        }
    };

    useEffect(() => {
        refetch({
            count: tableState.rowsPerPage,
            order: tableState.order,
            orderBy: tableState.orderBy,
            filter: queryFilter,
        });
    }, [
        tableState.search,
        tableState.order,
        tableState.orderBy,
        tableState.rowsPerPage,
    ]);

    return (
        <ProgramTable
            programs={mapProgramEdgesToPrograms(data?.programsConnection?.edges ?? [])}
            loading={loadingPrograms}
            pageInfo={data?.programsConnection?.pageInfo}
            total={data?.programsConnection?.totalCount}
            order={serverToTableOrder(tableState.order)}
            orderBy={tableState.orderBy}
            rowsPerPage={tableState.rowsPerPage}
            search={tableState.search}
            refetch={refetch}
            onPageChange={handlePageChange}
            onTableChange={handleTableChange}
            onDeleteRow={handleDeleteProgram}
        />
    );
}
