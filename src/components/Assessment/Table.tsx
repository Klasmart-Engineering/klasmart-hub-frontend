import { useRestAPI } from "@/api/restapi";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    AssessmentItem,
    AssessmentStatus,
} from "@/types/objectTypes";
import {
    buildDefaultAssessmentStatusTabs,
    getStatusLabel,
} from "@/utils/assessments";
import {
    Box,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import {
    PageTable,
    UserAvatar,
} from "kidsloop-px";
import { SubgroupTab } from "kidsloop-px/dist/types/components/Table/Common/GroupTabs";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
import { PageTableData } from "kidsloop-px/dist/types/components/Table/Page/Table";
import { sumBy } from "lodash";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    teacherAvatar: {
        margin: theme.spacing(0.5),
    },
}));

const ROWS_PER_PAGE = 5;

interface Props {
}

export default function AssessmentTable (props: Props) {
    const classes = useStyles();
    const restApi = useRestAPI();
    const intl = useIntl();

    const [ rows, setRows ] = useState<AssessmentItem[]>([]);
    const [ total, setTotal ] = useState(0);
    const [ allStatusTotal, setAllStatusTotal ] = useState(0);
    const [ page, setPage ] = useState(0);
    const [ loading, setLoading ] = useState(false);
    const [ subgroupBy, setSubgroupBy ] = useState<string| undefined>(AssessmentStatus.IN_PROGRESS);
    const [ statusGroups, setStatusGroups ] = useState<SubgroupTab[]>(buildDefaultAssessmentStatusTabs(intl) ?? []);
    const currentOrganization = useCurrentOrganization();

    const fetchStatusGroups = async () => {
        const assessmentSummary = await restApi.getAssessmentsSummary({
            org_id: currentOrganization?.organization_id ?? ``,
        });
        const groups: SubgroupTab[] = Object
            .values(AssessmentStatus)
            .map((status) => ({
                text: getStatusLabel(status, intl),
                value: status,
                count: assessmentSummary?.[status] ?? 0,
            }));

        const allCount = sumBy(groups, (group) => typeof group.count === `number` ? group.count : 0);

        setAllStatusTotal(allCount);
        setStatusGroups(groups);
    };

    const fetchRowsByStatus = async () => {
        const resp = await restApi.getAssessments({
            org_id: currentOrganization?.organization_id ?? ``,
            page: page + 1,
            page_size: ROWS_PER_PAGE,
            status: subgroupBy,
        });
        const items = resp?.items ?? [];
        const total = resp?.total ?? 0;
        setRows(items);
        setTotal(total);
    };

    const handleOnChange = (tableData: PageTableData<AssessmentItem>) => {
        setPage(tableData.page);
        setSubgroupBy(tableData.subgroupBy);
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                await Promise.all([ fetchStatusGroups() ]);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        })();
    }, [ currentOrganization ]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                await Promise.all([ fetchRowsByStatus() ]);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        })();
    }, [
        currentOrganization,
        subgroupBy,
        page,
    ]);

    const columns: TableColumn<AssessmentItem>[] = [
        {
            id: `id`,
            label: intl.formatMessage({
                id: `assessmentTable_id`,
            }),
            secret: true,
            disableSearch: true,
        },
        {
            id: `title`,
            label: intl.formatMessage({
                id: `assessmentTable_title`,
            }),
            disableSearch: true,
        },
        {
            id: `status`,
            label: intl.formatMessage({
                id: `assessmentTable_status`,
            }),
            disableSearch: true,
            hidden: true,
            groups: statusGroups,
        },
        {
            id: `teachers`,
            label: intl.formatMessage({
                id: `assessmentTable_teachers`,
            }),
            disableSearch: true,
            render: (row) => (
                <Box
                    flexWrap
                    display="flex"
                    flexDirection="row"
                >
                    {row.teachers.sort((a, b) => a.name.localeCompare(b.name)).map((teacher) => (
                        <UserAvatar
                            key={teacher.id}
                            className={classes.teacherAvatar}
                            name={teacher.name}
                            size="small"
                        />
                    ))}
                </Box>
            ),
        },
    ];

    return (
        <PageTable
            idField="id"
            page={page}
            loading={loading}
            columns={columns}
            rows={rows}
            total={total}
            groupBy="status"
            subgroupBy={subgroupBy}
            rowsPerPage={ROWS_PER_PAGE}
            rowsPerPageOptions={[ ROWS_PER_PAGE ]}
            noGroupTotal={allStatusTotal}
            onChange={(tableData) => handleOnChange(tableData)}
        />
    );
}
