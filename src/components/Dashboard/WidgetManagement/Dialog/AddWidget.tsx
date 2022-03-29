import { WidgetType } from "../../models/widget.model";
import getLayouts, {
    Layouts,
    Widgets,
    WidgetView,
} from "../defaultWidgets";
import WidgetPreview from "./WidgetPreview";
import WidgetTreeList from "./WidgetTreeList";
import StudentAcheivements from "@/assets/img/widgets/thumbnails/student_acheivements.png";
import StudentAdaptiveLearning from "@/assets/img/widgets/thumbnails/student_adaptive_learning.png";
import StudentAttendance from "@/assets/img/widgets/thumbnails/student_attendance.png";
import StudentCompletion from "@/assets/img/widgets/thumbnails/student_completion.png";
import StudentLearningOutcome from "@/assets/img/widgets/thumbnails/student_learning_outcome.png";
import StudentSchedule from "@/assets/img/widgets/thumbnails/student_schedule.png";
import StudentTeachersFeedback from "@/assets/img/widgets/thumbnails/student_teachers_feedback.png";
import TeacherAttendance from "@/assets/img/widgets/thumbnails/teacher_attendance.png";
import TeacherContentStatus from "@/assets/img/widgets/thumbnails/teacher_contentstatus.png";
import TeacherLoad from "@/assets/img/widgets/thumbnails/teacher_load.png";
import TeacherNextClass from "@/assets/img/widgets/thumbnails/teacher_nextclass.png";
import TeacherPendingAssesments from "@/assets/img/widgets/thumbnails/teacher_pendingassesments.png";
import TeacherSchedule from "@/assets/img/widgets/thumbnails/teacher_schedule.png";
import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Dialog,
    Divider,
    IconButton,
    Theme,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
    useTheme,
} from "@mui/styles";
import { Button } from "@kl-engineering/kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        '& .MuiDialog-paper': {
            display: `flex`,
            flexDirection: `row`,
            maxHeight: `95vh`,
            maxWidth: `120vh`,
            background: theme.palette.common.white,
        },
    },
    sideBar: {
        background: theme.palette.grey[200],
        padding: theme.spacing(3),
    },
    main: {
        display: `flex`,
        flex: 3,
        flexDirection: `column`,
    },
    mainheader: {
        fontWeight: 500,
        fontSize: `1.2rem`,
    },
    actions: {
        padding: theme.spacing(2),
    },
    header: {
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(3),
    },
    sidebarheader: {
        fontWeight: 500,
        fontSize: `1.2rem`,
        fontStyle: `normal`,
        paddingBottom: theme.spacing(2),
    },
}));

interface Props {
    open: boolean;
    onClose: () => void;
    view: WidgetView;
    widgets: Widgets;
    addWidget: (widgetType: WidgetType, widgets: Widgets, layout: Layouts) => void;
}

