import { useRestAPI } from "@/api/restapi";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { AssessmentItem } from "@/types/objectTypes";
import { usePermission } from "@/utils/checkAllowed";
import { history } from "@/utils/history";
import {
    Button,
    Grid,
    IconButton,
    Tooltip,
    Typography,
    useTheme,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ListIcon from "@material-ui/icons/List";
import Alert from "@material-ui/lab/Alert";
import React,
{
    useEffect,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { PieChart } from "react-minimal-pie-chart";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cardHead: {
            padding: theme.spacing(1, 4),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(1, 2),
            },
            borderBottom: `1px solid #e0e0e0`,
        },
        cardTitle: {
            textTransform: `uppercase`,
            fontWeight: `bold`,
        },
        cardBody: {
            padding: theme.spacing(2, 4),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(2, 2),
            },
        },
        cardButton: {
            background: `transparent`,
            color: theme.palette.primary.main,
            boxShadow: `none`,
            "&:hover, &:active": {
                backgroundColor: theme.palette.grey[100],
                boxShadow: `none`,
            },
        },
        button: {
            backgroundColor: `#fff`,
            color: `black`,
            "&:hover": {
                color: `white`,
            },
        },
        infoContainer: {
            borderRadius: 12,
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(2, 2),
            },
        },
    }));

export default function Assessments () {
    const classes = useStyles();
    const restApi = useRestAPI();
    const theme = useTheme();
    const intl = useIntl();

    const [ assessments, setAssessments ] = useState<
        AssessmentItem[] | undefined
    >(undefined);
    const [ inProgress, setInProgress ] = useState<AssessmentItem[] | undefined>(undefined);
    const [ total, setTotal ] = useState(0);
    const [ chart, setChart ] = useState(true);

    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;

    const permissionAccessAssessments = usePermission(`assessments_400`);

    async function getAssessmentsList () {
        try {
            const response = await restApi.assessments(organizationId, 1, 1000);
            setAssessments(response);
            setInProgress(response.filter((assessment) => assessment.status === `in_progress`));
            setTotal(response.length);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (!currentOrganization) return;
        setAssessments(undefined);
        setInProgress(undefined);
        setTotal(0);
        getAssessmentsList();
    }, [ currentOrganization ]);

    return (
        <Grid container>
            <Grid
                container
                justify="space-between"
                alignItems="center"
                className={classes.cardHead}
            >
                <Grid item>
                    <Typography className={classes.cardTitle}>
                        <FormattedMessage id="assessment_assessmentsTitle" />
                        <Tooltip
                            title={
                                chart
                                    ? intl.formatMessage({
                                        id: `assessment_viewAsList`,
                                    })
                                    : intl.formatMessage({
                                        id: `assessment_viewAsChart`,
                                    })
                            }
                            placement="right"
                        >
                            <IconButton
                                aria-label="switch view"
                                style={{
                                    padding: 8,
                                    marginLeft: 10,
                                }}
                                onClick={() => setChart(!chart)}
                            >
                                {chart ? (
                                    <ListIcon fontSize="small" />
                                ) : (
                                    <DonutLargeIcon fontSize="small" />
                                )}
                            </IconButton>
                        </Tooltip>
                    </Typography>
                </Grid>

                {permissionAccessAssessments && <Grid item>
                    <Button
                        variant="contained"
                        className={classes.cardButton}
                        onClick={(e: React.MouseEvent) => {
                            history.push(`/assessments`);
                            e.preventDefault();
                        }}
                    >
                        <FormattedMessage id="assessment_viewAssessmentsLabel" />
                    </Button>
                </Grid>}

            </Grid>
            <Grid
                container
                className={classes.cardBody}>
                <Grid
                    item
                    xs={12}
                    style={{
                        maxHeight: 300,
                        overflowY: `auto`,
                    }}
                >
                    {inProgress && inProgress.length !== 0 ? (
                        <>
                            <Typography variant="body2">
                                <FormattedMessage
                                    values={{
                                        currentAmount: inProgress.length,
                                        totalAmount: total,
                                    }}
                                    id="assessment_assessmentsRequireAttention"
                                />
                            </Typography>
                        </>
                    ) : (
                        <Typography
                            gutterBottom
                            variant="body2">
                            <FormattedMessage id="assessment_noNewUpdatesLabel" />
                        </Typography>
                    )}
                </Grid>
                <Grid
                    item
                    xs={12}
                    style={{
                        maxHeight: 300,
                        overflowY: `auto`,
                    }}
                >
                    <Grid
                        container
                        direction="column"
                        alignContent="stretch">
                        {assessments &&
                            inProgress &&
                            (chart ? (
                                <Grid
                                    item
                                    style={{
                                        width: `30%`,
                                        margin: `0 auto`,
                                        marginTop: 20,
                                    }}
                                >
                                    <PieChart
                                        rounded
                                        data={[
                                            {
                                                title: intl.formatMessage({
                                                    id: `assessment_chartInProgress`,
                                                }),
                                                value: inProgress.length,
                                                color: theme.palette.primary.light,
                                            },
                                            {
                                                title: intl.formatMessage({
                                                    id: `assessment_chartCompleted`,
                                                }),
                                                value:
                                                    total - inProgress.length,
                                                color: theme.palette.primary.main,
                                            },
                                        ]}
                                        lineWidth={20}
                                        paddingAngle={18}
                                        label={({ dataEntry }) =>
                                            `${dataEntry.value} ${dataEntry.title}`
                                        }
                                        labelStyle={() => ({
                                            fontFamily: `Circular Std, sans-serif`,
                                            fontSize: `0.45em`,
                                            background: `white`,
                                            padding: 5,
                                        })}
                                        labelPosition={75}
                                    />
                                </Grid>
                            ) : (
                                <Grid
                                    item
                                    style={{
                                        maxHeight: 460,
                                        overflowY: `auto`,
                                    }}
                                >
                                    {inProgress.map((item) => (
                                        <Grid
                                            key={item.id}
                                            item
                                            style={{
                                                paddingBottom: 4,
                                            }}
                                        >
                                            <Alert
                                                color="warning"
                                                style={{
                                                    padding: `0 8px`,
                                                }}
                                            >
                                                {item.title}
                                            </Alert>
                                        </Grid>
                                    ))}
                                </Grid>
                            ))}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
