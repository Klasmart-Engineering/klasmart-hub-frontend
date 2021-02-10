import {
    Group,
    PermissionsCategory,
} from "@/pages/admin/Role/CreateRoleDialog";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    CardHeader,
    Checkbox,
    Divider,
    FormControlLabel,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
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
    permissionCategories: PermissionsCategory[];
}

export default function PermissionsCard(props: Props) {
    const {
        category,
        groups,
        setPermissionsStepIsValid,
        permissionCategories,
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
        ].permissionDetails.map((permissionDetail) => {
            return permissionDetail.permissionName === event.target.id
                ? {
                    ...permissionDetail,
                    checked: event.target.checked,
                }
                : permissionDetail;
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
        ].permissionDetails.map((permissionDetail) => {
            return {
                ...permissionDetail,
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
        newPermissions.forEach((group) => {
            if (
                group.permissionDetails.some(
                    (permissionDetail) => permissionDetail.checked,
                )
            ) {
                group.open = true;
            }
        });

        setCardPermissions(newPermissions);
    }, []);

    useEffect(() => {
        const hasPermissions = permissionCategories.some((permissionCategory) =>
            permissionCategory.groups.some((group) =>
                group.permissionDetails.some(
                    (permissionDetail) => permissionDetail.checked,
                ),
            ),
        );

        setPermissionsStepIsValid(hasPermissions);
    }, [ permissionCategories, cardPermissions ]);

    const onChange = () => {
        return ``;
    };

    return (
        <Card className={classes.root}>
            <CardHeader title={category} />
            <Divider />
            <TableSearch
                value=""
                onChange={onChange} />
            {cardPermissions.map((groupElement, groupIndex) => (
                <Accordion
                    key={`Accordion${groupElement.group}`}
                    expanded={groupElement.open}
                >
                    <AccordionSummary
                        key={`AccordionSummary${groupElement.group}`}
                        aria-label="Expand"
                        aria-controls="additional-actions1-content"
                        id="additional-actions1-header"
                        onClick={() => handleOpenAccordion(groupIndex)}
                    >
                        <FormControlLabel
                            className={classes.formControlLabel}
                            aria-label="Acknowledge"
                            control={
                                <Checkbox
                                    checked={groupElement.selectAll}
                                    tabIndex={groupIndex}
                                    onChange={handleSelectAllPermissions}
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
                                {groupElement.open ? (
                                    <ArrowDropUpIcon />
                                ) : (
                                    <ArrowDropDown />
                                )}
                            </div>
                            <div
                                color="textSecondary"
                                className={classes.category}
                            >
                                {groupElement.group}
                            </div>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails
                        key={`AccordionDetails${groupElement.group}`}
                    >
                        <div className={classes.accordionContainer}>
                            {groupElement.permissionDetails.map(
                                (permissionDetail) => (
                                    <React.Fragment
                                        key={`React.Fragment${permissionDetail.permissionName}${permissionDetail.permissionDescription}`}
                                    >
                                        <div className={classes.accountItem}>
                                            <div>
                                                <Checkbox
                                                    checked={
                                                        permissionDetail.checked
                                                    }
                                                    id={
                                                        permissionDetail.permissionName
                                                    }
                                                    tabIndex={groupIndex}
                                                    onChange={
                                                        handlePermissionCheck
                                                    }
                                                />
                                                {
                                                    permissionDetail.permissionName
                                                }
                                            </div>
                                        </div>
                                        <div className={classes.accountItem}>
                                            {
                                                permissionDetail.permissionDescription
                                            }
                                        </div>
                                        <div className={classes.accountItem}>
                                            <div
                                                className={classes.tagContainer}
                                            >
                                                {permissionDetail.levels?.map(
                                                    (level) => (
                                                        <div
                                                            key={level}
                                                            className={
                                                                classes.tagText
                                                            }
                                                        >
                                                            {level}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ),
                            )}
                        </div>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Card>
    );
}
