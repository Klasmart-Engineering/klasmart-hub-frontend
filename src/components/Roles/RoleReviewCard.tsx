import {
    Group,
    PermissionDetail,
} from "@/pages/admin/Role/CreateRole";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { ArrowDropDown } from "@material-ui/icons";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import React, { useEffect } from "react";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: `1342px`,
            borderRadius: 10,
            marginBottom: `20px`,
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
            gridTemplateColumns: `minmax(100px, 500px) minmax(100px, 500px) auto`,
            justifyContent: `space-between`,
        },
        accountItem: {
            padding: `5px`,
            alignSelf: `center`,
        },
        tagContainer: {
            display: `flex`,
            flexWrap: `wrap`,
        },
        tagText: {
            display: `inline-block`,
            padding: `5px`,
            borderRadius: 10,
            fontSize: `15px`,
            fontWeight: 400,
            background: `#f1f1f1`,
            color: `#FF6B00`,
            margin: `3px`,
        },
    }),
);

interface Props {
    category: string;
    groups: Group[];
}

export default function RoleReviewCard(props: Props) {
    const classes = useStyles();
    const { category, groups } = props;
    const [ cardPermissions, setCardPermissions ] = React.useState<Group[]>(
        groups,
    );

    const handleOpenAccordion = (index: number) => {
        const newPermissions = [ ...cardPermissions ];
        newPermissions[index].open = !newPermissions[index].open;
        setCardPermissions(newPermissions);
    };

    useEffect(() => {
        const newPermissions = [ ...cardPermissions ];
        newPermissions.forEach((e: Group) => {
            if (e.permissionDetails.some((e: PermissionDetail) => e.checked)) {
                e.open = true;
            }
        });

        const onlyCheckedPermissions = newPermissions.reduce(
            (acc: Group[], e: Group) => {
                if (
                    e.permissionDetails.some((e: PermissionDetail) => e.checked)
                ) {
                    acc.push(e);
                }

                return acc;
            },
            [],
        );

        setCardPermissions(onlyCheckedPermissions);
    }, []);

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography
                    gutterBottom
                    variant="h5"
                    component="h2">
                    {category}
                </Typography>
                <Divider />
                <div className={classes.content}>
                    {cardPermissions.map((e: Group, index) => (
                        <Accordion
                            key={`Accordion${e.group}`}
                            expanded={e.open}
                        >
                            <AccordionSummary
                                key={`AccordionSummary${e.group}`}
                                aria-label="Expand"
                                aria-controls="additional-actions1-content"
                                id="additional-actions1-header"
                                onClick={() => handleOpenAccordion(index)}
                            >
                                <div className={classes.categoryContainer}>
                                    <div className={classes.arrowIcon}>
                                        {e.open ? (
                                            <ArrowDropUpIcon />
                                        ) : (
                                            <ArrowDropDown />
                                        )}
                                    </div>
                                    <div
                                        color="textSecondary"
                                        className={classes.categoryItem}
                                    >
                                        {e.group}
                                    </div>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails
                                key={`AccordionDetails${e.group}`}
                            >
                                <div className={classes.accountGrid}>
                                    {e.permissionDetails
                                        .filter(
                                            (e: PermissionDetail) => e.checked,
                                        )
                                        .map((e: PermissionDetail) => (
                                            <React.Fragment
                                                key={`React.Fragment${e.permissionName}${e.permissionDescription}`}
                                            >
                                                <div
                                                    className={
                                                        classes.accountItem
                                                    }
                                                >
                                                    <div>
                                                        {e.permissionName}
                                                    </div>
                                                </div>
                                                <div
                                                    className={
                                                        classes.accountItem
                                                    }
                                                >
                                                    {e.permissionDescription}
                                                </div>
                                                <div className={classes.accountItem}>
                                                    <div className={classes.tagContainer}>
                                                        {e.levels?.map((e) => (
                                                            <div
                                                                key={e}
                                                                className={
                                                                    classes.tagText
                                                                }
                                                            >
                                                                {e}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ))}
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
