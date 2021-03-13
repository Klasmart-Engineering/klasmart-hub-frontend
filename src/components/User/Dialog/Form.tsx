import { useGetOrganizationMemberships } from "@/api/organizationMemberships";
import { useGetSchools } from "@/api/schools";
import { currentMembershipVar } from "@/cache";
import {
    OrganizationMembership,
    Status,
} from "@/types/graphQL";
import { roleNameTranslations } from "@/utils/userRoles";
import {
    emailAddressRegex,
    phoneNumberRegex,
    useValidations,
} from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
import {
    createStyles,
    makeStyles,
    TextField as TempTextField,
    Theme,
} from "@material-ui/core";
import {
    Select,
    TextField,
} from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        "& > *": {
            marginBottom: theme.spacing(2),
        },
    },
}));

const getContactInfoHelperText = (contactInfo: string) => {
    if (contactInfo.length === 0) return <FormattedMessage id="createUser_emailPhoneRequired" />;
    const validEmail = emailAddressRegex.test(contactInfo);
    const validPhone = phoneNumberRegex.test(contactInfo);
    if (!validEmail && !validPhone) {
        if (!validEmail) return <FormattedMessage id="createUser_invalidEmail" />;
        if (!validPhone) return <FormattedMessage id="createUser_invalidPhone" />;
    }
};

interface Props {
    value: OrganizationMembership;
    onChange: (value: OrganizationMembership) => void;
    onValidation: (valid: boolean) => void;
}

export default function UserDialogForm (props: Props) {
    const {
        value,
        onChange,
        onValidation,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
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
    const allSchools = schoolsData?.organization?.schools?.filter((s) => s.status === Status.ACTIVE) ?? [];
    const allRoles = organizationData?.organization?.roles?.filter((role) => role.status === Status.ACTIVE) ?? [];
    const [ givenName, setGivenName ] = useState(value.user?.given_name ?? ``);
    const [ givenNameValid, setGivenNameValid ] = useState(true);
    const [ familyName, setFamilyName ] = useState(value.user?.family_name ?? ``);
    const [ familyNameValid, setFamilyNameValid ] = useState(true);
    const [ schools, setSchools ] = useState(value.schoolMemberships ?? []);
    const [ roles, setRoles ] = useState(value.roles ?? []);
    const [ roleIdsValid, setRoleIdsValid ] = useState(false);
    const [ contactInfo, setContactInfo ] = useState(value.user?.email ?? value.user?.phone ?? ``);
    const { required } = useValidations();

    useEffect(() => {
        onValidation([
            givenNameValid,
            familyNameValid,
            roleIdsValid,
            !getContactInfoHelperText(contactInfo),
        ].every((valid) => valid));
    }, [
        givenNameValid,
        familyNameValid,
        roleIdsValid,
        contactInfo,
    ]);

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
            roles: allRoles.filter((role) => !!roles.find((r) => r.role_id === role.role_id)),
            schoolMemberships: allSchools.filter((school) => !!schools.find((s) => s.school_id === school.school_id)).map((s) => ({
                user_id: userId,
                school_id: s.school_id,
            })),
        };
        onChange(updatedOrganizationMembership);

    }, [
        givenName,
        familyName,
        schools,
        roles,
        contactInfo,
    ]);

    return (
        <div className={classes.root}>
            <TextField
                fullWidth
                value={givenName}
                label={intl.formatMessage({
                    id: `createUser_givenNameLabel`,
                })}
                variant="outlined"
                type="text"
                autoFocus={!value?.user?.user_id}
                validations={[ required() ]}
                onChange={setGivenName}
                onValidate={setGivenNameValid}
            />
            <TextField
                fullWidth
                value={familyName}
                label={intl.formatMessage({
                    id: `createUser_familyNameLabel`,
                })}
                variant="outlined"
                type="text"
                validations={[ required() ]}
                onChange={setFamilyName}
                onValidate={setFamilyNameValid}
            />
            <Select
                multiple
                fullWidth
                label={intl.formatMessage({
                    id: `createUser_rolesLabel`,
                })}
                items={allRoles}
                value={roles}
                validations={[ required() ]}
                itemText={(role) => role.role_name && roleNameTranslations[role.role_name] ? intl.formatMessage({
                    id: roleNameTranslations[role.role_name],
                }) : role.role_name ?? ``}
                itemId={(role) => role.role_id}
                selectAllLabel={intl.formatMessage({
                    id: `users_selectAll`,
                })}
                onChange={(values) => setRoles(values)}
                onValidate={setRoleIdsValid}
            />
            <Select
                multiple
                fullWidth
                label={intl.formatMessage({
                    id: `createUser_schoolsLabel`,
                })}
                items={allSchools}
                value={schools}
                itemText={(school) => school.school_name ?? ``}
                itemId={(school) => school.school_id}
                selectAllLabel={intl.formatMessage({
                    id: `users_selectAll`,
                })}
                onChange={(values) => setSchools(values)}
            />
            <TempTextField
                fullWidth
                disabled={!!value?.user?.user_id}
                value={contactInfo}
                variant="outlined"
                label={intl.formatMessage({
                    id: `createUser_contactInfoLabel`,
                })}
                type="text"
                error={!!getContactInfoHelperText(contactInfo)}
                helperText={getContactInfoHelperText(contactInfo) ?? ` `}
                onChange={(e) => setContactInfo(e.currentTarget.value)}
            />
        </div>
    );
}
