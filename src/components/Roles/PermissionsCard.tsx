import {
    Group,
    PermissionDetail,
    PermissionsCategory,
} from "@/pages/admin/Role/CreateRole";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    Divider,
    FormControlLabel,
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
import { TableSearch } from "kidsloop-px";
import React, {
    Dispatch,
    SetStateAction,
    useEffect,
} from "react";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            width: theme.breakpoints.values.lg,
            borderRadius: 10,
            marginBottom: `20px`,
        },
        formControlLabel: {
            marginRight: `-5px`,
        },
        accordionContainer: {
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

interface Props {
    category: string;
    groups: Group[];
    setPermissionsStepIsValid: Dispatch<SetStateAction<boolean>>;
    rolesAndPermissions: PermissionsCategory[];
}

export default function PermissionsCard(props: Props) {
    const {
        category,
        groups,
        setPermissionsStepIsValid,
        rolesAndPermissions,
    } = props;
    const classes = useStyles();
    const [ cardPermissions, setCardPermissions ] = React.useState<Group[]>(
        groups,
    );

    const handleOpenAccordion = (index: number) => {
        const newPermissions = [ ...cardPermissions ];
        newPermissions[index].open = !newPermissions[index].open;
        setCardPermissions(newPermissions);
    };

    const handlePermissionCheck = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newPermissions = [ ...cardPermissions ];
        const accordionDetails = newPermissions[
            event.target.tabIndex
        ].permissionDetails.map((e: PermissionDetail) => {
            return e.permissionName === event.target.id
                ? {
                    ...e,
                    checked: event.target.checked,
                }
                : e;
        });

        newPermissions[
            event.target.tabIndex
        ].permissionDetails = accordionDetails;

        if (!event.target.checked) {
            newPermissions[event.target.tabIndex].selectAll = false;
        }

        setCardPermissions(newPermissions);
    };

    const handleSelectAllPermissions = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newPermissions = [ ...cardPermissions ];
        const accordionDetails = newPermissions[
            event.target.tabIndex
        ].permissionDetails.map((e: PermissionDetail) => {
            return {
                ...e,
                checked: event.target.checked,
            };
        });

        newPermissions[
            event.target.tabIndex
        ].permissionDetails = accordionDetails;
        newPermissions[event.target.tabIndex].selectAll = event.target.checked;

        setCardPermissions(newPermissions);
    };

    useEffect(() => {
        const newPermissions = [ ...cardPermissions ];
        newPermissions.forEach((e: Group) => {
            if (e.permissionDetails.some((e: PermissionDetail) => e.checked)) {
                e.open = true;
            }
        });

        setCardPermissions(newPermissions);
    }, []);

    useEffect(() => {
        const hasPermissions = rolesAndPermissions.some((role) =>
            role.groups.some((group: Group) =>
                group.permissionDetails.some(
                    (detail: PermissionDetail) => detail.checked,
                ),
            ),
        );

        setPermissionsStepIsValid(hasPermissions);
    }, [ rolesAndPermissions, cardPermissions ]);

    const onChange = () => {
        return ``;
    };

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
                <div className={classes.searchContainer}>
                    <TableSearch
                        value=""
                        onChange={onChange} />
                </div>
                <Divider />
                <div>
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
                                <FormControlLabel
                                    className={classes.formControlLabel}
                                    aria-label="Acknowledge"
                                    control={
                                        <Checkbox
                                            color="primary"
                                            checked={e.selectAll}
                                            tabIndex={index}
                                            onChange={
                                                handleSelectAllPermissions
                                            }
                                        />
                                    }
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
                                        {e.open ? (
                                            <ArrowDropUpIcon />
                                        ) : (
                                            <ArrowDropDown />
                                        )}
                                    </div>
                                    <div
                                        color="textSecondary"
                                        className={classes.category}
                                    >
                                        {e.group}
                                    </div>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails
                                key={`AccordionDetails${e.group}`}
                            >
                                <div className={classes.accordionContainer}>
                                    {e.permissionDetails.map(
                                        (e: PermissionDetail) => (
                                            <React.Fragment
                                                key={`React.Fragment${e.permissionName}${e.permissionDescription}`}
                                            >
                                                <div
                                                    className={
                                                        classes.accountItem
                                                    }
                                                >
                                                    <div>
                                                        <Checkbox
                                                            color="primary"
                                                            checked={e.checked}
                                                            id={
                                                                e.permissionName
                                                            }
                                                            tabIndex={index}
                                                            onChange={
                                                                handlePermissionCheck
                                                            }
                                                        />
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
                                        ),
                                    )}
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
