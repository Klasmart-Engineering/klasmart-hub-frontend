import { useGetOrganizationRoles } from "@/api/roles";
import { useGetPaginatedSchools } from "@/api/schools";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { FormErrors } from "@/types/form";
import { isActive } from "@/types/graphQL";
import { usePermission } from "@/utils/permissions";
import { mapSchoolNodeToSchoolRow } from "@/utils/schools";
import { roleNameTranslations } from "@/utils/userRoles";
import { UserGenders } from "@/utils/users";
import { useValidations } from "@/utils/validations";
import {
    Select,
    TextField,
} from "@kl-engineering/kidsloop-px";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Theme } from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
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
            gridRowGap: `10px`,
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

export const formatDateOfBirth = (date: string): string => {
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
    case `not_specified`:
        // Required for backwards compatability, as new validation rules mean `_` in Gender are invalid
        // TODO: remove once UD-852 is implemented
        return UserGenders.NOT_SPECIFIED;
    case ``:
        return UserGenders.FEMALE;
    default:
        return UserGenders.OTHER;
    }
};

export interface State {
    givenName: string;
    familyName: string;
    contactInfo: string;
    birthday: string;
    shortcode: string;
    gender: string;
    roles: string[];
    schools: string[];
    alternativeEmail: string;
    alternativePhone: string;
}

export const defaultState: State = {
    givenName: ``,
    familyName: ``,
    contactInfo: ``,
    birthday: ``,
    shortcode: ``,
    gender: UserGenders.FEMALE,
    roles: [],
    schools: [],
    alternativeEmail: ``,
    alternativePhone: ``,
};

export interface Errors extends FormErrors<State> {}

export interface Props {
    initialState: State;
    errors?: Errors;
    isExistingUser: boolean;
    onChange: (value: State) => void;
    onValidation: (valid: boolean) => void;
}