export default function AddWidgetDialog (props: Props) {
    const intl = useIntl();
    const {
        open,
        view,
        widgets,
        onClose,
        addWidget,
    } = props;
    const theme = useTheme();

    const TeachersWidgets =
        [
            {
                id: WidgetType.SCHEDULE,
                name: intl.formatMessage({
                    id: `home.schedule.containerTitleLabel`,
                }),
                description: intl.formatMessage({
                    id: `home.customization.addwidget.schedule.description`,
                    defaultMessage: `View your daily schedule, see upcoming events such as Classes and Live Class`,
                }),
                snapshotUrl: TeacherSchedule,
            },
            {
                id: WidgetType.NEXTCLASS,
                name: intl.formatMessage({
                    id: `home.nextClass.containerTitleLabel`,
                }),
                description: intl.formatMessage({
                    id: `home.customization.addwidget.nextclass.description`,
                    defaultMessage: `Highlights your next upcoming Classes, making it easier to join your next Class.`,
                }),
                snapshotUrl: TeacherNextClass,
            },
            {
                id: WidgetType.ATTENDANCERATE,
                name: intl.formatMessage({
                    id: `home.attendance.containerTitleLabel`,
                }),
                description: intl.formatMessage({
                    id: `home.customization.addwidget.attendance.description`,
                    defaultMessage: `Identifies groups of students with different attendance rates, whilst providing an insight into those students who have low attendance and may require additional help.`,
                }),
                snapshotUrl: TeacherAttendance,
            },
            {
                id: WidgetType.PENDINGASSESSMENTS,
                name: intl.formatMessage({
                    id: `home.pendingAssessments.containerTitleLabel`,
                }),
                description: intl.formatMessage({
                    id: `home.customization.addwidget.pendingassessments.description`,
                    defaultMessage: `Highlights the number of assessments a teacher would have outstanding, so that they can keep track of those outstanding assessments which require completion.`,
                }),
                snapshotUrl: TeacherPendingAssesments,

            },
            {
                id: WidgetType.TEACHERLOAD,
                name: intl.formatMessage({
                    id: `home.teacherLoad.containerTitleLabel`,
                }),
                description: intl.formatMessage({
                    id: `home.customization.addwidget.teacherload.description`,
                    defaultMessage: `Showcases the teacher load for the previous week versus their load in the upcoming week.`,
                }),
                snapshotUrl: TeacherLoad,
            },
            {
                id: WidgetType.CONTENTSTATUS,
                name: intl.formatMessage({
                    id: `home.contentStatus.containerTitleLabel`,
                }),

                description: intl.formatMessage({
                    id: `home.customization.addwidget.contentstatus.description`,
                    defaultMessage: `Identifies available content for teachers, the widget also highlights content which is still pending and not approved.`,
                }),
                snapshotUrl: TeacherContentStatus,
            },
        ];

    const StudentsWidgets =
        [
            {
                id: WidgetType.STUDENTATTENDANCE,
                name: intl.formatMessage({
                    id: `home.attendance.containerTitleLabel`,
                }),
                description: intl.formatMessage({
                    id: `home.customization.addwidget.student.attendance.description`,
                    defaultMessage: `Displays your average attendance for the last week, broken down by day.`,
                }),
                snapshotUrl: StudentAttendance,
            },
            {
                id: WidgetType.ACHIEVEMENT,
                name: intl.formatMessage({
                    id: `home.student.achievementWidget.containerTitleLabel`,
                }),
                description: intl.formatMessage({
                    id: `home.customization.addwidget.student.achievement.description`,
                    defaultMessage: `Shows you at high level how many learning outcomes you have achieved, and an overview of how many learning outcomes you have not achieved and how many learning outcomes were planed but not taught yet.`,
                }),
                snapshotUrl: StudentAcheivements,
            },
            {
                id: WidgetType.COMPLETION,
                name: intl.formatMessage({
                    id: `home.student.completionWidget.containerTitleLabel`,
                }),
                description: intl.formatMessage({
                    id: `home.customization.addwidget.student.completion.description`,
                    defaultMessage: `Shows you how many assignments you have in total, and an overview of how many assignments which still need to be completed.`,
                }),
                snapshotUrl: StudentCompletion,
            },
            {
                id: WidgetType.FEEDBACK,
                name: intl.formatMessage({
                    id: `home.student.teacherFeedbackWidget.containerTitleLabel`,
                }),
                description: intl.formatMessage({
                    id: `home.customization.addwidget.student.feedback.description`,
                    defaultMessage: `Providing you an area where you can view and read feedback sent to you from your teachers.`,
                }),
                snapshotUrl: StudentTeachersFeedback,
            },
            {
                id: WidgetType.STUDENTSCHEDULE,
                name: intl.formatMessage({
                    id: `home.schedule.containerTitleLabel`,
                }),
                description: intl.formatMessage({
                    id: `home.customization.addwidget.student.schedule.description`,
                    defaultMessage: `View your daily and weekly schedule to see upcoming events in your calendar, such as your Classes and Live Classes.`,
                }),
                snapshotUrl: StudentSchedule,
            },
            // {
            //     id:WidgetType.LEARNINGOUTCOME,
            //     name:intl.formatMessage({
            //         id: `home.student.learningOutcomeWidget.containerTitleLabel`,
            //     }),
            //     description:intl.formatMessage({
            //         id: `home.customization.addwidget.student.learningoutcome.description`,
            //         defaultMessage:`An overview of your achieved Learning Outcomes to those that still need to be achieved for each skill, highlighting your Top 5 skills.`,
            //     }),
            //     snapshotUrl:StudentLearningOutcome,
            // },
            // {
            //     id:WidgetType.ADAPTIVELEARNING,
            //     name: intl.formatMessage({
            //         id: `home.student.adaptiveLearningWidget.containerTitleLabel`,
            //     }),
            //     description:intl.formatMessage({
            //         id: `home.customization.addwidget.student.adaptivelearning.description`,
            //         defaultMessage:`Shows you the impact of the AI review classes taken by summarising the total number of AI review classes and counts of all the skills targeted in these review classes as well as describing the impact of AI review in detail for the top 3 most improved skills.`,
            //     }),
            //     snapshotUrl:StudentAdaptiveLearning,
            // },
        ];

    const handelAddWidget = (id: WidgetType, widgets: Widgets) => {
        const layouts = getLayouts(view).layouts;
        addWidget(id, widgets, layouts);
        onClose();
    };

    const getDefaultWidgetToDisplay = () => {
        const widgetsToDisplay = view === WidgetView.STUDENT ? StudentsWidgets : TeachersWidgets;
        const defaultWidget = widgetsToDisplay.find(widget => {
            return !(widgets && widgets[widget.id]);
        });
        return defaultWidget || widgetsToDisplay[0];
    };

    const classes = useStyles();
    const [ selectedWidget, setSelectedWidget ] = useState(getDefaultWidgetToDisplay());

    useEffect(() => {
        const defaultStudentOrTeacherWidget = getDefaultWidgetToDisplay();
        setSelectedWidget(defaultStudentOrTeacherWidget);
        if (!open) return;
    }, [ open ]);

    const updateWidget = (widget: any) => {
        setSelectedWidget(widget);
    };

    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth="md"
            className={classes.root}
            onClose={onClose}
        >
            <Box className={classes.sideBar}>
                <Box>
                    <Typography
                        className={classes.sidebarheader}>
                        {intl.formatMessage({
                            id: `home.customization.addwidgetdialog.title`,
                            defaultMessage: `Widgets`,
                        })}
                    </Typography></Box>
                <WidgetTreeList
                    widgets={view === WidgetView.STUDENT ? StudentsWidgets : TeachersWidgets}
                    updateWidget={updateWidget}
                    availableWidgets={widgets}
                    defaultSelectedId={selectedWidget.id} />
            </Box>
            <Box className={classes.main}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    className={classes.header}>
                    <Typography className={classes.mainheader}
                    >
                        {selectedWidget?.name || ``}
                    </Typography>
                    <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={onClose}>
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                </Box>
                <Divider />
                <WidgetPreview
                    selectedWidget={selectedWidget}
                />
                <Divider />
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    className={classes.actions}
                >
                    <Button
                        label={intl.formatMessage({
                            id: `home.customization.addwidgetdialog.cancel`,
                            defaultMessage: `Cancel`,
                        })}
                        variant="text"
                        size="medium"
                        color={theme.palette.info.dark}
                        onClick={onClose}></Button>
                    <Button
                        disabled={widgets ? (widgets[selectedWidget.id] ? true : false) : false}
                        label={intl.formatMessage({
                            id: `home.customization.addwidgetdialog.addwidget`,
                            defaultMessage: `Add Widget`,
                        })}
                        variant="text"
                        size="medium"
                        color={theme.palette.info.dark}
                        onClick={() => handelAddWidget(selectedWidget.id, widgets)}></Button>
                </Box>
            </Box>
        </Dialog>
    );
}
