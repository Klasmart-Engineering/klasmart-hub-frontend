import { useRestAPI } from "@/api/restapi";
import PieChart from "@/components/Charts/Pie";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { AssessmentStatus } from "@/types/objectTypes";
import { getStatusLabel } from "@/utils/assessments";
import { Assessment as AssessmentIcon } from '@mui/icons-material';
import {
    CircularProgress,
    lighten,
    Theme,
    Typography,
    useTheme,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { sumBy } from "lodash";
import React,
{
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { DataEntry } from "react-minimal-pie-chart/types/commonTypes";

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

const getStatusColor = (status: AssessmentStatus, theme: Theme) => {
    switch (status) {
    case AssessmentStatus.COMPLETE: return theme.palette.primary.main;
    case AssessmentStatus.IN_PROGRESS: return lighten(theme.palette.primary.main, 0.75);
    }
};

interface Props {
}

export default function AssessmentPieChart (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const theme = useTheme();
    const restApi = useRestAPI();
    const [ loading, setLoading ] = useState(false);
    const currentOrganization = useCurrentOrganization();
    const [ statusGroups, setStatusGroups ] = useState<DataEntry[]>([]);
    const mountedRef = useRef(true);

    const allStatusCount = sumBy(statusGroups, (group) => group.value);

    const fetchStatusGroups = useCallback(async () => {
        setLoading(true);
        try {
            const resp = await restApi.getAssessmentsSummary({
                org_id: currentOrganization?.organization_id ?? ``,
            });

            if (!mountedRef.current) return null;

            const groups: DataEntry[] = Object
                .entries(resp ?? {})
                .map(([ status, count ] : [ AssessmentStatus, number ]) => ({
                    color: getStatusColor(status, theme),
                    title: getStatusLabel(status, intl),
                    value: count,
                }));
            setStatusGroups(groups);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }, [ mountedRef ]);

    useEffect(() => {
        fetchStatusGroups();
        return () => {
            mountedRef.current = false;   // clean up function
        };
    }, [ currentOrganization, fetchStatusGroups ]);

    return (
        <div className={classes.root}>
            {loading
                ? <CircularProgress />
                : (
                    allStatusCount > 0
                        ? <PieChart data={statusGroups}/>
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
                )
            }
        </div>
    );
}
