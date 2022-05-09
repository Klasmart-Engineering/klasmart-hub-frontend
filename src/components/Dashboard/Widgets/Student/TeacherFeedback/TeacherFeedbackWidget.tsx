import {
    AssessmentForStudent,
    useRestAPI,
} from "@/api/restapi";
import noFeedBack from "@/assets/img/noFeedback.png";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { mapAssessmentScheduleServerToClientType } from "@/utils/assessments";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import {
    Box,
    CircularProgress,
    Theme,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import React,
{
    useEffect,
    useState,
} from "react";
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import {
    FormattedDate,
    FormattedMessage,
    useIntl,
} from "react-intl";

export interface StyleProps {
    totalCount: number;
}

const useStyles = makeStyles<Theme, StyleProps>(((theme: Theme) => createStyles({
    widgetContent: {
        height: `100%`,
        display: `flex`,
        flexDirection: `column`,
        overflowY: `auto`,
        justifyContent: ({ totalCount }) => totalCount === 0 ? `center` : `initial`,
    },
    feedbackOuterWrapper: {
        display: `flex`,
        flexDirection: `row`,
        flexGrow: 1,
        padding: theme.spacing(1.5),
    },
    feedbackInnerWrapper: {
        display: `flex`,
        flexDirection: `column`,
        flexGrow: 1,
    },
    feedbackHeader: {
        display: `flex`,
        flexDirection: `row`,
        alignItems: `center`,
        justifyContent: `space-between`,
    },
    noFeedBackPage: {
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        justifyContent: `center`,
    },
    noFeedBack: {
        alignSelf: `center`,
        fontSize: 16,
        fontWeight: 600,
        marginTop: theme.spacing(1.5),
        color: theme.palette.info.main,
    },
    noFeedBackIcon: {
        width: 80,
    },
    iconWrapper: {
        [theme.breakpoints.down(`sm`)]: {
            display: `none`,
        },
    },
    name: {
        fontSize: 14,
    },
    date: {
        fontSize: 12,
        color: theme.palette.grey[600],
    },
    feedback: {
        backgroundColor: `#FFBC00`,
        borderRadius: `10px 20px 20px 20px`,
        opacity: `0.8`,
        fontSize: 14,
        padding: theme.spacing(2),
    },
    icon: {
        height: 60,
        width: 60,
        borderRadius: `50%`,
        display: `flex`,
    },
    avatar: {
        height: 50,
        width: 50,
    },
})));

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
    date: Date;
    files: FileItem[];
}

const ROWS_PER_PAGE = 3;

export const mapAssessmentForStudentToTeacherFeedbackRow = (item: AssessmentForStudent): TeacherFeedbackRow => {
    const lastTeacherComment = item.teacher_comments.slice(-1)[0];
    const classTitle = item.title.split(`-`)[0];
    const date = new Date(item.complete_at * 1000);
    return {
        id: item.id,
        feedback: lastTeacherComment?.comment ?? ``,
        files: item.student_attachments ?? [],
        score: item.score,
        teacherName: lastTeacherComment ? `${lastTeacherComment.teacher.given_name}`.trim() : ``,
        teacherAvatar: lastTeacherComment?.teacher.avatar ?? undefined,
        title: classTitle,
        date: date,
        type: mapAssessmentScheduleServerToClientType(item.schedule.type),
    };
};

