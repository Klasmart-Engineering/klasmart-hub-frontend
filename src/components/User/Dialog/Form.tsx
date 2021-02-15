import { useGetOrganizationMemberships } from "@/api/organizationMemberships";
import { useGetSchools } from "@/api/schools";
import { currentMembershipVar } from "@/cache";
import { OrganizationMembership } from "@/types/graphQL";
import {
    emailAddressRegex,
    phoneNumberRegex,
} from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
import {
    createStyles,
    makeStyles,
    TextField,
    Theme,
} from "@material-ui/core";
import { MultiSelect } from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            "& > *": {
                marginBottom: theme.spacing(2),
            },
        },
    }),
);

const getContactInfoHelperText = (contactInfo: string) => {
    if (contactInfo.length === 0) return `Email or Phone number required`;
    const validEmail = emailAddressRegex.test(contactInfo);
    const validPhone = phoneNumberRegex.test(contactInfo);
    if (!validEmail && !validPhone) {
        if (!validEmail) return `Invalid email address`;
        if (!validPhone) return `Invalid phone number`;
    }
};

const getRolesHelperText = (roleIds: string[]) => {
    if (roleIds.length === 0) return `At least one role required`;
};

interface Props {
    value: OrganizationMembership;
    onChange: (value: OrganizationMembership) => void;
    onValidation: (valid: boolean) => void;
}

export default function UserDialogForm(props: Props) {
    const {
        value,
        onChange,
        onValidation,
    } = props;
    const classes = useStyles();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const { data: schoolsData } = useGetSchools({
        variables: {
            organization_id,
        },
    });
    const { data: organizationData } = useGetOrganizationMemberships({
        variables: {
            organization_id,
        },
    });
    const allSchools = schoolsData?.organization?.schools?.filter((s) => s.status === `active`) ?? [];
    const allRoles = organizationData?.organization?.roles?.filter((role) => role.status === `active`) ?? [];
    const [ givenName, setGivenName ] = useState(value.user?.given_name ?? ``);
    const [ familyName, setFamilyName ] = useState(value.user?.family_name ?? ``);
    const [ schoolIds, setSchoolIds ] = useState<string[]>(value.schoolMemberships?.map((s) => s.school_id) ?? []);
    const [ roleIds, setRoleIds ] = useState<string[]>(value.roles?.filter((role) => role.status === `active`).map((role) => role.role_id) ?? []);
    const [ contactInfo, setContactInfo ] = useState(value.user?.email ?? value.user?.phone ?? ``);

    useEffect(() => {
        onValidation(!getRolesHelperText(roleIds) && !getContactInfoHelperText(contactInfo));
    }, [ roleIds, contactInfo ]);

    useEffect(() => {
        const userId = value.user?.user_id ?? ``;
        const email = (contactInfo && emailAddressRegex.test(contactInfo)) ? contactInfo : undefined;
        const phone = (contactInfo && phoneNumberRegex.test(contactInfo)) ? contactInfo : undefined;
        const updatedOrganizationMembership: OrganizationMembership = {
            organization_id: value.organization_id,
            user_id: userId,
            user: {
                user_id: userId,
                given_name: givenName,
                family_name: familyName,
                email,
                phone,
            },
            roles: allRoles.filter((r) => roleIds.includes(r.role_id)),
            schoolMemberships: allSchools.filter((s) => schoolIds.includes(s.school_id)).map((s) => ({
                user_id: userId,
                school_id: s.school_id,
            })),
        };
        onChange(updatedOrganizationMembership);

    }, [
        givenName,
        familyName,
        schoolIds,
        roleIds,
        contactInfo,
    ]);

    return (
        <div className={classes.root}>
            <TextField
                fullWidth
                helperText=" "
                value={givenName}
                label="Given name"
                variant="outlined"
                type="text"
                autoFocus={!value?.user?.user_id}
                onChange={(e) => setGivenName(e.currentTarget.value)}
            />
            <TextField
                fullWidth
                helperText=" "
                value={familyName}
                label="Family name"
                variant="outlined"
                type="text"
                onChange={(e) => setFamilyName(e.currentTarget.value)}
            />
            <MultiSelect
                label="Roles"
                items={allRoles}
                value={roleIds}
                error={!!getRolesHelperText(roleIds)}
                helperText={getRolesHelperText(roleIds) ?? ` `}
                itemText={(role) => role.role_name ?? ``}
                itemValue={(role) => role.role_id}
                onChange={(values) => setRoleIds(values)}
            />
            <MultiSelect
                label="Schools (optional)"
                items={allSchools}
                value={schoolIds}
                itemText={(school) => school.school_name ?? ``}
                itemValue={(school) => school.school_id}
                onChange={(values) => setSchoolIds(values)}
            />
            <TextField
                fullWidth
                disabled={!!value?.user?.user_id}
                value={contactInfo}
                variant="outlined"
                label="Contact Info"
                type="text"
                error={!!getContactInfoHelperText(contactInfo)}
                helperText={getContactInfoHelperText(contactInfo) ?? ` `}
                onChange={(e) => setContactInfo(e.currentTarget.value)}
            />
        </div>
    );
}
