import { Group } from "@/pages/admin/Role/CreateAndEditRoleDialog";
import { formatPermissionName } from "@/utils/validations";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    CardHeader,
    Divider,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import { ArrowDropDown } from "@material-ui/icons";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import React, { useEffect } from "react";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            width: `100%`,
            borderRadius: 10,
            marginBottom: `20px`,
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
            width: theme.breakpoints.values.lg,
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
    const [ cardPermissions, setCardPermissions ] = React.useState<Group[]>(groups);

    const handleOpenAccordion = (index: number) => {
        const newPermissions = [ ...cardPermissions ];
        newPermissions[index].open = !newPermissions[index].open;
        setCardPermissions(newPermissions);
    };

    useEffect(() => {
        const newPermissions = [ ...cardPermissions ];
        newPermissions.forEach((group) => {
            if (group.permissionDetails.some((permissionDetail) => permissionDetail.checked)) {
                group.open = true;
            }
        });

        const onlyCheckedPermissions = newPermissions.reduce((acc: Group[], group) => {
            if (group.permissionDetails.some((permissionDetail) => permissionDetail.checked)) {
                acc.push(group);
            }

            return acc;
        }, []);

        setCardPermissions(onlyCheckedPermissions);
    }, []);

    return (
        <Card className={classes.root}>
            <CardHeader title={category} />
            <Divider />
            {cardPermissions.map((groupElement, groupIndex) => (
                <Accordion
                    key={`Accordion${groupElement.group}`}
                    expanded={groupElement.open}>
                    <AccordionSummary
                        key={`AccordionSummary${groupElement.group}`}
                        aria-label="Expand"
                        aria-controls="additional-actions1-content"
                        id="additional-actions1-header"
                        onClick={() => handleOpenAccordion(groupIndex)}
                    >
                        <div className={classes.categoryContainer}>
                            <div className={classes.arrowIcon}>
                                {groupElement.open ? <ArrowDropUpIcon /> : <ArrowDropDown />}
                            </div>
                            <div
                                color="textSecondary"
                                className={classes.categoryItem}>
                                {groupElement.group}
                            </div>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails key={`AccordionDetails${groupElement.group}`}>
                        <div className={classes.accountGrid}>
                            {groupElement.permissionDetails
                                .filter((permissionDetail) => permissionDetail.checked)
                                .map((permissionDetail) => (
                                    <React.Fragment
                                        key={`React.Fragment${permissionDetail.permissionName}${permissionDetail.permissionDescription}`}
                                    >
                                        <div className={classes.accountItem}>
                                            <div>{formatPermissionName(permissionDetail.permissionName)}</div>
                                        </div>
                                        <div className={classes.accountItem}>
                                            {permissionDetail.permissionDescription}
                                        </div>
                                        <div className={classes.accountItem}>
                                            <div className={classes.tagContainer}>
                                                {permissionDetail.levels?.map((level) => (
                                                    <div
                                                        key={level}
                                                        className={classes.tagText}>
                                                        {level}
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
        </Card>
    );
}
