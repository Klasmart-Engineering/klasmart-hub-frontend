import { ClassDetails } from "@/components/Class/Table";
import {
    Avatar,
    Box,
    createStyles,
    Divider,
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
import {
    ExpandMore as ExpandMoreIcon,
    Person as PersonIcon,
} from "@material-ui/icons";
import {
    Drawer,
    utils,
} from "kidsloop-px";
import React from "react";

const Accordion = withStyles({
    root: {
        border: `1px solid rgba(0, 0, 0, .125)`,
        boxShadow: `none`,
        "&:not(:last-child)": {
            borderBottom: 0,
        },
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
        minHeight: 56,
        "&$expanded": {
            minHeight: 56,
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

const useStyles = makeStyles((theme) =>
    createStyles({
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
        avatar: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            color: `white`,
            marginRight: 16,
            fontSize: 10,
        },
        subjectHeader: {
            padding: theme.spacing(0, 2),
            textTransform: `uppercase`,
        },
        accordionDetails: {
            padding: 0,
        },
    }));

interface Props {
    open: boolean;
    onClose: () => void;
    classDetails: ClassDetails;
}

export default function ViewClassDialog (props: Props) {
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

    return (
        <Drawer
            open={open}
            title={className}
            sections={[
                {
                    header: `Programs`,
                    content: (
                        <>
                            {programSubjects.map((program, i) => (
                                <Accordion key={`program-${i}`}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography className={classes.heading}>{program.programName}</Typography>
                                    </AccordionSummary>
                                    <Typography
                                        variant="caption"
                                        className={classes.subjectHeader}>
                                        Subjects
                                    </Typography>
                                    <Divider />
                                    <AccordionDetails className={classes.accordionDetails}>
                                        <List>
                                            {program.subjects.map((subject, i) => (
                                                <ListItem key={`subject-${i}`}>
                                                    <ListItemText secondary={subject.name} />
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
                    header: `Class Roster`,
                    content: (
                        <>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography className={classes.heading}>
                                        Teachers ({teachers.length})
                                    </Typography>
                                </AccordionSummary>

                                <AccordionDetails className={classes.accordionDetails}>
                                    <List>
                                        {teachers.map((teacher, i) => (
                                            <ListItem key={`teacher-${i}`}>
                                                <Box
                                                    display="flex"
                                                    flexDirection="row"
                                                    alignItems="center">
                                                    <Avatar
                                                        src={``}
                                                        className={classes.avatar}
                                                        style={{
                                                            backgroundColor: utils.stringToColor(`row.name`),
                                                        }}
                                                    >
                                                        <Typography
                                                            noWrap
                                                            variant="inherit">
                                                            {utils.nameToInitials(`row.name`, 3) || <PersonIcon />}
                                                        </Typography>
                                                    </Avatar>
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
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography className={classes.heading}>
                                        Students ({students.length})
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails className={classes.accordionDetails}>
                                    <List>
                                        {students.map((student, i) => (
                                            <ListItem key={`student-${i}`}>
                                                <Box
                                                    display="flex"
                                                    flexDirection="row"
                                                    alignItems="center">
                                                    <Avatar
                                                        src={``}
                                                        className={classes.avatar}
                                                        style={{
                                                            backgroundColor: utils.stringToColor(`row.name`),
                                                        }}
                                                    >
                                                        <Typography
                                                            noWrap
                                                            variant="inherit">
                                                            {utils.nameToInitials(`row.name`, 3) || <PersonIcon />}
                                                        </Typography>
                                                    </Avatar>
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