export default function TreacherFeedbackWidget () {
    const intl = useIntl();
    const restApi = useRestAPI();
    const currentOrganization = useCurrentOrganization();
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(false);
    const [ page, setPage ] = useState(1);
    const [ subgroupBy, setSubgroupBy ] = useState(`home_fun_study`);
    const [ rows, setRows ] = useState<TeacherFeedbackRow[]>([]);
    const [ totalCount, setTotalCount ] = useState(0);
    const classes = useStyles({
        totalCount,
    });

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // enable the date and time after the Bug is fixed in the API
    // const formatDate = (date: Date) => {
    //     const day = date.getDate();
    //     const feedbackDay = day === new Date().getDate() - 1 ?
    //         <FormattedMessage id="date.yesterday" />
    //         : day === new Date().getDate() ?
    //             <FormattedMessage id="date.today" />
    //             :
    //             <FormattedDate
    //                 value={date}
    //                 day="2-digit"
    //                 month="short"
    //             />;

    //     return (<>
    //         {<FormattedDate
    //             hour12
    //             value={date}
    //             hour="numeric"
    //             minute="2-digit"
    //         />}, {feedbackDay}
    //     </>);
    // };

    const fetchStatusGroups = async () => {
        if (rows.length === totalCount && totalCount !== 0) return;
        setLoading(true);
        try {
            const now = new Date();
            const fourteenDaysAgo = new Date();
            fourteenDaysAgo.setDate(now.getDate() - 14);
            const resp = await restApi.getAssessmentsForStudent({
                org_id: currentOrganization?.id ?? ``,
                page: page,
                page_size: ROWS_PER_PAGE,
                type: subgroupBy,
                order_by: `-complete_at`,
                complete_at_ge: Math.floor(fourteenDaysAgo.getTime() / 1000),
                complete_at_le: Math.floor(now.getTime() / 1000),
            });
            const { list = [], total = 0 } = resp ?? {};
            setTotalCount(total);
            setRows([ ...rows, ...list.map(mapAssessmentForStudentToTeacherFeedbackRow) ]);
            setPage(page + 1);
            setError(false);
        } catch (err) {
            setTotalCount(0);
            setRows([]);
            setError(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStatusGroups();
    }, [ currentOrganization, subgroupBy ]);

    const FEEDBACK_PAGINATION_DELAY = 1000;
    const scrollRef = useBottomScrollListener<HTMLDivElement>(fetchStatusGroups, {
        debounce: FEEDBACK_PAGINATION_DELAY,
    });

    return (
        <WidgetWrapper
            loading={!rows.length && loading}
            error={error}
            noData={false}
            reload={fetchStatusGroups}
            label={
                intl.formatMessage({
                    id: `home.student.teacherFeedbackWidget.containerTitleLabel`,
                })
            }
            /*link={{
                url: ``,
                label: intl.formatMessage({
                    id: `home.student.teacherFeedbackWidget.containerUrlLabel`,
                }),
            }}*/
            id={WidgetType.FEEDBACK}
        >
            <div
                ref={scrollRef}
                className={classes.widgetContent}
            >
                {
                    rows && rows.length !== 0 ? (
                        <>
                            {rows.map((item) => (
                                <div
                                    key={item.id}
                                    className={classes.feedbackOuterWrapper}
                                >
                                    <div className={classes.iconWrapper}>
                                        <div className={classes.icon}>
                                            <UserAvatar
                                                className={classes.avatar}
                                                name={item.teacherName ?? ``}
                                                src={item.teacherAvatar ?? ``}
                                            />
                                        </div>
                                    </div>
                                    <div className={classes.feedbackInnerWrapper}>
                                        <div className={classes.feedbackHeader}>
                                            <Typography className={classes.name}><b>{item.teacherName}</b>, {item.title}</Typography>
                                            {/* <Typography className={classes.date}>{formatDate(item.date)}</Typography> */}
                                        </div>
                                        <Typography className={classes.feedback}>{item.feedback}</Typography>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <CircularProgress />
                                </Box>
                            )}
                        </>
                    ) : (
                        <Box
                            className={classes.noFeedBackPage}
                        >
                            <img
                                src={noFeedBack}
                                className={classes.noFeedBackIcon}
                                alt="no feedback"
                            />
                            <Typography
                                gutterBottom
                                variant="body2"
                                className={classes.noFeedBack}
                            >
                                <FormattedMessage
                                    id={`home.student.teacherFeedbackWidget.noFeedBack`}
                                />
                            </Typography>
                        </Box>
                    )
                }
            </div>
        </WidgetWrapper>
    );
}
