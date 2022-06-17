import AssessmentTable from "../Assessment/Table";
import AssessmentPieChart from "@/components/Assessment/PieChart";
import { usePermission } from "@/utils/permissions";
import {
    Button,
    IconButton,
} from "@kl-engineering/kidsloop-px";
import {
    DonutLarge as DonutLargeIcon,
    List as ListIcon,
} from "@mui/icons-material";
import {
    Box,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { useState } from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

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
                    ? (
                        <IconButton
                            className={classes.listChartToggleButton}
                            tooltip={intl.formatMessage({
                                id: `assessment_viewAsList`,
                            })}
                            icon={ListIcon}
                            size="medium"
                            onClick={handleToggleChart}
                        />
                    )
                    : (
                        <IconButton
                            className={classes.listChartToggleButton}
                            tooltip={intl.formatMessage({
                                id: `assessment_viewAsChart`,
                            })}
                            icon={DonutLargeIcon}
                            size="medium"
                            onClick={handleToggleChart}
                        />
                    )
                }
                <Box flex="1" />
                {permissionAccessAssessments && (
                    <Button
                        label={intl.formatMessage({
                            id: `assessment_viewAssessmentsLabel`,
                        })}
                        color="primary"
                        onClick={() => navigate(`/assessments`)}
                    />
                )}
            </Box>
            <Box
                className={classes.cardBody}
                display="flex"
                flexDirection="column"
                flex="1"
                justifyContent={showChart ? `center` : undefined}
            >
                {showChart
                    ? <AssessmentPieChart />
                    : <AssessmentTable />
                }
            </Box>
        </>
    );
}
