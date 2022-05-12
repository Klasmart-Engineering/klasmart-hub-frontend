import { Performance } from '@/api/sprreportapi';
import Divider from '@mui/material/Divider';
import { Theme } from '@mui/material/styles';
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React from 'react';
import { useIntl } from 'react-intl';

const useStyles = makeStyles((theme: Theme) => createStyles({
    topContainer: {
        display: `flex`,
        justifyContent: `space-evenly`,
        border: `1px solid`,
        borderColor: theme.palette.grey[300],
        borderRadius: theme.spacing(1.2),
        padding: theme.spacing(2),
        margin: theme.spacing(2, 0),
        textAlign: `center`,
    },
    statisticsValue: {
        color: theme.palette.info.main,
        fontWeight: `700`,
        fontSize: `1.3rem`,
        alignItems: `center`,
    },
    perc: {
        fontSize: `1rem`,
    },
}));

interface Props {
    performance: Performance;
}
export default function Statistics (props: Props) {
    const {
        total_students,
        average_performance,
        today_total_classes,
        today_activities,
    } = props.performance;
    const classes = useStyles();
    const intl = useIntl();
    return (
        <div className={classes.topContainer}>
            <div>
                {intl.formatMessage({
                    id: `student.report.statistic.totalStudent`,
                })}
                <div className={classes.statisticsValue}>{total_students}</div>
            </div>
            <Divider
                flexItem
                orientation="vertical"
            />
            <div>
                {intl.formatMessage({
                    id: `student.report.statistic.averagePerfomance`,
                })}
                <div className={classes.statisticsValue}>{average_performance}
                    <span className={classes.perc}>%</span>
                </div>
            </div>
            <Divider
                flexItem
                orientation="vertical"
            />
            <div>
                {intl.formatMessage({
                    id: `student.report.statistic.todaysClass`,
                })}
                <div className={classes.statisticsValue}>{today_total_classes}</div>
            </div>
            <Divider
                flexItem
                orientation="vertical"
            />
            <div>
                {intl.formatMessage({
                    id: `student.report.statistic.todayActivies`,
                })}
                <div className={classes.statisticsValue}>{today_activities}</div>
            </div>
        </div>
    );
}
