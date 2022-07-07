import FeedbackComment from "./FeedbackComment";
import {
    AssessmentForStudent,
    useRestAPI,
} from "@/api/restapi";
import globalStyles from "@/globalStyles";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { mapAssessmentScheduleServerToClientType } from "@/utils/assessments";
import { getTableLocalization } from "@/utils/table";
import {
    Button,
    FileCounterIconButton,
    PageTable,
    UserAvatar,
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import { TableColumn } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Head";
import { PageTableData } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Page/Table";
import {
    HelpOutline,
    SentimentDissatisfied,
    SentimentSatisfied,
    SentimentSatisfiedAlt,
    SentimentVeryDissatisfied,
    SentimentVerySatisfied,
} from "@mui/icons-material";
import {
    Box,
    Fade,
    Popover,
    Typography,
    useTheme,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React,
{
    useCallback,
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => {
    const { clickable } = globalStyles(theme);
    return createStyles({
        clickable,
        cardBody: {
            minHeight: theme.spacing(8),
        },
        sentimentContainer: {
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`,
        },
        sentimentIcon: {
            fontSize: 32,
        },
        teacherAvatar: {
            marginRight: theme.spacing(1),
        },
        moreFeedbackPopover: {
            transform: `translate(${theme.spacing(-2)}, ${theme.spacing(-2)})`,
        },
    });
});

const MIN_MORE_FEEDBACK_WIDTH = 240;
const ROWS_PER_PAGE = 5;

export const mapAssessmentForStudentToTeacherFeedbackRow = (item: AssessmentForStudent): TeacherFeedbackRow => {
    const lastTeacherComment = item.teacher_comments.slice(-1)[0];
    return {
        id: item.id,
        feedback: lastTeacherComment?.comment ?? ``,
        files: item.student_attachments ?? [],
        score: item.score,
        teacherName: lastTeacherComment ? `${lastTeacherComment.teacher.given_name} ${lastTeacherComment.teacher.family_name}`.trim() : ``,
        teacherAvatar: lastTeacherComment?.teacher.avatar ?? ``,
        title: item.title,
        type: mapAssessmentScheduleServerToClientType(item.schedule.type),
    };
};

interface FileItem {
    id: string;
    name: string;
}

export interface TeacherFeedbackRow {
    id: string;
    title: string;
    type: string;
    score: number;
    teacherName: string;
    teacherAvatar: string;
    feedback: string;
    files: FileItem[];
}

interface Props {
}

export default function TeacherFeedback (props: Props) {
    const classes = useStyles();
    const theme = useTheme();
    const intl = useIntl();
    const restApi = useRestAPI();
    const { enqueueSnackbar } = useSnackbar();
    const currentOrganization = useCurrentOrganization();
    const [ moreFeedbackAnchorEl, setMoreFeedbackAnchorEl ] = useState<null | HTMLElement>(null);
    const [ selectedRow, setSelectedRow ] = useState<TeacherFeedbackRow>();
    const [ moreFeedbackWidth, setMoreFeedbackWidth ] = useState(0);
    const [ groupBy, setGroupBy ] = useState(`type`);
    const [ subgroupBy, setSubgroupBy ] = useState(`home_fun_study`);
    const [ page, setPage ] = useState(0);
    const [ loading, setLoading ] = useState(false);
    const [ rows, setRows ] = useState<TeacherFeedbackRow[]>([]);
    const [ totalCount, setTotalCount ] = useState(0);
    const moreFeedbackOpen = Boolean(moreFeedbackAnchorEl);

    const handleMoreFeedbackOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
        setSelectedRow(rows.find(row => row.id === id));
        const anchorEl = event.currentTarget;
        setMoreFeedbackAnchorEl(anchorEl);
        setMoreFeedbackWidth(anchorEl.clientWidth);
    };

    const handleMoreFeedbackClose = () => {
        setMoreFeedbackAnchorEl(null);
    };

    const columns: TableColumn<TeacherFeedbackRow>[] = [
        {
            id: `id`,
            label: intl.formatMessage({
                id: `generic_idLabel`,
            }),
            disableSearch: true,
            disableSort: true,
            secret: true,
        },
        {
            id: `title`,
            label: intl.formatMessage({
                id: `teacherFeedback.column.title`,
            }),
            disableSearch: true,
            disableSort: true,
            render: (row) => (
                <Box
                    display="flex"
                    alignItems="center"
                >
                    <FileCounterIconButton
                        menuTitle={intl.formatMessage({
                            id: `teacherFeedback.student.submissions`,
                        })}
                        files={row.files.map((file) => ({
                            name: file.name,
                            onDownloadClick: async () => {
                                try {
                                    const contentResource = await restApi.getContentsResourcesDownloadById({
                                        org_id: currentOrganization?.id ?? ``,
                                        resource_id: file.id,
                                    });
                                    if (!contentResource) throw Error(`content-resource-not-found`);
                                    window.open(contentResource.path, `_blank`);
                                } catch (err) {
                                    enqueueSnackbar(intl.formatMessage({
                                        id: `classes_classSaveError`,
                                    }), {
                                        variant: `error`,
                                    });
                                }
                            },
                        }))}
                    />
                    <Box ml={1}>{row.title}</Box>
                </Box>
            ),
        },
        {
            id: `type`,
            label: intl.formatMessage({
                id: `teacherFeedback.column.type`,
            }),
            secret: true,
            disableSearch: true,
            disableSort: true,
            groups: [
                {
                    text: intl.formatMessage({
                        id: `class.type.homeFun`,
                    }),
                    value: `home_fun_study`,
                },
            ],
        },
        {
            id: `score`,
            label: intl.formatMessage({
                id: `teacherFeedback.column.score`,
            }),
            align: `center`,
            disableSearch: true,
            disableSort: true,
            render: (row) => scoreToSentimentIcon(row.score),
        },
        {
            id: `feedback`,
            label: intl.formatMessage({
                id: `teacherFeedback.column.feedback`,
            }),
            disableSearch: true,
            disableSort: true,
            render: (row) => {
                if (!row.feedback) return (
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        style={{
                            fontStyle: `italic`,
                        }}
                    >
                        {intl.formatMessage({
                            id: `teacherFeedback.column.feedback.empty`,
                        })}
                    </Typography>
                );
                return (
                    <FeedbackComment
                        id={row.id}
                        feedback={row.feedback}
                        handleMoreFeedbackOpen={handleMoreFeedbackOpen}
                    />
                );
            },
        },
    ];

    const fetchStatusGroups = async () => {
        setLoading(true);
        try {
            const now = new Date();
            const fourteenDaysAgo = new Date();
            fourteenDaysAgo.setDate(now.getDate() - 14);
            const resp = await restApi.getAssessmentsForStudent({
                org_id: currentOrganization?.id ?? ``,
                page: page + 1, // table component starts at 0, api starts at 1
                page_size: ROWS_PER_PAGE,
                type: subgroupBy,
                order_by: `-complete_at`,
                complete_at_ge: Math.floor(fourteenDaysAgo.getTime() / 1000),
                complete_at_le: Math.floor(now.getTime() / 1000),
            });
            const { list = [], total = 0 } = resp ?? {};
            setTotalCount(total);
            setRows(list.map(mapAssessmentForStudentToTeacherFeedbackRow));
        } catch (err) {
            setTotalCount(0);
            setRows([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStatusGroups();
    }, [
        currentOrganization,
        subgroupBy,
        page,
    ]);

    const scoreToSentimentIcon = useCallback((score: number) => {
        switch (score) {
        case 5: return (
            <div className={classes.sentimentContainer}>
                <SentimentVerySatisfied
                    className={classes.sentimentIcon}
                    style={{
                        color: theme.palette.success.main,
                    }}
                />
                <Typography
                    color="textSecondary"
                    variant="caption"
                >
                    {intl.formatMessage({
                        id: `assessment.feedback.score.excellent`,
                    })}
                </Typography>
            </div>
        );
        case 4: return (
            <div className={classes.sentimentContainer}>
                <SentimentSatisfiedAlt
                    className={classes.sentimentIcon}
                    style={{
                        color: `#A1CC41`,
                    }}
                />
                <Typography
                    color="textSecondary"
                    variant="caption"
                >
                    {intl.formatMessage({
                        id: `assessment.feedback.score.good`,
                    })}
                </Typography>
            </div>
        );
        case 3: return (
            <div className={classes.sentimentContainer}>
                <SentimentSatisfied
                    className={classes.sentimentIcon}
                    style={{
                        color: theme.palette.warning.main,
                    }}
                />
                <Typography
                    color="textSecondary"
                    variant="caption"
                >
                    {intl.formatMessage({
                        id: `assessment.feedback.score.average`,
                    })}
                </Typography>
            </div>
        );
        case 2: return (
            <div className={classes.sentimentContainer}>
                <SentimentDissatisfied
                    className={classes.sentimentIcon}
                    style={{
                        color: `#DC6F17`,
                    }}
                />
                <Typography
                    color="textSecondary"
                    variant="caption"
                >
                    {intl.formatMessage({
                        id: `assessment.feedback.score.fair`,
                    })}
                </Typography>
            </div>
        );
        case 1: return (
            <div className={classes.sentimentContainer}>
                <SentimentVeryDissatisfied
                    className={classes.sentimentIcon}
                    style={{
                        color: theme.palette.error.main,
                    }}
                />
                <Typography
                    color="textSecondary"
                    variant="caption"
                >
                    {intl.formatMessage({
                        id: `assessment.feedback.score.poor`,
                    })}
                </Typography>
            </div>
        );
        default: return (
            <HelpOutline
                className={classes.sentimentIcon}
                color="disabled"
            />
        );
        }
    }, [ theme, classes ]);

    const handleTableOnChange = (tableData: PageTableData<TeacherFeedbackRow>) => {
        setPage(tableData.page);
    };

    return (
        <>
            <Box
                className={classes.cardBody}
                display="flex"
                flexDirection="column"
                flex="1"
            >
                <PageTable
                    hideAllGroupTab
                    hideNoGroupOption
                    idField="id"
                    page={page}
                    loading={loading}
                    columns={columns}
                    groupBy={groupBy}
                    subgroupBy={subgroupBy}
                    total={totalCount}
                    rows={rows}
                    rowsPerPage={ROWS_PER_PAGE}
                    rowsPerPageOptions={[ ROWS_PER_PAGE ]}
                    localization={getTableLocalization(intl, {
                        title: intl.formatMessage({
                            id: `teacherFeedback.title`,
                        }),
                        noData: intl.formatMessage({
                            id: `teacherFeedback.body.empty`,
                        }, {
                            count: 14,
                        }),
                    })}
                    onChange={handleTableOnChange}
                />
            </Box>
            <Popover
                anchorEl={moreFeedbackAnchorEl}
                open={moreFeedbackOpen}
                className={classes.moreFeedbackPopover}
                anchorOrigin={{
                    vertical: `top`,
                    horizontal: `left`,
                }}
                transformOrigin={{
                    vertical: `top`,
                    horizontal: `left`,
                }}
                TransitionComponent={Fade}
                onClose={() => handleMoreFeedbackClose()}
            >
                <Box
                    p={2}
                    display="flex"
                    flexDirection="column"
                    width={Math.max(moreFeedbackWidth, MIN_MORE_FEEDBACK_WIDTH) + theme.spacing(2 * 2)}
                >
                    <Typography variant="body2">{selectedRow?.feedback}</Typography>
                    <Box
                        mt={2}
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                    >
                        <UserAvatar
                            name={selectedRow?.teacherName ?? ``}
                            src={selectedRow?.teacherAvatar}
                            className={classes.teacherAvatar}
                            size="small"
                        />
                        <Typography
                            variant="caption"
                            color="textSecondary"
                        >
                            {selectedRow?.teacherName}
                        </Typography>
                        <Box flex="1" />
                        <Button
                            color="primary"
                            label={intl.formatMessage({
                                id: `common.close`,
                            })}
                            onClick={() => handleMoreFeedbackClose()}
                        />
                    </Box>
                </Box>
            </Popover>
        </>
    );
}
