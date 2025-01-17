import { WidgetType } from "../models/widget.model";
import AdaptiveLearningJourney from "../Widgets/Student/AdaptiveLearningJourney/AdaptiveLearningJourney";
import StudentNextClass from "../Widgets/Student/NextClass/NextClass";
import getLayouts, {
    defaultStudentWidgetMap,
    defaultTeacherWidgetMap,
    Layout,
    Layouts,
    Widgets,
    WidgetView,
} from "./defaultWidgets";
import AddWidgetDialog from "./Dialog/AddWidget";
import LastUpdatedMessage from "./LastUpdatedMessage";
import WidgetContext from "./widgetCustomisation/widgetContext";
import WidgetDashboardWelcomeMessage from "./WidgetDashboardWelcomeMessage";
import PillButton from "@/components/styled/pillButton";
import { useFeatureFlags } from "@/feature-flag/utils";
import {
    AddCard,
    Cancel,
    Edit as EditIcon,
    Replay,
    Save,
} from "@mui/icons-material";
import {
    alpha,
    Box,
    Button,
    Container,
    Theme,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import clsx from "clsx";
import React,
{
    useContext,
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
        transition: `.5s background-color`,
    },
    rootEditing: {
        backgroundColor: alpha(theme.palette.common.white, 0),
    },
    customizeTitle: {
        color: theme.palette.common.white,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer - 1,
        color: theme.palette.common.white,
    },
    flexAndSpacing: {
        display: `flex`,
        '& > *': {
            marginRight: theme.spacing(3),
        },
    },
    whiteButton: {
        color: theme.palette.common.white,
        borderColor: theme.palette.common.white,
    },
    hidden: {
        display: `none`,
    },
    welcomeTitle: {
        marginBottom: theme.spacing(1),
    },
    lastUpdatedText: {
        fontWeight: `bold`,
        color: theme.palette.grey[500],
        "& span": {
            fontWeight: `normal`,
        },
    },
    editButton: {
        [theme.breakpoints.down(`md`)]: {
            display: `none`,
        },
    },
}));

interface Props {
    view: WidgetView;
}

export default function WidgetDashboardWelcomeBanner (props: Props) {
    const { view } = props;
    const intl = useIntl();
    const classes = useStyles();
    const {
        editing,
        editWidgets,
        saveWidgets,
        checkIfLayoutUpdated,
        resetWidgets,
        addWidget,
        widgets,
        layouts,
    } = useContext(WidgetContext);
    const { studentWidgetAdaptiveLearning: showStudentWidgetAdaptiveLearning, studentWidgetAdaptiveLearningJourney: showStudentWidgetAdaptiveLearningJourney } = useFeatureFlags();
    const [ openAddWidgetDialog, setOpenAddWidgetDialog ] = useState(false);
    const [ currentWidgets, setCurrentWidgets ] = useState(widgets);
    const filterAdaptiveWidgets = (widgets: Widgets, layouts: Layouts) => {
        const { [WidgetType.ADAPTIVELEARNING]: _, ...newWidgets } = widgets;
        const removeLayout = (l: Layout) => WidgetType.ADAPTIVELEARNING !== l.i;
        layouts = {
            sm: layouts.sm.filter(removeLayout),
            md: layouts.md.filter(removeLayout),
            lg: layouts.lg.filter(removeLayout),
        };
        return {
            layouts,
            widgets: newWidgets,
        };
    };
    useEffect(() => {
        setCurrentWidgets(widgets);
    }, [ widgets ]);
    const currentWidgetsLength = widgets ? Object.keys(widgets).length : 0;
    const { widgets: currWidgets, layouts: currLayouts } = getLayouts(view);
    const { widgets: defaultWidgets } = showStudentWidgetAdaptiveLearning ? {
        widgets: currWidgets,
    } :
        filterAdaptiveWidgets(currWidgets, currLayouts);
    const totalAvailableWidget = Object.keys(defaultWidgets || {}).length;
    return (
        <Box
            className={clsx(classes.root, {
                [classes.rootEditing]: editing,
            })}
            paddingY={5}
        >
            <Container
                maxWidth="xl"
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {!editing ?
                        <Box>
                            <Typography
                                variant="h4"
                                className={classes.welcomeTitle}
                            >
                                <WidgetDashboardWelcomeMessage />
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                className={classes.lastUpdatedText}
                            >

                                {(() => {
                                    if (view !== WidgetView.STUDENT) return (<LastUpdatedMessage />);
                                    return (<LastUpdatedMessage mockDate />);
                                })()}
                            </Typography>
                        </Box>
                        :
                        <Box className={classes.flexAndSpacing}>

                            <Typography
                                variant="h4"
                                className={classes.customizeTitle}
                            >
                                {intl.formatMessage({
                                    id: `home.customization.title`,
                                    defaultMessage: `Customize`,
                                })}
                            </Typography>

                        </Box>
                    }
                    <Box>
                        {!editing ?
                            <PillButton
                                className={`${classes.whiteButton} ${classes.editButton}`}
                                variant="contained"
                                color="primary"
                                aria-label="customize widgets"
                                startIcon={<EditIcon color="inherit" />}
                                onClick={editWidgets}
                            >
                                {intl.formatMessage({
                                    id: `home.customization.title`,
                                    defaultMessage: `Customize`,
                                })}
                            </PillButton>
                            :
                            <Box className={classes.flexAndSpacing}>
                                <Box paddingRight={3}>
                                    <Button
                                        className={classes.whiteButton}
                                        startIcon={<Replay color="inherit" />}
                                        onClick={() => { resetWidgets(); }}
                                    > {intl.formatMessage({
                                            id: `home.customization.reset`,
                                            defaultMessage: `Reset to default`,
                                        })}
                                    </Button>
                                </Box>
                                <Button
                                    className={currentWidgetsLength < totalAvailableWidget ? classes.whiteButton : classes.hidden}
                                    variant="outlined"
                                    startIcon={<AddCard color="inherit" />}
                                    onClick={() => setOpenAddWidgetDialog(true)}
                                >{intl.formatMessage({
                                        id: `home.customization.addwidget`,
                                        defaultMessage: `Add Widget`,
                                    })}
                                </Button>
                                <Button
                                    className={classes.whiteButton}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Save color="inherit" />}
                                    onClick={() => saveWidgets(widgets, layouts)}
                                >{intl.formatMessage({
                                        id: `home.customization.save`,
                                        defaultMessage: `Save`,
                                    })}
                                </Button>
                                <Button
                                    className={classes.whiteButton}
                                    variant="contained"
                                    color="error"
                                    startIcon={<Cancel color="inherit" />}
                                    onClick={checkIfLayoutUpdated}
                                >{intl.formatMessage({
                                        id: `home.customization.cancel`,
                                        defaultMessage: `Cancel`,
                                    })}
                                </Button>

                            </Box>
                        }
                    </Box>
                </Box>
                {
                    view === WidgetView.STUDENT &&
                    <>
                        <Box paddingY={2}>
                            <StudentNextClass />
                        </Box>
                        <Box paddingY={2}>
                            {showStudentWidgetAdaptiveLearningJourney && <AdaptiveLearningJourney />}
                        </Box>
                    </>
                }
            </Container>
            <AddWidgetDialog
                open={openAddWidgetDialog}
                view={view}
                widgets={currentWidgets}
                addWidget={addWidget}
                onClose={() => {
                    setOpenAddWidgetDialog(false);
                }}
            />
        </Box>
    );
}
