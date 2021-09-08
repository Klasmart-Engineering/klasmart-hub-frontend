import { useGetSubject } from "@/api/subjects";
import { Subject } from "@/types/graphQL";
import { buildEmptyProgram } from "@/utils/programs";
import { buildEmptySubject } from "@/utils/subjects";
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
import clsx from "clsx";
import { Drawer } from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const Accordion = withStyles({
    root: {
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

const AccordionSummary = withStyles((theme) => ({
    root: {
        marginBottom: -1,
        minHeight: 32,
        "&$expanded": {
            minHeight: 32,
        },
    },
    content: {
        margin: theme.spacing(0.5, 0),
        "&$expanded": {
            margin: theme.spacing(0.5, 0),
        },
    },
    expanded: {},
}))(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: 0,
        "& .MuiList-padding": {
            width: `100%`,
            padding: theme.spacing(0),
        },
        "& .MuiListItem-dense": {
            paddingTop: 0,
            paddingBottom: 0,
        },
    },
}))(MuiAccordionDetails);

const useStyles = makeStyles((theme) => createStyles({
    chip: {
        margin: theme.spacing(0.5),
    },
    accordionDetailsIcon: {
        transition: `.3s cubic-bezier(.25,.8,.5,1)`,
        "&.active": {
            transform: `rotate(180deg)`,
        },
    },
    accordionDetailsIconOpen: {
        transform: `rotate(180deg)`,
    },
}));

interface Props {
    subjectId?: string;
    open: boolean;
    onClose: () => void;
}

export default function ViewSubjectDetailsDrawer (props: Props) {
    const {
        subjectId,
        open,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();

    const { data: subjectData } = useGetSubject({
        variables: {
            subject_id: subjectId ?? ``,
        },
        fetchPolicy: `cache-and-network`,
        skip: !open || !subjectId,
    });
    const [ subject, setSubject ] = useState<Subject>(buildEmptySubject());

    useEffect(() => {
        if (!open) {
            setSubject(buildEmptySubject());
            return;
        }
        setSubject(subjectData?.subject ?? buildEmptySubject());
    }, [ open, subjectData ]);

    const [ expandedSubject, setExpandedSubject ] = useState<string | false>(false);

    const handleChangeSubject = (subjectId: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
        setExpandedSubject(newExpanded ? subjectId : false);
    };

    useEffect(() => {
        if (!open) return;
        setExpandedSubject(false);
    }, [ open ]);

    return (
        <Drawer
            open={open}
            title={subject?.name ?? ``}
            sections={[
                {
                    header: intl.formatMessage({
                        id: `subjects_categoriesLabel`,
                    }),
                    content: (
                        <>
                            {subject?.categories?.map((category) => (
                                <Accordion
                                    key={category.id}
                                    square
                                    expanded={expandedSubject === category.id}
                                    onChange={handleChangeSubject(category.id ?? ``)}
                                >
                                    <AccordionSummary>
                                        <Box
                                            display="flex"
                                            flexDirection="row"
                                            flex="1"
                                        >
                                            <Typography variant="subtitle2">
                                                {category.name}
                                            </Typography>
                                            <Box
                                                display="flex"
                                                flex="1"
                                                justifyContent="flex-end"
                                                flexDirection="row"
                                            >
                                                <ExpandMoreIcon
                                                    color="action"
                                                    className={clsx(classes.accordionDetailsIcon, {
                                                        [classes.accordionDetailsIconOpen]: expandedSubject === category.id,
                                                    })}
                                                />
                                            </Box>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <List dense>
                                            {category.subcategories?.map((subcategory) => <ListItem key={subcategory.id}>
                                                <ListItemText primary={subcategory.name} />
                                            </ListItem>)}
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </>
                    ),
                },
            ]}
            onClose={() => onClose()}
        />
    );
}
