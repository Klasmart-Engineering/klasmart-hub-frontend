import {
    getStatusColor,
    getStatusLabel,
} from "./utils";
import PieChart from "@/components/Charts/Pie";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    AssessmentStatus,
    useGetAssessmentsSummary,
} from "@kl-engineering/cms-api-client";
import { Assessment as AssessmentIcon } from '@mui/icons-material';
import {
    CircularProgress,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
    useTheme,
} from '@mui/styles';
import { sumBy } from "lodash";
import React,
{ useMemo } from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        maxWidth: 250,
        margin: `0 auto`,
    },
    noNewUpdates: {
        display: `flex`,
        alignItems: `center`,
        flexWrap: `wrap`,
        justifyContent: `center`,
        padding: theme.spacing(2, 4),
    },
}));

interface Props {
}

export default function AssessmentPieChart (props: Props) {
    const classes = useStyles();
    const currentOrganization = useCurrentOrganization();
    const intl = useIntl();
    const theme = useTheme();

    const { data: assessmentsSummaryData, isLoading: assessmentsSummaryLoading } = useGetAssessmentsSummary({
        org_id: currentOrganization?.id ?? ``,
    }, {
        queryOptions: {
            enabled: !!currentOrganization?.id,
        },
    });

    const statusGroups = useMemo(() => {
        const statusGroups = Object
            .entries(assessmentsSummaryData ?? {})
            .map(([ status, count ]: [ AssessmentStatus, number ]) => ({
                color: getStatusColor(status, theme),
                title: getStatusLabel(status, intl),
                value: count,
            }));
        return statusGroups;
    }, [ assessmentsSummaryData ]);

    const allStatusCount = useMemo(() => {
        return sumBy(statusGroups, (group) => group.value);
    }, [ statusGroups ]);

    if (assessmentsSummaryLoading) return (
        <div className={classes.root}>
            <CircularProgress />
        </div>
    );

    return (
        <div className={classes.root}>
            {allStatusCount > 0
                ? <PieChart data={statusGroups} />
                : (
                    <div className={classes.noNewUpdates}>
                        <AssessmentIcon
                            color="disabled"
                            style={{
                                fontSize: 96,
                            }}
                        />
                        <Typography
                            color="textSecondary"
                            variant="body2"
                        >
                            <FormattedMessage id="assessment_noNewUpdatesLabel" />
                        </Typography>
                    </div>
                )
            }
        </div>
    );
}
