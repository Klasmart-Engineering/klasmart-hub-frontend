import { Group } from "@/components/Role/Dialog/CreateEdit";
import { formatPermissionName } from "@/utils/validations";
import { ArrowDropDown } from "@mui/icons-material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    CardHeader,
    Checkbox,
    Divider,
    FormControlLabel,
} from "@mui/material";
import Card from "@mui/material/Card";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { TableSearch } from "@kl-engineering/kidsloop-px";
import React,
{
    Dispatch,
    SetStateAction,
    useEffect,
} from "react";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            width: `100%`,
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
    }));

interface Props {
    category: string;
    groups: Group[];
    checkedPermissions: string[];
    setCheckedPermissions: Dispatch<SetStateAction<string[]>>;
}

export default function PermissionsCard (props: Props) {
    const {
        category,
        groups,
        checkedPermissions,
        setCheckedPermissions,
    } = props;
    const classes = useStyles();
    const [ cardPermissions, setCardPermissions ] = React.useState<Group[]>(groups);
    const [ searchString, setSearchString ] = React.useState(``);

    const handleOpenAccordion = (index: number) => {
        const newPermissions = [ ...cardPermissions ];
        newPermissions[index].open = !newPermissions[index].open;
        setCardPermissions(newPermissions);
    };

    const handlePermissionCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPermissions = [ ...cardPermissions ];
        const accordionDetails = newPermissions[event.target.tabIndex].permissionDetails.map((permissionDetail) => {
            if (permissionDetail.permissionName === event.target.id) {
                event.target.checked && !checkedPermissions.includes(permissionDetail.permissionId)
                    ? setCheckedPermissions((permissions) => [ ...permissions, permissionDetail.permissionId ])
                    : setCheckedPermissions((permissions) =>
                        permissions.filter((permissionId) => permissionId !== permissionDetail.permissionId));
                return {
                    ...permissionDetail,
                    checked: event.target.checked,
                };
            }

            return permissionDetail;
        });

        newPermissions[event.target.tabIndex].permissionDetails = accordionDetails;

        if (!event.target.checked) {
            newPermissions[event.target.tabIndex].selectAll = false;
        }

        setCardPermissions(newPermissions);
    };

    const handleSelectAllPermissions = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPermissions = [ ...cardPermissions ];
        const accordionDetails = newPermissions[event.target.tabIndex].permissionDetails.map((permissionDetail) => {
            if (event.target.checked && !checkedPermissions.includes(permissionDetail.permissionId)) {
                setCheckedPermissions((permissions) => [ ...permissions, permissionDetail.permissionId ]);
            }

            if (!event.target.checked && checkedPermissions.includes(permissionDetail.permissionId)) {
                setCheckedPermissions((permissions) =>
                    permissions.filter((permissionId) => permissionId !== permissionDetail.permissionId));
            }

            return {
                ...permissionDetail,
                checked: event.target.checked,
            };
        });

        newPermissions[event.target.tabIndex].permissionDetails = accordionDetails;
        newPermissions[event.target.tabIndex].selectAll = event.target.checked;

        setCardPermissions(newPermissions);
    };

    useEffect(() => {
        const newPermissions = [ ...cardPermissions ];
        newPermissions.forEach((group) => {
            if (group.permissionDetails.some((permissionDetail) => permissionDetail.checked)) {
                group.open = true;
            }
        });

        setCardPermissions(newPermissions);
    }, []);

    const searchFilter = (permissionDescription: string, permissionName: string, levels: string[]): boolean => {
        const description = permissionDescription
            .toLowerCase()
            .split(` `)
            .filter((word) => word.length !== 0);

        const name = formatPermissionName(permissionName)
            .toLowerCase()
            .split(` `)
            .filter((word) => word.length !== 0);

        const [ firstRole ] = levels;
        const roleLevel = [];

        if (firstRole) {
            const roles = firstRole.toLowerCase().split(` `);

            for (const role of roles) {
                roleLevel.push(role);
            }
        }

        const words = description.concat(name, roleLevel);
        const userString = searchString
            .toLowerCase()
            .split(` `)
            .filter((word) => word.length !== 0);

        return userString.every((word) => words.includes(word));
    };

    const onChange = (string: string) => {
        setSearchString(string.toLowerCase());

        return ``;
    };

    return (
        <Card className={classes.root}>
            <CardHeader title={category} />
            <Divider />
            <TableSearch
                value=""
                onChange={onChange} />
            {cardPermissions.map((groupElement, groupIndex) => {
                const checked = groupElement.permissionDetails.every((permissionDetail) => permissionDetail.checked);
                const indeterminate =
                    groupElement.permissionDetails.some((permissionDetail) => permissionDetail.checked) && !checked;

                return (
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
                            <FormControlLabel
                                className={classes.formControlLabel}
                                aria-label="Acknowledge"
                                control={
                                    <Checkbox
                                        checked={checked}
                                        indeterminate={indeterminate}
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
                                    {groupElement.open ? <ArrowDropUpIcon /> : <ArrowDropDown />}
                                </div>
                                <div
                                    color="textSecondary"
                                    className={classes.category}>
                                    {groupElement.group}
                                </div>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails key={`AccordionDetails${groupElement.group}`}>
                            <div className={classes.accordionContainer}>
                                {groupElement.permissionDetails
                                    .filter((permissionDetail) => {
                                        if (searchString.length === 0) {
                                            return true;
                                        }

                                        return searchFilter(permissionDetail.permissionDescription, permissionDetail.permissionName, permissionDetail.levels ?? []);
                                    })
                                    .map((permissionDetail) => (
                                        <React.Fragment
                                            key={`React.Fragment${permissionDetail.permissionName}${permissionDetail.permissionDescription}`}
                                        >
                                            <div className={classes.accountItem}>
                                                <div>
                                                    <Checkbox
                                                        checked={permissionDetail.checked}
                                                        id={permissionDetail.permissionName}
                                                        tabIndex={groupIndex}
                                                        onChange={handlePermissionCheck}
                                                    />
                                                    {formatPermissionName(permissionDetail.permissionName)}
                                                </div>
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
                );
            })}
        </Card>
    );
}
