import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    Divider,
    FormControlLabel,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { ArrowDropDown } from "@material-ui/icons";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: `1342px`,
            borderRadius: 10,
        },
        formControlLabel: {
            marginRight: `-5px`,
        },
        accordionContainer: {
            width: `1340px`,
            display: `grid`,
            gridTemplateColumns: `minmax(100px, 500px) minmax(100px, 500px) auto`,
            justifyContent: `space-between`,
        },
        accountItem: {
            padding: `5px`,
            alignSelf: `center`,
        },
        tagContainer: {
            display: `flex`,
        },
        tagText: {
            display: `inline-block`,
            padding: `5px`,
            borderRadius: 10,
            fontSize: `15px`,
            fontWeight: 400,
            background: `#f1f1f1`,
            color: `#FF6B00`,
        },
        searchContainer: {
            padding: `3px`,
            display: `flex`,
            alignItems: `center`,
        },
        formControlContainer: {
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,
        },
        arrowIcon: {
            marginTop: `10px`,
        },
        category: {
            marginLeft: `19px`,
        },
    }),
);

export default function PermissionsCard() {
    const classes = useStyles();
    const [ open, setOpen ] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography
                    gutterBottom
                    variant="h5"
                    component="h2">
                    Accounts
                </Typography>
                <Divider />
                <div className={classes.searchContainer}>
                    <div>
                        <IconButton aria-label="delete">
                            <SearchIcon />
                        </IconButton>
                    </div>
                    <Typography component="p">
                        Search for permissions by their name, description, or
                        default role
                    </Typography>
                </div>
                <Divider />
                <div>
                    <Accordion>
                        <AccordionSummary
                            aria-label="Expand"
                            aria-controls="additional-actions1-content"
                            id="additional-actions1-header"
                            onClick={handleClick}
                        >
                            <FormControlLabel
                                className={classes.formControlLabel}
                                aria-label="Acknowledge"
                                control={<Checkbox color="primary" />}
                                label=""
                                onClick={(event) => {
                                    // The click event of the nested action will propagate up and
                                    // expand the accordion unless you explicitly stop it.
                                    event.stopPropagation();
                                }}
                                onFocus={(event) => event.stopPropagation()}
                            />
                            <div className={classes.formControlContainer}>
                                <div className={classes.arrowIcon}>
                                    {open ? (
                                        <ArrowDropUpIcon />
                                    ) : (
                                        <ArrowDropDown />
                                    )}
                                </div>
                                <div
                                    color="textSecondary"
                                    className={classes.category}
                                >
                                    My learners
                                </div>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className={classes.accordionContainer}>
                                <div className={classes.accountItem}>
                                    <div>
                                        <Checkbox color="primary" />
                                        Permission name
                                    </div>
                                </div>
                                <div className={classes.accountItem}>
                                    Gives users access to view my learners page
                                </div>
                                <div className={classes.accountItem}>
                                    <div className={classes.tagContainer}>
                                        <div className={classes.tagText}>
                                            School Admin
                                        </div>
                                    </div>
                                </div>

                                <div className={classes.accountItem}>
                                    <div>
                                        <Checkbox color="primary" />
                                        Permission name that is super long and
                                        specific
                                    </div>
                                </div>
                                <div className={classes.accountItem}>
                                    Gives users access to edit permissions and
                                    other stuffs
                                </div>
                                <div className={classes.accountItem}>
                                    <div className={classes.tagContainer}>
                                        <div className={classes.tagText}>
                                            Teacher
                                        </div>
                                    </div>
                                </div>

                                <div className={classes.accountItem}>
                                    <div>
                                        <Checkbox color="primary" />
                                        Permission for the organization admin
                                    </div>
                                </div>
                                <div className={classes.accountItem}>
                                    Gives users access to edit permissions and
                                    other stuffs
                                </div>
                                <div className={classes.accountItem}>
                                    <div className={classes.tagContainer}>
                                        <div className={classes.tagText}>
                                            Organization Admin
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </CardContent>
        </Card>
    );
}
