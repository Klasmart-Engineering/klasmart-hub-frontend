import AssessmentTable from "../Assessment/Table";
import AssessmentPieChart from "@/components/Assessment/PieChart";
import { usePermission } from "@/utils/checkAllowed";
import { history } from "@/utils/history";
import {
    Box,
    Typography,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import {
    DonutLarge as DonutLargeIcon,
    List as ListIcon,
}  from "@material-ui/icons";
import {
    Button,
    IconButton,
} from "kidsloop-px";
import React,
{ useState } from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    warningIcon: {
        color: theme.palette.warning.main,
        marginRight: theme.spacing(1),
    },
    cardHead: {
        padding: theme.spacing(1/4, 4),
        [theme.breakpoints.down(`sm`)]: {
            padding: theme.spacing(1, 2),
        },
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },
    cardTitle: {
        textTransform: `uppercase`,
        fontWeight: `bold`,
    },
    cardBody: {
        minHeight: theme.spacing(8),
    },
    listChartToggleButton: {
        marginLeft: theme.spacing(1),
    },
}));

export default function Assessments () {
    const classes = useStyles();
    const intl = useIntl();

    const [ showChart, setChart ] = useState(true);
    const permissionAccessAssessments = usePermission(`assessments_400`);

    const handleToggleChart = () => {
        setChart((status) => !status);
    };

    return (
        <>
            <Box
                className={classes.cardHead}
                display="flex"
                flexDirection="row"
                alignItems="center"
            >
                <Typography className={classes.cardTitle}>
                    <FormattedMessage id="assessment_assessmentsTitle" />
                </Typography>
                {showChart
                    ? <IconButton
                        className={classes.listChartToggleButton}
                        tooltip={intl.formatMessage({
                            id: `assessment_viewAsList`,
                        })}
                        icon={ListIcon}
                        onClick={handleToggleChart}
                    />
                    : <IconButton
                        className={classes.listChartToggleButton}
                        tooltip={intl.formatMessage({
                            id: `assessment_viewAsChart`,
                        })}
                        icon={DonutLargeIcon}
                        onClick={handleToggleChart}
                    />
                }
                <Box flex="1" />
                {permissionAccessAssessments && (
                    <Button
                        label={intl.formatMessage({
                            id: `assessment_viewAssessmentsLabel`,
                        })}
                        color="primary"
                        onClick={() => history.push(`/assessments`)}
                    />
                )}
            </Box>
            <Box
                className={classes.cardBody}
                display="flex"
                flexDirection="column"
                flex="1"
                justifyContent={showChart && `center`}
            >
                {showChart
                    ? <AssessmentPieChart/>
                    : <AssessmentTable />
                }
            </Box>
        </>
    );
}
