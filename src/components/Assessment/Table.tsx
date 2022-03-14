import {
    buildDefaultAssessmentStatusTabs,
    getStatusLabel,
} from "./utils";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    AssessmentItem,
    AssessmentStatus,
    useGetAssessments,
    useGetAssessmentsSummary,
} from "@kidsloop/cms-api-client";
import { Box } from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
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
    useMemo,
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
    const intl = useIntl();

    const [ page, setPage ] = useState(0);
    const [ subgroupBy, setSubgroupBy ] = useState<string | undefined>(`in_progress`);
    const currentOrganization = useCurrentOrganization();

    const { data: assessmentsData, isLoading: assessmentsLoading } = useGetAssessments({
        org_id: currentOrganization?.id ?? ``,
        page: page + 1,
        page_size: ROWS_PER_PAGE,
        status: subgroupBy,
    }, {
        queryOptions: {
            enabled: !!currentOrganization?.id,
        },
    });

    const assessmentItemData = useMemo(() => {
        const items = assessmentsData?.items ?? [];
        const total = assessmentsData?.total ?? 0;
        return {
            rows: items,
            total,
        };
    }, [ assessmentsData ]);

    const { data: assessmentsSummaryData, isLoading: assessmentsSummaryLoading } = useGetAssessmentsSummary({
        org_id: currentOrganization?.id ?? ``,
    }, {
        queryOptions: {
            enabled: !!currentOrganization?.id,
        },
    });

    const statusGroups = useMemo(() => {
        if (!assessmentsSummaryData) return buildDefaultAssessmentStatusTabs(intl) ?? [];
        const assessmentStatus: AssessmentStatus[] = [ `complete`, `in_progress` ];
        const groups: SubgroupTab[] = assessmentStatus.map((status) => ({
            text: getStatusLabel(status, intl),
            value: status,
            count: assessmentsSummaryData?.[status] ?? 0,
        }));
        return groups;
    }, [ assessmentsSummaryData ]);

    const allStatusTotal = useMemo(() => {
        return sumBy(statusGroups, (group) => typeof group.count === `number` ? group.count : 0);
    }, [ statusGroups ]);

    const handleOnChange = (tableData: PageTableData<AssessmentItem>) => {
        setPage(tableData.page);
        setSubgroupBy(tableData.subgroupBy);
    };

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
                    flexWrap="wrap"
                    display="flex"
                    flexDirection="row"
                >
                    {row.teachers?.sort((a, b) => a.name.localeCompare(b.name)).map((teacher) => (
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
            loading={assessmentsLoading || assessmentsSummaryLoading}
            columns={columns}
            rows={assessmentItemData.rows}
            total={assessmentItemData.total}
            groupBy="status"
            subgroupBy={subgroupBy}
            rowsPerPage={ROWS_PER_PAGE}
            rowsPerPageOptions={[ ROWS_PER_PAGE ]}
            noGroupTotal={allStatusTotal}
            onChange={(tableData) => handleOnChange(tableData)}
        />
    );
}
