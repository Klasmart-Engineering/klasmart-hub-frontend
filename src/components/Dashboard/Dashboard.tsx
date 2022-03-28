import { useQueryMyUser } from "@/api/myUser";
import Assessment from "@/components/HomeCard/Assessments";
import NextClass from "@/components/HomeCard/nextClass";
import PlanSelection from "@/components/HomeCard/planSelection";
import ScheduleInfoShort from "@/components/HomeCard/scheduleInfo";
import TeacherFeedback from "@/components/HomeCard/TeacherFeedback/Table";
import WelcomeMessage from "@/components/HomeCard/welcomeMessage";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { SchedulePayload } from "@/types/objectTypes";
import { usePermission } from "@/utils/permissions";
import { usePostSchedulesTimeViewList } from "@kl-engineering/cms-api-client";
import {
    Box,
    Container,
    Grid,
    Theme,
    useTheme,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { Card } from "@kl-engineering/kidsloop-px";
import {
    clamp,
    uniqBy,
} from "lodash";
import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({
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

interface Props {
}

export default function Dashboard (props: Props) {
    const classes = useStyles();
    const theme = useTheme();
    const [ schedule, setSchedule ] = useState<SchedulePayload[]>([]);
    const [ page, setPage ] = useState(1);
    const currentOrganization = useCurrentOrganization();
    const canViewTeacherFeedback = usePermission(`view_teacher_feedback_670`);
    const permissionViewMyClassUser = usePermission(`view_my_class_users_40112`, true);
    const { data: myUserData } = useQueryMyUser();

    const SCHEDULE_PAGE_SIZE = 20;
    const SCHEDULE_PAGE_START = 1;

    const userInfo = useMemo(() => myUserData?.myUser.node, [ myUserData ]);

    const organizationId = currentOrganization?.id ?? ``;

    useEffect(() => {
        setPage(1);
        setSchedule([]);
    }, [ organizationId ]);

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
        if (!schedulesData?.data.length) {
            setSchedule([]);
            return;
        }
        schedulesData.data.sort((a, b) => {
            const startDiff = a.start_at - b.start_at;
            if (startDiff === 0) return a.title.localeCompare(b.title);
            return startDiff;
        });
        setSchedule(uniqBy([ ...schedule, ...schedulesData.data ], (schedule) => `${schedule.id}:${schedule.start_at}`));
    }, [ schedulesData ]);

    return (
        <>
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
                            {permissionViewMyClassUser && (
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
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}
