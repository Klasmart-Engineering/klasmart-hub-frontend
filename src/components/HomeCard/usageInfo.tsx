import { SchedulePayload } from "@/types/objectTypes";
import {
    Box,
    Grid,
    Typography,
    useTheme,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import LiveTvIcon from "@material-ui/icons/LiveTv";
import React,
{
    useEffect,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    cardHead: {
        padding: theme.spacing(1, 4),
        [theme.breakpoints.down(`sm`)]: {
            padding: theme.spacing(1, 2),
        },
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
        minHeight: 53,
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
    usageInfoCard: {
        borderRadius: 12,
        backgroundColor: theme.palette.primary.light,
        padding: theme.spacing(3, 4),
        marginTop: theme.spacing(4),
    },
    usageInfoItem: {
        textAlign: `center`,
    },
    usageInfoTitle: {
        fontSize: `1em`,
        fontWeight: `bold`,
        textTransform: `uppercase`,
        marginTop: 0,
        marginBottom: 20,
    },
    usageInfoValue: {
        fontWeight: `bold`,
    },
    usageInfoTotal: {
        color: theme.palette.grey[500],
    },
    infoCard: {
        borderRadius: 12,
        height: `100%`,
        padding: theme.spacing(2),
        [theme.breakpoints.down(`sm`)]: {
            padding: theme.spacing(1),
        },
    },
    completeBar: {
        position: `relative`,
        background: theme.palette.grey[100],
        height: 6,
        borderRadius: 20,
        width: `60%`,
        margin: `0 auto`,
        marginBottom: 10,
    },
    completeBarIndicator: {
        position: `absolute`,
        left: 0,
        top: 0,
        height: 6,
        width: 0,
        borderRadius: 20,
        backgroundColor: theme.palette.primary.main,
        boxShadow: `0 0 0 4px white`,
    },
    completeBarIndicatorIcon: {
        position: `absolute`,
        right: -5,
        top: -11,
        zIndex: 9,
        color: `white`,
        backgroundColor: theme.palette.primary.main,
        boxShadow: `0 0 0 4px white`,
        width: 28,
        height: 28,
        padding: 4,
        transform: `scale(0.7)`,
        borderRadius: 20,
    },
}));

interface UsageInfoData {
    type: string;
    totalType: string;
    icon: SvgIconProps;
    total: number;
    attended: number;
}

export default function UsageInfo ({ schedule }: {
    schedule?: SchedulePayload[];
}) {
    const classes = useStyles();
    const theme = useTheme();
    const classTypes = [
        `OnlineClass`,
        `OfflineClass`,
        `Homework`,
    ];

    const [ usageInfoData, setUsageInfoData ] = useState<UsageInfoData[]>([]);
    const intl = useIntl();

    useEffect(() => {
        const tempUsageInfoData: UsageInfoData[] = [];
        classTypes.forEach((item) => {
            const events = schedule?.filter((event) => event.class_type === item);
            const total = events ? events.length : 0;
            const attended = events
                ? events.filter((event) => event.status === `Closed`).length
                : 0;

            let type = ``;
            let totalType = ``;
            let icon: SvgIconProps = ``;
            switch (item) {
            case `OnlineClass`:
                type = `usageInfo_onlineClasses`;
                totalType = `usageInfo_totalCountLive`;
                icon = <LiveTvIcon fontSize="large" />;
                break;
            case `OfflineClass`:
                type = `usageInfo_offlineClasses`;
                totalType = `usageInfo_totalCountOffline`;
                icon = <AssignmentReturnedIcon fontSize="large" />;
                break;
            case `Homework`:
                type = `usageInfo_homework`;
                totalType = `usageInfo_totalCountHomework`;
                icon = <AssignmentTurnedInIcon fontSize="large" />;
                break;
            default:
                type = `classes`;
                break;
            }
            tempUsageInfoData.push({
                type,
                totalType,
                icon,
                total,
                attended,
            });
        });
        setUsageInfoData(tempUsageInfoData);
    }, [ schedule ]);

    return (
        <>
            <Grid container>
                <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    className={classes.cardHead}
                >
                    <Grid item>
                        <Typography className={classes.cardTitle}>
                            <FormattedMessage id="usageInfo_title" />
                        </Typography>
                    </Grid>

                </Grid>
                <Grid
                    container
                    justify="space-between"
                    className={classes.cardBody}>
                    {usageInfoData.map((item) => (
                        <Grid
                            key={item.type}
                            item
                            xs
                            className={classes.usageInfoItem}>
                            <Box mb={1}>
                                {item.icon}
                                <Typography variant="body2">
                                    <FormattedMessage id={item.type} />
                                </Typography>
                                <Typography
                                    variant="h4"
                                    className={classes.usageInfoValue}>{item.attended}</Typography>
                            </Box>

                            <Box className={classes.completeBar}>
                                <Box
                                    className={classes.completeBarIndicator}
                                    style={{
                                        width: (item.attended / item.total) * 100 + `%`,
                                    }}
                                />
                                {(item.attended / item.total * 100 === 100) && <Box
                                    className={classes.completeBarIndicatorIcon}
                                >
                                    <CheckRoundedIcon fontSize="small" />
                                </Box>}
                            </Box>

                            <Typography
                                variant="caption"
                                className={classes.usageInfoTotal}
                            >
                                <FormattedMessage
                                    id={item.totalType}
                                    values={{
                                        total: item.total,
                                    }} />
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </>
    );
}
