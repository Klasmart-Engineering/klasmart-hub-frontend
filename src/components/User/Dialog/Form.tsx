import { useGetOrganizationRoles } from "@/api/roles";
import { useGetPaginatedSchools } from "@/api/schools";
import { SchoolRow } from "@/components/School/Table";
import { buildOrganizationSchoolFilter } from "@/operations/queries/getPaginatedOrganizationSchools";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { FormErrors } from "@/types/form";
import { isActive } from "@/types/graphQL";
import { usePermission } from "@/utils/permissions";
import { mapSchoolNodeToSchoolRow } from "@/utils/schools";
import { UserGenders } from "@/utils/users";
import { useValidations } from "@/utils/validations";
import {
    ComboBox,
    TextField,
} from "@kl-engineering/kidsloop-px";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    TextField as MUITextField,
    Theme,
} from "@mui/material";
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs,
{ type Dayjs } from "dayjs";
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
            width: `100%`,
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

export interface FilterValueOption {
    value: string;
    label: string;
}
export interface State {
    givenName: string;
    familyName: string;
    contactInfo: string;
    birthday: string;
    shortcode: string;
    gender: string;
    roles: FilterValueOption[];
    schools: FilterValueOption[];
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

export interface Errors extends FormErrors<State> { }

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
    const [ birthdayErrorMessge, setBirthdayErrorMessage ] = useState<string | null>(null);
    const [ allSchools, setAllSchools ] = useState<SchoolRow[]>([]);
    const { data: schoolsData, refetch: refetchSchoolsData } = useGetPaginatedSchools({
        variables: {
            direction: `FORWARD`,
            orderBy: `name`,
            order: `ASC`,
            count: 50,
            filter: buildOrganizationSchoolFilter({
                organizationId: organizationId,
                search: ``,
            }),
        },
        fetchPolicy: `no-cache`,
        skip: !organizationId,
    });
    const { data: organizationData, refetch: refetchOrganizationRoles } = useGetOrganizationRoles({
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
    const minDateAllowed = dayjs()
        .subtract(100, `year`)
        .toDate();

    useEffect(() => {
        refetchSchoolsData({
            direction: `FORWARD`,
            orderBy: `name`,
            order: `ASC`,
            filter: buildOrganizationSchoolFilter({
                organizationId: organizationId,
                search: ``,
            }),
        });
        refetchOrganizationRoles({
            organization_id: organizationId,
        });

    }, [ organizationId ]);

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
            roles: availableRoles.filter((role) => roleIds.map((id) => id.value)
                .includes(role.role_id))
                .map((role) => ({
                    value: role?.role_id,
                    label: role?.role_name,
                })) ?? [],
            schools: allSchools
                .filter((school) => schoolIds.map((id) => id.value)
                    .includes(school.id))
                .map((school) =>
                    ({
                        value: school.id,
                        label: school.name,
                    })),
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
        allSchools,
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

    useEffect(() => {
        const schools = schoolsData?.schoolsConnection?.edges
            .map((edge) => mapSchoolNodeToSchoolRow(edge.node))
            ?? [];

        setAllSchools((values) => ([ ...values, ...schools ]));

        if (schoolsData?.schoolsConnection?.pageInfo?.hasNextPage) {
            refetchSchoolsData({
                cursor: schoolsData?.schoolsConnection?.pageInfo?.endCursor ?? ``,
            });
        }
    }, [
        schoolsData,
        setAllSchools,
        refetchSchoolsData,
    ]);

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

    const handleBirthday = (value: Dayjs) => {
        const validBefore = beforeDate(today)(value?.toDate());
        const validAfter = afterDate(minDateAllowed)(value?.toDate());
        setBirthdayIsValid(validBefore === true && validAfter === true);
        const errorMessage = validBefore === true && validAfter === true ? null : validBefore !== true ? validBefore : validAfter;
        setBirthdayErrorMessage(errorMessage);
        setBirthday(value?.format(`YYYY-MM`));
    };

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

    return (loading ? null :
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
                <DatePicker
                    label={intl.formatMessage({
                        id: `user.birthday`,
                    })}
                    openTo="year"
                    minDate={dayjs()
                        .subtract(100, `year`)
                    }
                    maxDate={dayjs()}
                    views={[ `year`, `month` ]}
                    value={birthday}
                    renderInput={(params) =>
                        (<MUITextField
                            {...params}
                            helperText={birthdayErrorMessge ? birthdayErrorMessge : undefined}
                        />)
                    }
                    onChange={handleBirthday}
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
                    onChange={handleGenderChange}
                >
                    <FormControlLabel
                        value={UserGenders.FEMALE}
                        control={<Radio />}
                        label={intl.formatMessage({
                            id: `user.gender.female`,
                        })}
                    />
                    <FormControlLabel
                        value={UserGenders.MALE}
                        control={<Radio />}
                        label={intl.formatMessage({
                            id: `user.gender.male`,
                        })}
                    />
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
                        })}
                    />
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
            <ComboBox
                multiple
                fullWidth
                id={`roles`}
                label={intl.formatMessage({
                    id: `createUser_rolesLabel`,
                })}
                options={availableRoles.map(roles => ({
                    value: roles.role_id,
                    label: roles.role_name,
                }))}
                value={roleIds}
                selectValidations={[
                    required(intl.formatMessage({
                        id: `validation.error.attribute.required`,
                    }, {
                        attribute: attributes.schools,
                    })),
                ]}
                onChange={setRoleIds}
                onValidate={setSchoolIdsValid}
            />
            <ComboBox
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
                options={allSchools.map(schools => ({
                    value: schools.id,
                    label: schools.name,
                }))}
                value={schoolIds}
                selectValidations={(!hasOrgAdminPermissions ? [
                    required(intl.formatMessage({
                        id: `validation.error.attribute.required`,
                    }, {
                        attribute: attributes.schools,
                    })),
                ] : [])}
                onChange={setSchoolIds}
                onValidate={!hasOrgAdminPermissions ? setSchoolIdsValid : undefined}
            />
            <Accordion
                square
                expanded={isAlternativeContactInfoExpanded}
                onChange={handleAccordionChange}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id="panel1d-header"
                >
                    <FormLabel>{intl.formatMessage({
                        id: `common.contactInfo.alternative`,
                    })}
                    </FormLabel>
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
