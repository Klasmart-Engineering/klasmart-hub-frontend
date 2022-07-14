import { useGetClassNodeSummary } from "@/api/classes";
import { UserNode } from "@/api/users";
import globalStyles from "@/globalStyles";
import {
    Drawer,
    UserAvatar,
} from "@kl-engineering/kidsloop-px";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import {
    Box,
    Link,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import {
    createStyles,
    makeStyles,
    withStyles,
} from '@mui/styles';
import clsx from "clsx";
import React, {
    useEffect,
    useState,
} from 'react';
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

const useStyles = makeStyles((theme) => {
    const { clickable, primaryText } = globalStyles(theme);
    return createStyles({
        clickable,
        primaryText,
        link: {
            margin: `12px 0`,
            padding: `0 16px`,
            display: `inline-block`,
        },
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
    });
});

interface Props {
    open: boolean;
    onClose: () => void;
    classId?: string;
    setSelectedClassId?: (id: string) => void;
    setClassRosterDialogOpen?: (open: boolean) => void;
}

export default function ClassDetailsDrawer (props: Props) {
    const {
        open,
        onClose,
        classId,
        setSelectedClassId,
        setClassRosterDialogOpen,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const [ students, setStudents ] = useState<UserNode[]>([]);
    const [ teachers, setTeachers ] = useState<UserNode[]>([]);
    const { data, loading } = useGetClassNodeSummary({
        variables: {
            id: classId ?? ``,
            rosterCount: 10,
            programsCount: 50,
            subjectsCount: 50,
        },
        fetchPolicy: `cache-first`,
        skip: !open || !classId,
    });

    useEffect(() => {
        setStudents(data?.classNode?.studentsConnection?.edges.map(edge => edge.node) ?? []);
        setTeachers(data?.classNode?.teachersConnection?.edges.map(edge => edge.node) ?? []);
    }, [ data ]);

    return (
        <Drawer
            open={open && !loading}
            title={data?.classNode?.name ?? ``}
            sections={[
                {
                    header: intl.formatMessage({
                        id: `class_programsHeader`,
                    }),
                    content: (
                        <>
                            {data?.classNode?.programsConnection?.edges.map((edge) => (
                                <Accordion key={edge.node.id}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel-content"
                                    >
                                        <Typography className={classes.heading}>{edge.node.name}</Typography>
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
                                            {edge.node.subjectsConnection?.edges.map((edge) => (
                                                <ListItem key={edge.node.id}>
                                                    <ListItemText primary={`- ${edge.node.name}`} />
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
                                            length: data?.classNode.teachersConnection?.totalCount ?? 0,
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
                                                        name={`${teacher.givenName} ${teacher.familyName}`}
                                                        className={classes.avatar}
                                                        size="small"
                                                    />
                                                    <span>{teacher.givenName} {teacher.familyName}</span>
                                                </Box>
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                                <Link
                                    href={undefined}
                                    className={clsx(classes.clickable, classes.primaryText, classes.link)}
                                    onClick={() => {
                                        setSelectedClassId?.(classId ?? ``);
                                        setClassRosterDialogOpen?.(true);
                                    }}
                                >
                                    <span>{intl.formatMessage({
                                        id: `class_classRosterHeader`,
                                    })}
                                    </span>
                                </Link>
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
                                            length: data?.classNode.studentsConnection?.totalCount ?? 0,
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
                                                        name={`${student.givenName} ${student.familyName}`}
                                                        className={classes.avatar}
                                                        size="small"
                                                    />
                                                    <span>{student.givenName} {student.familyName}</span>
                                                </Box>
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                                <Link
                                    href={undefined}
                                    className={clsx(classes.clickable, classes.primaryText, classes.link)}
                                    onClick={() => {
                                        setSelectedClassId?.(classId ?? ``);
                                        setClassRosterDialogOpen?.(true);
                                    }}
                                >
                                    <span>{intl.formatMessage({
                                        id: `class_classRosterHeader`,
                                    })}
                                    </span>
                                </Link>
                            </Accordion>
                        </>
                    ),
                },
            ]}
            onClose={() => onClose()}
        />
    );
}
