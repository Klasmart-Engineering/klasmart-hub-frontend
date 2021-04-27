import Assessment from "./card/assessment";
import NextClass from "./card/nextClass";
import { schedulePayload } from "./card/payload";
import PlanSelection from "./card/planSelection";
import ScheduleInfoShort from "./card/scheduleInfoShort";
import UsageInfo from "./card/usageInfo";
import WelcomeMessage from "./card/welcomeMessage";
import YourClasses from "./card/yourClasses";
import YourTeachers from "./card/yourTeachers";
import ContentLayout from "./featuredContent/contentLayout";
import { useRestAPI } from "@/api/restapi";
import { userIdVar } from "@/cache";
import Card  from '@/components/styled/card';
import { GET_USER } from "@/operations/queries/getUser";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { User } from "@/types/graphQL";
import { SchedulePayload } from "@/types/objectTypes";
import { usePermission } from "@/utils/checkAllowed";
import {
    useQuery,
    useReactiveVar,
} from "@apollo/client/react";
import {
    Backdrop,
    Box,
    CircularProgress,
    Container,
    Grid,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import * as React from "react";
import {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const payload = schedulePayload;

const now = new Date();
const todayTimeStamp =
    new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
const nextWeekTimeStamp =
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).getTime() /
    1000;
const nextNextWeekTimeStamp =
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14).getTime() /
    1000;
const timeZoneOffset = now.getTimezoneOffset() * 60 * -1; // to make seconds

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer - 1,
            color: theme.palette.common.white,
        },
        paperContainer: {
            borderRadius: 12,
            border: `1px solid ${theme.palette.grey[300]}`,
            height: `100%`,
            boxShadow:
                theme.palette.type === `dark`
                    ? `0px 2px 4px -1px rgba(255, 255, 255, 0.25), 0px 4px 5px 0px rgba(255, 255, 255, 0.2), 0px 1px 10px 0px rgba(255, 255, 255, 0.16)`
                    : `0px 4px 8px 0px rgba(0, 0, 0, 0.1)`,
        },
        gridRightColumn: {
            display: `flex`,
        },
        root: {
            height: `100%`,
            paddingBottom: theme.spacing(2),
            paddingTop: theme.spacing(2),
        },
    }));

export default function Home () {
    const classes = useStyles();
    const restApi = useRestAPI();
    const theme = useTheme();

    const [ loading, setLoading ] = useState(true);
    const [ time, setTime ] = useState(Date.now());
    const [ schedule, setSchedule ] = useState<SchedulePayload[] | undefined>(undefined);

    const [ userInfo, setUserInfo ] = useState<User>();
    const [ userRoles, setUserRoles ] = useState<any | undefined>(``);

    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;

    const permissionAttendLiveAsTeacher = usePermission(`attend_live_class_as_a_teacher_186`);

    const userId = useReactiveVar(userIdVar);
    const {
        data,
        loading: userDataLoading,
        error,
    } = useQuery(GET_USER, {
        fetchPolicy: `network-only`,
        variables: {
            user_id: userId,
        },
    });

    useEffect(() => {
        if (data) {
            const user: User = data?.user;
            user.memberships?.forEach((membership) => {
                membership.roles?.forEach((role) => {
                    setUserRoles([ ...userRoles, role.role_name ]);
                });
            });
            setUserInfo(user);
        }
    }, [ data ]);

    async function getScheduleListNextTwoWeeks () {
        try {
            const responseNextNextWeek = await restApi.schedule(organizationId, `week`, nextNextWeekTimeStamp, timeZoneOffset);
            const responseCurrentWeek = await restApi.schedule(organizationId, `week`, todayTimeStamp, timeZoneOffset);
            const responseNextWeek = await restApi.schedule(organizationId, `week`, nextWeekTimeStamp, timeZoneOffset);

            const responseSchedule = [
                ...new Set([
                    ...responseNextNextWeek,
                    ...responseCurrentWeek,
                    ...responseNextWeek,
                ]),
            ];
            responseSchedule.sort((a, b) => {
                const startDiff = a.start_at - b.start_at;
                if (startDiff === 0) return a.title.localeCompare(b.title);
                return startDiff;
            });

            setSchedule(responseSchedule);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (window.location.host === `fe.kidsloop.net`) {
            setSchedule(payload);
        }
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (!currentOrganization) return;
        getScheduleListNextTwoWeeks();
    }, [ currentOrganization ]);

    useEffect(() => {
        if ((data && currentOrganization && schedule) || data?.user.memberships.length === 0) setLoading(false);
    }, [
        data,
        currentOrganization,
        schedule,
    ]);

    return (
        <Container
            maxWidth={`xl`}
            className={classes.root}>
            <Backdrop
                className={classes.backdrop}
                open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {userInfo && <WelcomeMessage user={userInfo} />}

            <Box mb={4}>
                <NextClass schedule={schedule} />
            </Box>

            <Grid
                container
                spacing={4} >
                <Grid
                    item
                    xs={12}
                    md={6}>
                    <Card>
                        <ScheduleInfoShort schedule={schedule} />
                    </Card>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={6}
                    className={classes.gridRightColumn}>
                    <Grid
                        container
                        direction="column"
                    >
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
                            <Card>
                                <Assessment />
                            </Card>
                        </Grid>

                        <Grid item>
                            <Card>
                                <UsageInfo schedule={schedule} />
                            </Card>
                        </Grid>
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

            <Box mt={4}>
                <ContentLayout />
            </Box>
        </Container>
    );
}
