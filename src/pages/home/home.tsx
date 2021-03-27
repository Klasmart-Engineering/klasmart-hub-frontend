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
import {
    ERROR_ORGANIZATION,
    NO_ORGANIZATION,
} from "@/app";
import {
    currentMembershipVar,
    userIdVar,
} from "@/cache";
import { GET_USER } from "@/operations/queries/getUser";
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
    Paper,
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

function Card ({ children }: { children: React.ReactNode }) {
    const classes = useStyles();

    return <Paper className={classes.paperContainer}>{children}</Paper>;
}

export default function Home () {
    const classes = useStyles();
    const restApi = useRestAPI();
    const theme = useTheme();

    const [ loading, setLoading ] = useState(true);
    const [ time, setTime ] = useState(Date.now());
    const [ schedule, setSchedule ] = useState<SchedulePayload[] | undefined>(undefined);

    const [ userInfo, setUserInfo ] = useState<User>();
    const [ userRoles, setUserRoles ] = useState<any | undefined>(``);

    const currentOrganization = useReactiveVar(currentMembershipVar);

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
            const responseNextNextWeek = await restApi.schedule(currentOrganization.organization_id, `week`, nextNextWeekTimeStamp, timeZoneOffset);
            const responseCurrentWeek = await restApi.schedule(currentOrganization.organization_id, `week`, todayTimeStamp, timeZoneOffset);
            const responseNextWeek = await restApi.schedule(currentOrganization.organization_id, `week`, nextWeekTimeStamp, timeZoneOffset);

            setSchedule(responseCurrentWeek.concat(responseNextWeek).concat(responseNextNextWeek));
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
        if (![
            ``,
            NO_ORGANIZATION,
            ERROR_ORGANIZATION,
        ].includes(currentOrganization.organization_id)) getScheduleListNextTwoWeeks();
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
                userRoles?.includes(`Teacher`)) && (
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
