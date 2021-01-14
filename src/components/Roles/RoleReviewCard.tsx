import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
} from "@material-ui/core";
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
        content: {
            marginTop: `15px`,
        },
        categoryContainer: {
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,
        },
        arrowIcon: {
            marginTop: `10px`,
        },
        categoryItem: {
            marginLeft: `19px`,
        },
        accountGrid: {
            width: `1340px`,
            display: `grid`,
            gridTemplateColumns:
                `minmax(100px, 500px) minmax(100px, 500px) auto`,
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
    }),
);

export default function RoleReviewCard() {
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
                <div className={classes.content}>
                    <Accordion>
                        <AccordionSummary
                            aria-label="Expand"
                            aria-controls="additional-actions1-content"
                            id="additional-actions1-header"
                            onClick={handleClick}
                        >
                            <div className={classes.categoryContainer}>
                                <div className={classes.arrowIcon}>
                                    {open ? (
                                        <ArrowDropUpIcon />
                                    ) : (
                                        <ArrowDropDown />
                                    )}
                                </div>
                                <div
                                    color="textSecondary"
                                    className={classes.categoryItem}
                                >
                                    My learners
                                </div>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className={classes.accountGrid}>
                                <div className={classes.accountItem}>
                                    <div>Permission name</div>
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