export default function UserDialogForm (props: Props) {
    const {
        initialState,
        errors = {},
        isExistingUser,
        onChange,
        onValidation,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;
    const { data: schoolsData } = useGetPaginatedSchools({
        variables: {
            direction: `FORWARD`,
            orderBy: `school_name`,
            order: `ASC`,
        },
    });
    const allSchools = schoolsData?.schoolsConnection?.edges
        .filter((edge) => isActive(edge.node))
        .map((edge) => mapSchoolNodeToSchoolRow(edge.node))
    ?? [];
    const { data: organizationData } = useGetOrganizationRoles({
        variables: {
            organization_id: organizationId,
        },
    });

    const allRoles = organizationData?.organization?.roles?.filter(isActive) ?? [];
    const canBeGivenBySchoolAdminRoles = [
        `Parent`,
        `Student`,
        `Teacher`,
        `School Admin`,
    ];

    const { loading, hasPermission: hasOrgAdminPermissions } = usePermission({
        OR: [ `create_users_40220`, `edit_users_40330` ],
    }, true);

    const availableRoles = hasOrgAdminPermissions ? allRoles : allRoles.filter(role => canBeGivenBySchoolAdminRoles.includes(role.role_name ?? ``));

    const [ givenName, setGivenName ] = useState(initialState.givenName);
    const [ givenNameValid, setGivenNameValid ] = useState(!errors?.givenName);
    const [ familyName, setFamilyName ] = useState(initialState.familyName);
    const [ familyNameValid, setFamilyNameValid ] = useState(!errors?.familyName);
    const [ schoolIds, setSchoolIds ] = useState(initialState.schools);
    const [ roleIds, setRoleIds ] = useState(initialState.roles);
    const [ roleIdsValid, setRoleIdsValid ] = useState(!errors?.roles);
    const [ contactInfo, setContactInfo ] = useState(initialState.contactInfo);
    const [ contactInfoIsValid, setContactInfoIsValid ] = useState(!errors?.contactInfo);
    const [ shortcode, setShortcode ] = useState(initialState.shortcode);
    const [ shortcodeIsValid, setShortcodeIsValid ] = useState(!errors?.shortcode);
    const [ alternativeEmail, setAlternativeEmail ] = useState(initialState.alternativeEmail);
    const [ alternativeEmailIsValid, setAlternativeEmailIsValid ] = useState(!errors?.alternativeEmail);
    const [ alternativePhone, setAlternativePhone ] = useState(initialState.alternativePhone);
    const [ alternativePhoneIsValid, setAlternativePhoneIsValid ] = useState(!errors?.alternativePhone);
    const [ radioValue, setRadioValue ] = useState<string | UserGenders>(genderHandler(initialState.gender));
    const [ gender, setGender ] = useState(initialState.gender);
    const [ genderIsValid, setGenderIsValid ] = useState(!errors?.gender);
    const [ birthday, setBirthday ] = useState(formatDateOfBirth(initialState.birthday));
    const [ birthdayIsValid, setBirthdayIsValid ] = useState(!errors?.birthday);
    const [ schoolIdsValid, setSchoolIdsValid ] = useState(!errors?.schools);
    const [ isAlternativeContactInfoExpanded, setIsAlternativeContactInfoExpanded ] = useState(!!(initialState.alternativeEmail || initialState.alternativePhone));
    const {
        required,
        alphanumeric,
        max,
        min,
        email,
        phone,
        emailOrPhone,
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
            schoolIdsValid,
            Object.keys(errors).length === 0,
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
        schoolIdsValid,
        errors,
    ]);

    useEffect(() => {
        const newState: State = {
            givenName,
            familyName,
            contactInfo,
            shortcode,
            alternativeEmail,
            alternativePhone,
            gender: radioValue === UserGenders.OTHER ? gender : radioValue,
            roles: availableRoles.filter((role) => roleIds.includes(role.role_id)).map(({ role_id }) => role_id),
            schools: allSchools
                .filter((school) => schoolIds.includes(school.id))
                .map(({ id }) => id),
            birthday: dateFormatMMYYYY(),
        };
        onChange(newState);
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
        setGivenName(initialState.givenName);
        setFamilyName(initialState.familyName);
        setSchoolIds(initialState.schools);
        setRoleIds(initialState.roles);
        setContactInfo(initialState.contactInfo);
        setShortcode(initialState.shortcode);
        setAlternativeEmail(initialState.alternativeEmail);
        setAlternativePhone(initialState.alternativePhone);
        setRadioValue(genderHandler(initialState.gender));
        setGender(initialState.gender);
        setBirthday(formatDateOfBirth(initialState.birthday));
        setIsAlternativeContactInfoExpanded(!!(initialState.alternativeEmail || initialState.alternativePhone));
    }, [ initialState ]);

    const handleAccordionChange = (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
        setIsAlternativeContactInfoExpanded(newExpanded);
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

    const attributes = {
        givenName: intl.formatMessage({
            id: `users_firstName`,
        }),
        familyName: intl.formatMessage({
            id: `users_lastName`,
        }),
        contactInfo: intl.formatMessage({
            id: `common.emailOrPhone`,
        }),
        shortCode: intl.formatMessage({
            id: `common.shortCode`,
        }),
        email: intl.formatMessage({
            id: `common.email`,
        }),
        gender: intl.formatMessage({
            id: `user.gender`,
        }),
        roles: intl.formatMessage({
            id: `organization.roles`,
        }, {
            count: 1,
        }),
        schools: intl.formatMessage({
            id: `users_school`,
        }, {
            count: 1,
        }),
    };

    return ( loading ? null :
        <div className={classes.root}>
            <div className={classes.heading}>
                <TextField
                    id={`givenName`}
                    value={givenName}
                    label={intl.formatMessage({
                        id: `createUser_givenNameLabel`,
                    })}
                    variant="outlined"
                    type="text"
                    autoFocus={isExistingUser}
                    validations={[
                        required(intl.formatMessage({
                            id: `validation.error.attribute.required`,
                        }, {
                            attribute: attributes.givenName,
                        })),
                        max(35, intl.formatMessage({
                            id: `validation.error.attribute.maxLength`,
                        }, {
                            attribute: attributes.givenName,
                            max: 35,
                        })),
                        letternumeric(intl.formatMessage({
                            id: `validation.error.attribute.alphanumericAndSpecialCharacters`,
                        }, {
                            attribute: attributes.givenName,
                        })),
                    ]}
                    error={errors?.givenName?.message}
                    onChange={setGivenName}
                    onValidate={setGivenNameValid}
                />
                <TextField
                    id={`familyName`}
                    value={familyName}
                    label={intl.formatMessage({
                        id: `createUser_familyNameLabel`,
                    })}
                    variant="outlined"
                    type="text"
                    validations={[
                        required(intl.formatMessage({
                            id: `validation.error.attribute.required`,
                        }, {
                            attribute: attributes.familyName,
                        })),
                        max(35, intl.formatMessage({
                            id: `validation.error.attribute.maxLength`,
                        }, {
                            attribute: attributes.familyName,
                            max: 35,
                        })),
                        letternumeric(intl.formatMessage({
                            id: `validation.error.attribute.alphanumericAndSpecialCharacters`,
                        }, {
                            attribute: attributes.familyName,
                        })),
                    ]}
                    error={errors?.familyName?.message}
                    onChange={setFamilyName}
                    onValidate={setFamilyNameValid}
                />
                <TextField
                    id={`contactInfo`}
                    value={contactInfo}
                    variant="outlined"
                    label={intl.formatMessage({
                        id: `createUser_contactInfoLabel`,
                    })}
                    type="text"
                    validations={isExistingUser ? undefined : [
                        required(intl.formatMessage({
                            id: `validation.error.attribute.required`,
                        }, {
                            attribute: attributes.contactInfo,
                        })),
                        emailOrPhone(intl.formatMessage({
                            id: `validation.error.email.format`,
                        }), intl.formatMessage({
                            id: `validation.error.phone.format`,
                        })),
                        max(250, intl.formatMessage({
                            id: `validation.error.attribute.maxLength`,
                        }, {
                            attribute: attributes.email,
                            max: 250,
                        })),
                    ]}
                    error={errors?.contactInfo?.message}
                    disabled={isExistingUser}
                    onChange={setContactInfo}
                    onValidate={setContactInfoIsValid}
                />
                <TextField
                    id={`birthday`}
                    label={intl.formatMessage({
                        id: `user.birthday`,
                    })}
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
                    validations={[ beforeDate(today), afterDate(minDateAllowed)  ]}
                    onValidate={setBirthdayIsValid}
                    onChange={setBirthday}
                />
                <TextField
                    id={`shortcode`}
                    className={classes.shortCode}
                    value={shortcode}
                    label={attributes.shortCode}
                    variant="outlined"
                    type="text"
                    validations={[
                        ...(isExistingUser ? [
                            required(intl.formatMessage({
                                id: `validation.error.attribute.required`,
                            }, {
                                attribute: attributes.shortCode,
                            })),
                        ] : []),
                        max(16, intl.formatMessage({
                            id: `validation.error.attribute.maxLength`,
                        }, {
                            attribute: attributes.shortCode,
                            max: 16,
                        })),
                        alphanumeric(intl.formatMessage({
                            id: `validation.error.attribute.alphanumeric`,
                        }, {
                            attribute: attributes.shortCode,
                        })),
                    ]}
                    error={errors?.shortcode?.message}
                    onChange={setShortcode}
                    onValidate={setShortcodeIsValid}
                />
            </div>
            <FormControl className={classes.genderContainer}>
                <FormLabel>{attributes.gender}</FormLabel>
                <RadioGroup
                    id={`gender`}
                    aria-label={attributes.gender}
                    name="gender"
                    value={radioValue}
                    onChange={handleGenderChange}>
                    <FormControlLabel
                        value={UserGenders.FEMALE}
                        control={<Radio />}
                        label={intl.formatMessage({
                            id: `user.gender.female`,
                        })} />
                    <FormControlLabel
                        value={UserGenders.MALE}
                        control={<Radio />}
                        label={intl.formatMessage({
                            id: `user.gender.male`,
                        })} />
                    <FormControlLabel
                        value={UserGenders.NOT_SPECIFIED}
                        control={<Radio />}
                        label={intl.formatMessage({
                            id: `user.gender.preferNotToSay`,
                        })}
                    />
                    <FormControlLabel
                        value={UserGenders.OTHER}
                        control={<Radio />}
                        label={intl.formatMessage({
                            id: `common.other`,
                        })} />
                </RadioGroup>
                {radioValue === UserGenders.OTHER && (
                    <TextField
                        id={`genderOther`}
                        value={gender}
                        label={intl.formatMessage({
                            id: `user.gender.pleaseSpecify`,
                        })}
                        variant="outlined"
                        type="text"
                        validations={[
                            min(3, intl.formatMessage({
                                id: `validation.error.attribute.minLength`,
                            }, {
                                attribute: attributes.gender,
                                min: 3,
                            })),
                            max(16, intl.formatMessage({
                                id: `validation.error.attribute.maxLength`,
                            }, {
                                attribute: attributes.gender,
                                max: 16,
                            })),
                            letternumeric(intl.formatMessage({
                                id: `validation.error.attribute.alphanumericAndSpecialCharacters`,
                            }, {
                                attribute: attributes.gender,
                            })),
                        ]}
                        onChange={setGender}
                        onValidate={setGenderIsValid}
                    />
                )}
            </FormControl>
            <Select
                multiple
                fullWidth
                id={`roles`}
                label={intl.formatMessage({
                    id: `createUser_rolesLabel`,
                })}
                items={availableRoles}
                value={roleIds}
                validations={[
                    required(intl.formatMessage({
                        id: `validation.error.attribute.required`,
                    }, {
                        attribute: attributes.roles,
                    })),
                ]}
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
                id={`schools`}
                label={(!hasOrgAdminPermissions ? intl.formatMessage({
                    id: `createUser_schoolsLabel`,
                }) : intl.formatMessage({
                    id: `common.inputField.optional`,
                }, {
                    inputField: intl.formatMessage({
                        id: `createUser_schoolsLabel`,
                    }),
                }))}
                items={allSchools}
                value={schoolIds}
                itemText={(school) => school.name ?? ``}
                itemValue={(school) => school.id}
                selectAllLabel={intl.formatMessage({
                    id: `users_selectAll`,
                })}
                validations={(!hasOrgAdminPermissions ? [
                    required(intl.formatMessage({
                        id: `validation.error.attribute.required`,
                    }, {
                        attribute: attributes.schools,
                    })),
                ]: [])}
                onValidate={!hasOrgAdminPermissions ? setSchoolIdsValid : undefined}
                onChange={setSchoolIds}
            />
            <Accordion
                square
                expanded={isAlternativeContactInfoExpanded}
                onChange={handleAccordionChange}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id="panel1d-header">
                    <FormLabel>{intl.formatMessage({
                        id: `common.contactInfo.alternative`,
                    })}</FormLabel>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={classes.accordionContainer}>
                        <TextField
                            id={`alternativeEmail`}
                            value={alternativeEmail}
                            variant="outlined"
                            label={intl.formatMessage({
                                id: `common.email.alternative`,
                            })}
                            type="text"
                            validations={[
                                max(250, intl.formatMessage({
                                    id: `validation.error.attribute.maxLength`,
                                }, {
                                    attribute: attributes.email,
                                    max: 250,
                                })),
                                email(intl.formatMessage({
                                    id: `validation.error.email.format`,
                                })),
                                ...(contactInfo
                                    ? [
                                        notEquals(contactInfo, intl.formatMessage({
                                            id: `users_alternativeEmailValidation`,
                                        })),
                                    ]
                                    : []),
                            ]}
                            error={errors?.alternativeEmail?.message}
                            onChange={setAlternativeEmail}
                            onValidate={setAlternativeEmailIsValid}
                        />
                    </div>
                </AccordionDetails>
                <AccordionDetails>
                    <div className={classes.accordionContainer}>
                        <TextField
                            id={`alternativePhone`}
                            value={alternativePhone}
                            variant="outlined"
                            label={intl.formatMessage({
                                id: `common.phone.alternative`,
                            })}
                            type="text"
                            validations={[
                                phone(intl.formatMessage({
                                    id: `validation.error.phone.format`,
                                })),
                            ]}
                            error={errors?.alternativePhone?.message}
                            onChange={setAlternativePhone}
                            onValidate={setAlternativePhoneIsValid}
                        />
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
