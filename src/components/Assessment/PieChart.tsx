import { useRestAPI } from "@/api/restapi";
import PieChart from "@/components/Charts/Pie";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { AssessmentStatus } from "@/types/objectTypes";
import { getStatusLabel } from "@/utils/assessments";
import {
    CircularProgress,
    createStyles,
    lighten,
    makeStyles,
    Theme,
    Typography,
    useTheme,
} from "@material-ui/core";
import { Assessment } from '@material-ui/icons';
import React,
{
    useEffect,
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

    const fetchStatusGroups = async () => {
        setLoading(true);
        try {
            const resp = await restApi.getAssessmentsSummary({
                org_id: currentOrganization?.organization_id ?? ``,
            });
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
    };
    useEffect(() => {
        fetchStatusGroups();
    }, [ currentOrganization ]);

    return (
        <>
            <div className={classes.root}>
                {loading ?
                    <CircularProgress />
                    :
                    statusGroups ?
                        <PieChart data={statusGroups}/>
                        :
                        <div className={classes.noNewUpdates}>
                            <Assessment
                                color="disabled"
                                style={{
                                    fontSize: 100,
                                }}
                            />
                            <Typography>
                                <FormattedMessage id="assessment_noNewUpdatesLabel" />
                            </Typography>
                        </div>
                }
            </div>
        </>
    );
}
