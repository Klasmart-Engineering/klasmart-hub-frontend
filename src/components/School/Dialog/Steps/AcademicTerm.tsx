import { SchoolStepper } from "./shared";
import { useGetPaginatedAcademicTerms } from "@/api/academicTerms";
import AcademicTermTable,
{ AcademicTermRow } from "@/components/School/AcademicTerm/Table";
import { buildAcademicTermFilter } from "@/operations/queries/getPaginatedAcademicTerms";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { mapAcademicTermNodeToAcademicTermRow } from "@/utils/academicTerms";
import { EntityStepContent } from "@/utils/entitySteps";
import { usePermission } from "@/utils/permissions";
import {
    DEFAULT_ROWS_PER_PAGE,
    pageChangeToDirection,
    ServerCursorPagination,
    serverToTableOrder,
    tableToServerOrder,
} from "@/utils/table";
import { Order } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Cursor/Table";
import { Info as InfoIcon } from "@mui/icons-material";
import { Alert } from "@mui/lab";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    info: {
        backgroundColor: `transparent`,
        color: theme.palette.grey[800],
        paddingBottom: theme.spacing(2),
    },
}));

interface Props extends EntityStepContent<SchoolStepper> {}

export default function AcademicTermStep (props: Props) {
    const {
        value,
        disabled,
    } = props;

    const classes = useStyles();
    const intl = useIntl();
    const currentOrganization = useCurrentOrganization();

    const canView = usePermission(`view_academic_term_20116`);

    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `name`,
    });

    const paginationFilter = buildAcademicTermFilter({
        search: serverPagination.search,
    });

    const {
        loading,
        data,
        refetch,
        fetchMore,
    } = useGetPaginatedAcademicTerms({
        variables: {
            id: value.id,
            direction: `FORWARD`,
            count: serverPagination.rowsPerPage,
            order: serverPagination.order,
            orderBy: serverPagination.orderBy,
            filter: paginationFilter,
        },
        skip: !currentOrganization?.id || !canView || !value,
        fetchPolicy: `cache-and-network`,
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

    const handleTableChange = async (tableData: CursorTableData<AcademicTermRow>) => {
        if (loading) return;
        setServerPagination({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            rowsPerPage: tableData.rowsPerPage,
            search: tableData.search,
        });
    };

    useEffect(() => {
        refetch({
            count: serverPagination.rowsPerPage,
            order: serverPagination.order,
            orderBy: serverPagination.orderBy,
            filter: paginationFilter,
        });
    }, [ currentOrganization?.id ]);

    const rows = data?.schoolNode?.academicTermsConnection?.edges.map((edge) => mapAcademicTermNodeToAcademicTermRow(edge.node)) ?? [];

    return (
        <>
            {!disabled && (
                <Alert
                    severity="info"
                    className={classes.info}
                    icon={<InfoIcon color="action" />}
                >
                    {intl.formatMessage({
                        id: `academicTerm.info`,
                        defaultMessage: `Academic term can be used to configure when classes and class rosters should be active. Adding academic years to a school is optional.`,
                    })}
                </Alert>
            )}
            <AcademicTermTable
                rows={rows}
                disabled={disabled}
                loading={loading}
                total={data?.schoolNode?.academicTermsConnection?.totalCount}
                rowsPerPage={serverPagination.rowsPerPage}
                search={serverPagination.search}
                hasNextPage={data?.schoolNode?.academicTermsConnection?.pageInfo.hasNextPage}
                hasPreviousPage={data?.schoolNode?.academicTermsConnection?.pageInfo.hasPreviousPage}
                startCursor={data?.schoolNode?.academicTermsConnection?.pageInfo.startCursor}
                endCursor={data?.schoolNode?.academicTermsConnection?.pageInfo.endCursor}
                order={serverToTableOrder(serverPagination.order)}
                orderBy={serverPagination.orderBy}
                schoolId={value.id}
                onPageChange={handlePageChange}
                onTableChange={handleTableChange}
            />
        </>
    );
}
