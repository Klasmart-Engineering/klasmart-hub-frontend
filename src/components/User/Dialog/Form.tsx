import { useGetOrganizationMemberships } from "@/api/organizationMemberships";
import { useGetSchools } from "@/api/schools";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    OrganizationMembership,
    Status,
} from "@/types/graphQL";
import { roleNameTranslations } from "@/utils/userRoles";
import { UserGenders } from "@/utils/users";
import {
    emailAddressRegex,
    phoneNumberRegex,
    useValidations,
} from "@/utils/validations";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
    Select,
    TextField,
} from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            "& > *": {
                marginBottom: theme.spacing(2),
            },
        },
        heading: {
            display: `grid`,
            gridColumnGap: `10px`,
        },
        shortCode: {
            gridColumn: `1 / span 2`,
        },
        genderContainer: {
            width: `100%`,
            border: `1px solid rgba(0, 0, 0, .125)`,
            borderRadius: `5px`,
            padding: `10px`,
        },
        accordionContainer: {
            width: theme.breakpoints.values.lg,
            display: `grid`,
        },
    }));

const Accordion = withStyles({
    root: {
        border: `1px solid rgba(0, 0, 0, .125)`,
        borderRadius: `5px`,
        boxShadow: `none`,
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({}))(MuiAccordionDetails);

const formatDateOfBirth = (date: string): string => {
    if (date) {
        const mmYYYY = date.split(`-`);
        const [ month, year ] = mmYYYY;
        return `${year}-${month}`;
    }

    return ``;
};

const genderHandler = (gender: string) => {
    switch (gender) {
    case UserGenders.MALE:
        return gender;
    case UserGenders.FEMALE:
        return gender;
    case UserGenders.NOT_SPECIFIED:
        return gender;
    case ``:
        return UserGenders.FEMALE;
    default:
        return UserGenders.OTHER;
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
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;
    const { data: schoolsData } = useGetSchools({
        variables: {
            organization_id: organizationId,
        },
    });
    const { data: organizationData } = useGetOrganizationMemberships({
        variables: {
            organization_id: organizationId,
        },
    });
    const allSchools = schoolsData?.organization?.schools?.filter((s) => s.status === Status.ACTIVE) ?? [];
    const allRoles = organizationData?.organization?.roles?.filter((role) => role.status === Status.ACTIVE) ?? [];
    const [ givenName, setGivenName ] = useState(value.user?.given_name ?? ``);
    const [ givenNameValid, setGivenNameValid ] = useState(true);
    const [ familyName, setFamilyName ] = useState(value.user?.family_name ?? ``);
    const [ familyNameValid, setFamilyNameValid ] = useState(true);
    const [ schoolIds, setSchoolIds ] = useState(value.schoolMemberships
        ?.filter((membership) => membership.school?.status === Status.ACTIVE)
        .map((schoolMembership) => schoolMembership.school_id) ?? []);
    const [ roleIds, setRoleIds ] = useState(value.roles?.filter((role) => role.status === Status.ACTIVE).map((role) => role.role_id) ?? []);
    const [ roleIdsValid, setRoleIdsValid ] = useState(true);
    const [ contactInfo, setContactInfo ] = useState(value.user?.email ?? value.user?.phone ?? ``);
    const [ contactInfoIsValid, setContactInfoIsValid ] = useState(true);
    const [ shortcode, setShortcode ] = useState(value.shortcode ?? ``);
    const [ shortcodeIsValid, setShortcodeIsValid ] = useState(true);
    const [ alternativeEmail, setAlternativeEmail ] = useState(value.user?.alternate_email ?? ``);
    const [ alternativeEmailIsValid, setAlternativeEmailIsValid ] = useState(true);
    const [ alternativePhone, setAlternativePhone ] = useState(value.user?.alternate_phone ?? ``);
    const [ alternativePhoneIsValid, setAlternativePhoneIsValid ] = useState(true);
    const [ radioValue, setRadioValue ] = useState<string | UserGenders>(genderHandler(value.user?.gender ?? ``));
    const [ gender, setGender ] = useState(value.user?.gender ?? ``);
    const [ genderIsValid, setGenderIsValid ] = useState(true);
    const [ birthday, setBirthday ] = useState(formatDateOfBirth(value.user?.date_of_birth ?? ``));
    const [ birthdayIsValid, setBirthdayIsValid ] = useState(true);
    const [ expanded, setExpanded ] = useState(!!(value.user?.alternate_email || value.user?.alternate_phone));
    const {
        required,
        alphanumeric,
        max,
        min,
        emailOrPhone,
        email,
        phone,
        letternumeric,
        notEquals,
        afterDate,
        beforeDate,
    } = useValidations();

    const today = new Date();
    const minDateAllowed = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = `${today.getMonth() + 1}`.padStart(2, `0`);
    minDateAllowed.setFullYear(currentYear - 100);

    useEffect(() => {
        onValidation([
            givenNameValid,
            familyNameValid,
            roleIdsValid,
            shortcodeIsValid,
            genderIsValid,
            alternativeEmailIsValid,
            alternativePhoneIsValid,
            contactInfoIsValid,
            birthdayIsValid,
        ].every((valid) => valid));
    }, [
        givenNameValid,
        familyNameValid,
        roleIdsValid,
        shortcodeIsValid,
        genderIsValid,
        alternativeEmailIsValid,
        alternativePhoneIsValid,
        contactInfoIsValid,
        birthdayIsValid,
    ]);

    useEffect(() => {
        const userId = value.user?.user_id ?? ``;
        const email = contactInfo && emailAddressRegex.test(contactInfo) ? contactInfo : undefined;
        const phone = contactInfo && phoneNumberRegex.test(contactInfo) ? contactInfo : undefined;
        const selectedGender = radioValue === UserGenders.OTHER ? gender : radioValue;
        const updatedOrganizationMembership: OrganizationMembership = {
            organization_id: value.organization_id,
            user_id: userId,
            user: {
                user_id: userId,
                given_name: givenName,
                family_name: familyName,
                email,
                phone,
                date_of_birth: dateFormatMMYYYY(),
                gender: selectedGender,
                alternate_email: alternativeEmail,
                alternate_phone: alternativePhone,
            },
            roles: allRoles.filter((role) => roleIds.includes(role.role_id)),
            schoolMemberships: allSchools
                .filter((school) => schoolIds.includes(school.school_id))
                .map((s) => ({
                    user_id: userId,
                    school_id: s.school_id,
                })),
            shortcode,
        };
        onChange(updatedOrganizationMembership);
    }, [
        givenName,
        familyName,
        schoolIds,
        roleIds,
        contactInfo,
        gender,
        radioValue,
        genderIsValid,
        birthday,
        alternativeEmail,
        alternativePhone,
        shortcode,
        schoolsData,
        organizationData,
    ]);

    useEffect(() => {
        setGivenName(value.user?.given_name ?? ``);
        setFamilyName(value.user?.family_name ?? ``);
        setSchoolIds(value.schoolMemberships
            ?.filter((membership) => membership.school?.status === Status.ACTIVE)
            .map((schoolMembership) => schoolMembership.school_id) ?? []);
        setRoleIds(value.roles?.filter((role) => role.status === Status.ACTIVE).map((role) => role.role_id) ?? []);
        setContactInfo(value.user?.email ?? value.user?.phone ?? ``);
        setShortcode(value.shortcode ?? ``);
        setAlternativeEmail(value.user?.alternate_email ?? ``);
        setAlternativePhone(value.user?.alternate_phone ?? ``);
        setRadioValue(genderHandler(value.user?.gender ?? ``));
        setGender(value.user?.gender ?? ``);
        setExpanded(!!(value.user?.alternate_email || value.user?.alternate_phone));
        setBirthday(formatDateOfBirth(value.user?.date_of_birth ?? ``));
    }, [ value ]);

    const handleAccordionChange = (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
        setExpanded(newExpanded);
    };

    const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const radioSelected = (event.target as HTMLInputElement).value;
        setRadioValue(radioSelected);
    };

    const dateFormatMMYYYY = () => {
        if (birthday) {
            const yyyyMM = birthday.split(`-`);
            const [ year, month ] = yyyyMM;
            return `${month}-${year}`;
        }

        return ``;
    };

    useEffect(() => {
        if (radioValue !== UserGenders.OTHER) {
            setGenderIsValid(true);
        }

        if (radioValue === UserGenders.OTHER && !gender) {
            setGender(``);
        }

        if (radioValue === UserGenders.OTHER && gender) {
            if (gender === UserGenders.MALE || gender === UserGenders.FEMALE || gender === UserGenders.NOT_SPECIFIED) {
                setGender(``);
            }
        }
    }, [ radioValue, gender ]);

    return (
        <div className={classes.root}>
            <div className={classes.heading}>
                <TextField
                    value={givenName}
                    label={intl.formatMessage({
                        id: `createUser_givenNameLabel`,
                    })}
                    variant="outlined"
                    type="text"
                    autoFocus={!value?.user?.user_id}
                    validations={[
                        required(),
                        letternumeric(),
                        max(35),
                    ]}
                    onChange={setGivenName}
                    onValidate={setGivenNameValid}
                />
                <TextField
                    value={familyName}
                    label={intl.formatMessage({
                        id: `createUser_familyNameLabel`,
                    })}
                    variant="outlined"
                    type="text"
                    validations={[
                        required(),
                        letternumeric(),
                        max(35),
                    ]}
                    onChange={setFamilyName}
                    onValidate={setFamilyNameValid}
                />
                <TextField
                    value={contactInfo}
                    variant="outlined"
                    label={intl.formatMessage({
                        id: `createUser_contactInfoLabel`,
                    })}
                    type="text"
                    validations={[ required(), emailOrPhone() ]}
                    onChange={setContactInfo}
                    onValidate={setContactInfoIsValid}
                />
                <TextField
                    label="Birthday"
                    type="month"
                    value={birthday}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        inputProps: {
                            min: `${currentYear - 100}-${currentMonth}`,
                            max: `${currentYear}-${currentMonth}`,
                        },
                    }}
                    validations={[ beforeDate(today), afterDate(minDateAllowed) ]}
                    onValidate={setBirthdayIsValid}
                    onChange={setBirthday}
                />
                <TextField
                    className={classes.shortCode}
                    value={shortcode}
                    label="Short Code"
                    variant="outlined"
                    type="text"
                    validations={[ alphanumeric(), max(16) ]}
                    onChange={setShortcode}
                    onValidate={setShortcodeIsValid}
                />
            </div>
            <FormControl className={classes.genderContainer}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                    aria-label="gender"
                    name="gender"
                    value={radioValue}
                    onChange={handleGenderChange}>
                    <FormControlLabel
                        value={UserGenders.FEMALE}
                        control={<Radio />}
                        label="Female" />
                    <FormControlLabel
                        value={UserGenders.MALE}
                        control={<Radio />}
                        label="Male" />
                    <FormControlLabel
                        value={UserGenders.NOT_SPECIFIED}
                        control={<Radio />}
                        label="I prefer not to say"
                    />
                    <FormControlLabel
                        value={UserGenders.OTHER}
                        control={<Radio />}
                        label="Other" />
                </RadioGroup>
                {radioValue === UserGenders.OTHER && (
                    <TextField
                        value={gender}
                        label="Please specify gender"
                        variant="outlined"
                        type="text"
                        validations={[
                            min(3),
                            max(16),
                            letternumeric(),
                        ]}
                        onChange={setGender}
                        onValidate={setGenderIsValid}
                    />
                )}
            </FormControl>
            <Select
                multiple
                fullWidth
                label={intl.formatMessage({
                    id: `createUser_rolesLabel`,
                })}
                items={allRoles}
                value={roleIds}
                validations={[ required() ]}
                itemText={(role) =>
                    role.role_name && roleNameTranslations[role.role_name]
                        ? intl.formatMessage({
                            id: roleNameTranslations[role.role_name],
                        })
                        : role.role_name ?? ``
                }
                itemValue={(role) => role.role_id}
                selectAllLabel={intl.formatMessage({
                    id: `users_selectAll`,
                })}
                onChange={setRoleIds}
                onValidate={setRoleIdsValid}
            />
            <Select
                multiple
                fullWidth
                label={intl.formatMessage({
                    id: `createUser_schoolsLabel`,
                })}
                items={allSchools}
                value={schoolIds}
                itemText={(school) => school.school_name ?? ``}
                itemValue={(school) => school.school_id}
                selectAllLabel={intl.formatMessage({
                    id: `users_selectAll`,
                })}
                onChange={setSchoolIds}
            />
            <Accordion
                square
                expanded={expanded}
                onChange={handleAccordionChange}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id="panel1d-header">
                    <FormLabel>Alternative Contact Info</FormLabel>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={classes.accordionContainer}>
                        <TextField
                            value={alternativeEmail}
                            variant="outlined"
                            label="Alternative Email"
                            type="text"
                            validations={[
                                email(),
                                ...(contactInfo
                                    ? [
                                        notEquals(contactInfo, intl.formatMessage({
                                            id: `users_alternativeEmailValidation`,
                                        })),
                                    ]
                                    : []),
                            ]}
                            onChange={setAlternativeEmail}
                            onValidate={setAlternativeEmailIsValid}
                        />
                    </div>
                </AccordionDetails>
                <AccordionDetails>
                    <div className={classes.accordionContainer}>
                        <TextField
                            value={alternativePhone}
                            variant="outlined"
                            label="Alternative Phone"
                            type="text"
                            validations={[ phone() ]}
                            onChange={setAlternativePhone}
                            onValidate={setAlternativePhoneIsValid}
                        />
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
