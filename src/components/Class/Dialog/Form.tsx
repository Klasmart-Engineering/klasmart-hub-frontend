import React, { useEffect, useState } from "react";
import { Checkbox, createStyles, Divider, ListItemIcon, makeStyles, MenuItem, SvgIcon, TextField, Theme } from "@material-ui/core";
import { Class } from "@/types/graphQL";
import { useGetSchools } from "@/api/schools";
import { useReactiveVar } from "@apollo/client";
import { currentMembershipVar } from "@/cache";
import { alphanumeric } from "@/utils/validations";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            "& > *": {
                marginBottom: theme.spacing(2)
            }
        },
        checkboxIcon: {
            margin: theme.spacing(1 + 1/8)
        }
    }),
);

const getClassNameHelperText = (name: string) => {
    if (!name.length) return "Class name can't be empty";
    if (alphanumeric(name)) return "Only alphanumeric characters are valid";    
    return "";
};

interface Props {
    value: Class
    onChange: (value: Class) => void
    onValidation: (valid: boolean) => void
}

export default function ClassDialogForm(props: Props) {
    const {
        value,
        onChange,
        onValidation,
    } = props;
    const classes = useStyles();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const { data } = useGetSchools(organization_id);
    const allSchools = data?.me.membership?.organization?.schools ?? [];
    const [ className, setClassName ] = useState(value.class_name ?? "");
    const [ schoolIds, setSchoolIds ] = useState<string[]>(value.schools?.map((s) => s.school_id) ?? []);
    const [ status, setStatus ] = useState(value.status ?? "");
    const [ openSelect, setOpenSelect ] = useState(false);

    useEffect(() => {
        onValidation(!getClassNameHelperText(className));
    }, [value]);

    useEffect(() => {
        const updatedClass: Class = {
            class_id: value.class_id,
            class_name: className,
            schools: allSchools.filter((s) => schoolIds.includes(s.school_id)),
            status,
        };
        onChange(updatedClass);
    }, [ className, schoolIds, status ]);

    return (
        <div className={classes.root}>
            <TextField
                fullWidth
                error={!!getClassNameHelperText(className)}
                helperText={getClassNameHelperText(className) + " "}
                value={className}
                label="Class name"
                variant="outlined"
                type="text"
                autoFocus={!value.class_id}
                onChange={(e) => setClassName(e.currentTarget.value)}
            />
            <TextField
                helperText=" "
                select
                fullWidth
                label="Schools (optional)"
                variant="outlined"
                SelectProps={{
                    multiple: true,
                    open: openSelect,
                    onOpen: () => setOpenSelect(true),
                    onClose: () => setOpenSelect(false),
                    renderValue: schoolIds.includes("") || schoolIds.includes("all") ? undefined : (values: string[]) => 
                        values.map((value) => allSchools.find((s) => s.school_id === value)?.school_name).join(", "),
                    value: schoolIds,
                    onChange: (e) => {
                        const values = e.target.value as unknown as string[];
                        if (values.includes("")) {
                            setSchoolIds([]);
                            return;
                        }
                        if (values.includes("all")) {
                            setSchoolIds(allSchools.map((s) => s.school_id));
                            return;
                        }
                        setSchoolIds(values);
                    }
                }}
            >
                <MenuItem
                    value=""
                    onClick={() => setOpenSelect(false)}
                >
                    <ListItemIcon>
                        <SvgIcon className={classes.checkboxIcon}>
                            <path fill="currentColor" d="M20,16V4H8V16H20M22,16A2,2 0 0,1 20,18H8C6.89,18 6,17.1 6,16V4C6,2.89 6.89,2 8,2H20A2,2 0 0,1 22,4V16M16,20V22H4A2,2 0 0,1 2,20V7H4V20H16Z" />
                        </SvgIcon>
                    </ListItemIcon>
                    <em>None</em>
                </MenuItem>
                <Divider />
                {allSchools.map((school, i) =>
                    <MenuItem
                        key={`school-${i}`}
                        value={school.school_id}
                    >
                        <ListItemIcon>
                            <Checkbox checked={schoolIds.includes(school.school_id)} />
                        </ListItemIcon>
                        {school.school_name}
                    </MenuItem>
                )}
                {allSchools.length > 0 && <Divider />}
                <MenuItem
                    value="all"
                    onClick={() => setOpenSelect(false)}
                >
                    <ListItemIcon>
                        <SvgIcon className={classes.checkboxIcon}>
                            <path fill="currentColor" d="M22,16A2,2 0 0,1 20,18H8C6.89,18 6,17.1 6,16V4C6,2.89 6.89,2 8,2H20A2,2 0 0,1 22,4V16M16,20V22H4A2,2 0 0,1 2,20V7H4V20H16M13,14L20,7L18.59,5.59L13,11.17L9.91,8.09L8.5,9.5L13,14Z" />
                        </SvgIcon>
                    </ListItemIcon>
                    <em>All</em>
                </MenuItem>
            </TextField>
            <TextField
                disabled
                fullWidth
                value={status}
                variant="outlined"
                label="Status"
                type="text"
                helperText=" "
                onChange={(e) => setStatus(e.currentTarget.value)}
            />
        </div>
    );
}
