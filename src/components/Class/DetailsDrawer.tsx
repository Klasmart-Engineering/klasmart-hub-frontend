import { ClassDetails } from "@/components/Class/Table";
import {
    Box,
    createStyles,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    Typography,
} from "@material-ui/core";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import { withStyles } from "@material-ui/core/styles";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import {
    Drawer,
    UserAvatar,
} from "kidsloop-px";
import React from "react";
import { useIntl } from "react-intl";

const Accordion = withStyles({
    root: {
        boxShadow: `none`,
        "&:before": {
            display: `none`,
        },
        "&$expanded": {
            margin: `auto`,
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        marginBottom: -1,
        minHeight: 48,
        "&$expanded": {
            minHeight: 48,
        },
    },
    content: {
        "&$expanded": {
            margin: `12px 0`,
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiAccordionDetails);

const useStyles = makeStyles((theme) => createStyles({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    avatar: {
        marginRight: theme.spacing(2),
    },
    subjectHeader: {
        fontSize: `0.8em`,
        padding: theme.spacing(0, 2),
        textTransform: `uppercase`,
        color: theme.palette.grey[600],
    },
    accordionDetails: {
        padding: 0,
        color: theme.palette.common.black,
        "& .MuiList-padding": {
            paddingTop: 0,
        },
    },
}));

interface Props {
    open: boolean;
    onClose: () => void;
    classDetails: ClassDetails;
}

export default function ClassDetailsDrawer (props: Props) {
    const {
        open,
        onClose,
        classDetails,
    } = props;

    const {
        className,
        programSubjects,
        students,
        teachers,
    } = classDetails;

    const classes = useStyles();
    const intl = useIntl();

    return (
        <Drawer
            open={open}
            title={className}
            sections={[
                {
                    header: intl.formatMessage({
                        id: `class_programsHeader`,
                    }),
                    content: (
                        <>
                            {programSubjects.map((program, i) => (
                                <Accordion key={`program-${i}`}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel-content"
                                    >
                                        <Typography className={classes.heading}>{program.programName}</Typography>
                                    </AccordionSummary>
                                    <Typography
                                        variant="caption"
                                        className={classes.subjectHeader}
                                        component="div"
                                    >
                                        {intl.formatMessage({
                                            id: `class_tableSubjectsLabel`,
                                        })}
                                    </Typography>
                                    <AccordionDetails className={classes.accordionDetails}>
                                        <List dense>
                                            {program.subjects.map((subject, i) => (
                                                <ListItem key={`subject-${i}`}>
                                                    <ListItemText primary={`- ${subject.name}`} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </>
                    ),
                },
                {
                    header: intl.formatMessage({
                        id: `class_classRosterHeader`,
                    }),
                    content: (
                        <>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel-content"
                                >
                                    <Typography
                                        className={classes.heading}
                                        component="div"
                                    >
                                        {intl.formatMessage({
                                            id: `class_tableTeachers`,
                                        }, {
                                            length: teachers.length,
                                        })}
                                    </Typography>
                                </AccordionSummary>

                                <AccordionDetails className={classes.accordionDetails}>
                                    <List>
                                        {teachers.map((teacher, i) => (
                                            <ListItem key={`teacher-${i}`}>
                                                <Box
                                                    display="flex"
                                                    flexDirection="row"
                                                    alignItems="center"
                                                >
                                                    <UserAvatar
                                                        name={teacher}
                                                        className={classes.avatar}
                                                        size="small"
                                                    />
                                                    <span>{teacher}</span>
                                                </Box>
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel-content"
                                >
                                    <Typography
                                        className={classes.heading}
                                        component="div"
                                    >
                                        {intl.formatMessage({
                                            id: `class_tableStudents`,
                                        }, {
                                            length: students.length,
                                        })}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails className={classes.accordionDetails}>
                                    <List>
                                        {students.map((student, i) => (
                                            <ListItem key={`student-${i}`}>
                                                <Box
                                                    display="flex"
                                                    flexDirection="row"
                                                    alignItems="center"
                                                >
                                                    <UserAvatar
                                                        name={student}
                                                        className={classes.avatar}
                                                        size="small"
                                                    />
                                                    <span>{student}</span>
                                                </Box>
                                            </ListItem>
                                        ))}

                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        </>
                    ),
                },
            ]}
            onClose={() => onClose()}
        />
    );
}
