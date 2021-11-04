import { useRestAPI } from "@/api/restapi";
import { useGetUser } from "@/api/users";
import { userIdVar } from "@/cache";
import Assessment from "@/components/HomeCard/Assessments";
import NextClass from "@/components/HomeCard/nextClass";
import PlanSelection from "@/components/HomeCard/planSelection";
import ScheduleInfoShort from "@/components/HomeCard/scheduleInfo";
import TeacherFeedback from "@/components/HomeCard/TeacherFeedback/Table";
import UsageInfo from "@/components/HomeCard/usageInfo";
import WelcomeMessage from "@/components/HomeCard/welcomeMessage";
import YourClasses from "@/components/HomeCard/yourClasses";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { User } from "@/types/graphQL";
import { SchedulePayload } from "@/types/objectTypes";
import { usePermission } from "@/utils/permissions";
import { useReactiveVar } from "@apollo/client/react";
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
    const restApi = useRestAPI();
    const theme = useTheme();

    const [ schedule, setSchedule ] = useState<SchedulePayload[]>([]);
    const [ scheduleLoading, setScheduleLoading ] = useState(true);

    const [ userInfo, setUserInfo ] = useState<User>();
    const [ userRoles, setUserRoles ] = useState<any | undefined>(``);

    const currentOrganization = useCurrentOrganization();

    const permissionAttendLiveAsTeacher = usePermission(`attend_live_class_as_a_teacher_186`);
    const canViewTeacherFeedback = usePermission(`view_teacher_feedback_670`);

    const userId = useReactiveVar(userIdVar);
    const { data: userData } = useGetUser({
        variables: {
            user_id: userId,
        },
        skip: !userId,
    });

    useEffect(() => {
        if (!userData) return;
        const user = userData?.user;
        user.memberships?.forEach((membership) => {
            membership.roles?.forEach((role) => {
                setUserRoles([ ...userRoles, role.role_name ]);
            });
        });
        setUserInfo(user);
    }, [ userData ]);

    async function getScheduleListNextTwoWeeks () {
        setScheduleLoading(true);
        try {
            const organizationId = currentOrganization?.organization_id ?? ``;
            const responseSchedule = await restApi.getSchedulesTimeView({
                org_id: organizationId,
                view_type: `full_view`,
                start_at_ge: todayTimestamp,
                end_at_le: twoWeeksFromTodayTimestamp,
                time_zone_offset: timeZoneOffset,
            });
            responseSchedule.sort((a, b) => {
                const startDiff = a.start_at - b.start_at;
                if (startDiff === 0) return a.title.localeCompare(b.title);
                return startDiff;
            });
            setSchedule(responseSchedule);
        } catch (e) {
            console.error(e);
        }
        setScheduleLoading(false);
    }

    useEffect(() => {
        if (!currentOrganization) return;
        getScheduleListNextTwoWeeks();
    }, [ currentOrganization ]);

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
                        <ScheduleInfoShort schedule={schedule} />
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
            {(userRoles?.includes(`Student`) ||
                userRoles?.includes(`Teacher`) ||
                userRoles?.includes(`Parent`)) && (
                <Box mt={4}>
                    <YourClasses />
                </Box>
            )}
            {/* TODO : Find a way to display : "As a student, show my Teachers."" (priority low)
            <Box mt={4}>
                <YourTeachers />
            </Box>*/}
        </Container>
    );
}
