import {
    useGetMyUser,
    UserNode,
} from "@/api/users";
import Assessment from "@/components/HomeCard/Assessments";
import NextClass from "@/components/HomeCard/nextClass";
import PlanSelection from "@/components/HomeCard/planSelection";
import ScheduleInfoShort from "@/components/HomeCard/scheduleInfo";
import TeacherFeedback from "@/components/HomeCard/TeacherFeedback/Table";
import WelcomeMessage from "@/components/HomeCard/welcomeMessage";
import YourClasses from "@/components/HomeCard/yourClasses";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { SchedulePayload } from "@/types/objectTypes";
import { usePermission } from "@/utils/permissions";
import { usePostSchedulesTimeViewList } from "@kidsloop/cms-api-client";
import {
    Box,
    Container,
    Grid,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import { Card } from "kidsloop-px";
import { clamp } from "lodash";
import React, {
    useEffect,
    useState,
} from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({
    backdrop: {
        zIndex: theme.zIndex.drawer - 1,
        color: theme.palette.common.white,
    },
    gridRightColumn: {
        display: `flex`,
    },
    root: {
        height: `100%`,
        paddingBottom: theme.spacing(2),
        paddingTop: theme.spacing(2),
    },
    assessmentCard: {
        display: `flex`,
        flexDirection: `column`,
    },
}));

const now = new Date();
const todayTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
const twoWeeksFromTodayTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, 23, 59).getTime() / 1000;
const timeZoneOffset = now.getTimezoneOffset() * 60 * -1; // to make seconds

export default function HomePage () {
    const classes = useStyles();
    const theme = useTheme();
    const [ schedule, setSchedule ] = useState<SchedulePayload[]>([]);
    const [ page, setPage ] = useState(1);
    const [ userInfo, setUserInfo ] = useState<UserNode>();
    const currentOrganization = useCurrentOrganization();
    const permissionAttendLiveAsTeacher = usePermission(`attend_live_class_as_a_teacher_186`);
    const canViewTeacherFeedback = usePermission(`view_teacher_feedback_670`);
    const canViewClasses = usePermission(`view_my_classes_20118`);
    const { data: userData } = useGetMyUser();

    const SCHEDULE_PAGE_SIZE = 20;
    const SCHEDULE_PAGE_START = 1;

    useEffect(() => {
        if (!userData) return;
        const user = userData?.myUser.node;
        setUserInfo(user);
    }, [ userData ]);

    const organizationId = currentOrganization?.organization_id ?? ``;
    const {
        data: schedulesData,
        isFetching: isSchedulesFetching,
    } = usePostSchedulesTimeViewList({
        org_id: organizationId,
        view_type: `full_view`,
        page,
        page_size: SCHEDULE_PAGE_SIZE,
        time_at: 0, // any time is ok together with view_type=`full_view`,
        start_at_ge: todayTimestamp,
        end_at_le: twoWeeksFromTodayTimestamp,
        time_zone_offset: timeZoneOffset,
        order_by: `start_at`,
        time_boundary: `union`,
    }, {
        queryOptions: {
            enabled: !!organizationId,
        },
    });

    const fetchMoreSchedulesOnScroll = () => {
        if (!schedulesData?.data.length || isSchedulesFetching) return;
        const lastPage = Math.floor((schedulesData?.total ?? 0) / SCHEDULE_PAGE_SIZE + 1);
        const newPage = clamp(page + 1, SCHEDULE_PAGE_START, lastPage);
        if (newPage === page) return;
        setPage(newPage);
    };

    useEffect(() => {
        if (!currentOrganization || !schedulesData?.data.length) return;
        schedulesData.data.sort((a, b) => {
            const startDiff = a.start_at - b.start_at;
            if (startDiff === 0) return a.title.localeCompare(b.title);
            return startDiff;
        });
        setSchedule([ ...schedule, ...schedulesData.data ]);
    }, [ currentOrganization, schedulesData ]);

    return (
        <Container
            maxWidth="xl"
            className={classes.root}
        >
            <WelcomeMessage user={userInfo} />
            <Box mb={4}>
                <NextClass schedule={schedule} />
            </Box>
            <Grid
                container
                spacing={4}
            >
                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <Card>
                        <ScheduleInfoShort
                            schedule={schedule}
                            scrollCallback={fetchMoreSchedulesOnScroll}
                            loading={isSchedulesFetching}
                        />
                    </Card>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={6}
                    className={classes.gridRightColumn}
                >
                    <Grid
                        container
                        direction="column"
                    >
                        {canViewTeacherFeedback && (
                            <Grid
                                item
                                xs
                                style={{
                                    marginBottom: theme.spacing(4),
                                }}>
                                <Card className={classes.assessmentCard}>
                                    <TeacherFeedback />
                                </Card>
                            </Grid>
                        )}
                        {permissionAttendLiveAsTeacher && (
                            <Grid
                                item
                                style={{
                                    marginBottom: theme.spacing(4),
                                }}>
                                <Card>
                                    <PlanSelection />
                                </Card>
                            </Grid>
                        )}
                        <Grid
                            item
                            xs
                            style={{
                                marginBottom: theme.spacing(4),
                            }}>
                            <Card className={classes.assessmentCard}>
                                <Assessment />
                            </Card>
                        </Grid>
                        {/* <Grid item>
                            <Card>
                                <UsageInfo schedule={schedule} />
                            </Card>
                        </Grid> */}
                    </Grid>
                </Grid>
            </Grid>
            {canViewClasses &&
                <Box mt={4}>
                    <YourClasses />
                </Box>
            }
            {/* TODO : Find a way to display : "As a student, show my Teachers."" (priority low)
            <Box mt={4}>
                <YourTeachers />
            </Box>*/}
        </Container>
    );
}
