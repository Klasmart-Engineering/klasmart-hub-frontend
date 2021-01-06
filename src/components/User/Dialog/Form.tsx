import React, { useEffect, useState } from "react";
import { createStyles, makeStyles, TextField, Theme } from "@material-ui/core";
import { Class, OrganizationMembership } from "@/types/graphQL";
import { useGetSchools } from "@/api/schools";
import { useReactiveVar } from "@apollo/client";
import { currentMembershipVar } from "@/cache";
import { alphanumeric } from "@/utils/validations";
import MultiSelect from "@/components/MultiSelect";
import { useGetMyOrganization } from "@/api/organizations";
import { userIdVar } from "@/cache";
import { useGetOrganizationUsers } from "@/api/users";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            "& > *": {
                marginBottom: theme.spacing(2)
            }
        },
    }),
);

const getClassNameHelperText = (name: string) => {
    if (!name.length) return "Class name can't be empty";
    if (alphanumeric(name)) return "Only alphanumeric characters are valid";    
    return "";
};

interface Props {
    value: OrganizationMembership
    onChange: (value: OrganizationMembership) => void
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
    const userId = useReactiveVar(userIdVar);
    const { organization_id } = organization;
    const { data: schoolsData } = useGetSchools(organization_id);
    const { data: organizationData } = useGetOrganizationUsers(organization_id);
    const allSchools = schoolsData?.me.membership?.organization?.schools ?? [];
    const allRoles = organizationData?.organization?.roles ?? [];
    const [ givenName, setGivenName ] = useState(value.user?.given_name ?? "");
    const [ familyName, setFamilyName ] = useState(value.user?.family_name ?? "");
    const [ schoolIds, setSchoolIds ] = useState<string[]>(value.organization?.schools?.map((s) => s.school_id) ?? []);
    const [ roleIds, setRoleIds ] = useState<string[]>(value.roles?.map((r) => r.role_id) ?? []);
    const [ status, setStatus ] = useState(value.status ?? "");

    useEffect(() => {
        onValidation(!getClassNameHelperText(givenName) && !getClassNameHelperText(familyName));
    }, [value]);

    // useEffect(() => {
    //     const updatedClass: Class = {
    //         class_id: value.class_id,
    //         class_name: className,
    //         schools: allSchools.filter((s) => schoolIds.includes(s.school_id)),
    //         status,
    //     };
    //     onChange(updatedClass);
    // }, [ className, schoolIds, status ]);

    return (
        <div className={classes.root}>
            <TextField
                fullWidth
                error={!!getClassNameHelperText(givenName)}
                helperText={getClassNameHelperText(givenName) + " "}
                value={givenName}
                label="Given name"
                variant="outlined"
                type="text"
                autoFocus={!value.user_id}
                onChange={(e) => setGivenName(e.currentTarget.value)}
            />
            <TextField
                fullWidth
                error={!!getClassNameHelperText(familyName)}
                helperText={getClassNameHelperText(familyName) + " "}
                value={familyName}
                label="Family name"
                variant="outlined"
                type="text"
                onChange={(e) => setFamilyName(e.currentTarget.value)}
            />
            <MultiSelect
                label="Roles (optional)"
                items={allRoles}
                value={roleIds}
                itemText={(role) => role.role_name ?? ""}
                itemValue={(role) => role.role_id}
                onChange={(values) => setRoleIds(values)}
            />
            <MultiSelect
                label="Schools (optional)"
                items={allSchools}
                value={schoolIds}
                itemText={(school) => school.school_name ?? ""}
                itemValue={(school) => school.school_id}
                onChange={(values) => setSchoolIds(values)}
            />
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
