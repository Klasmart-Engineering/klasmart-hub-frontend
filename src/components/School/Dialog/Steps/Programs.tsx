import { TabContent } from "./shared";
import {
    ProgramFilter,
    useDeleteProgram,
    useGetAllPaginatedPrograms,
} from "@/api/programs";
import ProgramsTable,
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
import { useValidations } from "@/utils/validations";
import {
    createStyles,
    FormHelperText,
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

export default function ProgramsStep (props: TabContent) {
    const {
        programIds,
        disabled,
        onProgramIdsChange,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { required } = useValidations();
    const [ deleteProgram ] = useDeleteProgram();
    const { enqueueSnackbar } = useSnackbar();
    const currentOrganization = useCurrentOrganization();
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
        loading,
    } = useGetAllPaginatedPrograms({
        variables: {
            direction: `FORWARD`,
            count: tableState.rowsPerPage,
            orderBy: `name`,
            order: `ASC`,
            filter: queryFilter,
        },
        skip: !currentOrganization?.organization_id,
        fetchPolicy: `network-only`,
        notifyOnNetworkStatusChange: true,
    });

    const selectedProgramssError = required()(programIds?.length);

    const onTableChange = async (tableData: CursorTableData<ProgramRow>) => {
        if (loading) return;
        setTableState({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            search: tableData.search,
            rowsPerPage: tableData.rowsPerPage,
        });
    };

    const onPageChange = async (pageChange: PageChange, order: Order, cursor: string | undefined, count: number) => {
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
        try {
            await deleteProgram({
                variables: {
                    id,
                },
            });
            await refetch?.();

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
        <>
            <ProgramsTable
                showSelectables={true}
                disabled={disabled}
                selectedIds={disabled ? undefined : programIds}
                loading={loading}
                programs={mapProgramEdgesToPrograms(data?.programsConnection?.edges ?? [])}
                total={data?.programsConnection?.totalCount}
                rowsPerPage={tableState.rowsPerPage}
                search={tableState.search}
                pageInfo={data?.programsConnection?.pageInfo}
                refetch={refetch}
                order={serverToTableOrder(tableState.order)}
                orderBy={tableState.orderBy}
                onPageChange={onPageChange}
                onTableChange={onTableChange}
                onSelected={(ids: string[]) => { onProgramIdsChange?.(ids); }}
                onDeleteRow={handleDeleteProgram}
            />
            {!disabled && <FormHelperText error>{selectedProgramssError === true ? ` ` : selectedProgramssError}</FormHelperText>}
        </>
    );
}
