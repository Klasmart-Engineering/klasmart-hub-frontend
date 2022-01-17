import {
    ORGANIZATION_ADDRESS1_LENGTH_MAX,
    ORGANIZATION_ADDRESS1_LENGTH_MIN,
    ORGANIZATION_ADDRESS2_LENGTH_MAX,
    ORGANIZATION_NAME_LENGTH_MAX,
    ORGANIZATION_NAME_LENGTH_MIN,
    ORGANIZATION_PHONE_LENGTH_MAX,
    ORGANIZATION_PHONE_LENGTH_MIN,
    ORGANIZATION_SHORTCODE_LENGTH_MAX,
    ORGANIZATION_SHORTCODE_LENGTH_MIN,
} from "@/config/index";
import { Organization } from "@/types/graphQL";
import { useValidations } from "@/utils/validations";
import Grid from "@material-ui/core/Grid";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import { TextField } from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cardBody: {
            padding: theme.spacing(2, 4),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(2, 2),
            },
        },
        cardBodyRow: {
            marginBottom: `3em`,
        },
        formInput: {
            [theme.breakpoints.down(`xs`)]: {
                margin: `1em 0`,
            },
        },
    }));

interface Props {
    value: Organization;
    onChange: (value: Organization) => void;
    onValidation: (valid: boolean) => void;
}

export default function OrganizationInfo (props: Props) {
    const {
        value,
        onChange,
        onValidation,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const {
        required,
        min,
        max,
        //email,
        alphanumeric,
        letternumeric,
        phone,
    } = useValidations();
    const [ organizationName, setOrganizationName ] = useState(``);
    const [ organizationNameValid, setOrganizationNameValid ] = useState(true);
    const [ shortCode, setShortCode ] = useState(``);
    const [ shortCodeValid, setShortCodeValid ] = useState(true);
    const [ organizationPhone, setPhone ] = useState(``);
    const [ organizationPhoneValid, setPhoneValid ] = useState(true);
    const [ address1, setAddress1 ] = useState(``);
    const [ address1Valid, setAddress1Valid ] = useState(true);
    const [ address2, setAddress2 ] = useState(``);
    const [ address2Valid, setAddress2Valid ] = useState(true);
    //const [ email, setEmail ] = useState(``);

    useEffect(() => {
        if (!value) return;

        setOrganizationName(value.organization_name);
        setShortCode(value.shortCode ?? ``);
        setPhone(value.phone ?? ``);
        setAddress1(value.address1 ?? ``);
        setAddress2(value.address2 ?? ``);
    }, [ value ]);

    useEffect(() => {
        onValidation([
            organizationNameValid,
            shortCodeValid,
            organizationPhoneValid,
            address1Valid,
            address2Valid,
        ].every((value) => value));
    }, [
        organizationNameValid,
        shortCodeValid,
        organizationPhoneValid,
        address1Valid,
        address2Valid,
    ]);

    useEffect(() => {
        const updatedOrganizationState: Organization = {
            ...value,
            organization_name: organizationName,
            shortCode,
            phone: organizationPhone,
            address1,
            address2,
        };
        onChange(updatedOrganizationState);
    }, [
        organizationName,
        shortCode,
        organizationPhone,
        address1,
        address2,
    ]);

    return (
        <Grid
            container
            justify="space-between"
            className={classes.cardBody}
        >
            <Grid
                container
                className={classes.cardBodyRow}
            >
                <Grid
                    item
                    xs={12}
                    sm={4}
                >
                    <FormattedMessage
                        id="addOrganization_shortCode"
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={4}
                >
                    <TextField
                        fullWidth
                        variant="standard"
                        label={intl.formatMessage({
                            id: `addOrganization_shortCode`,
                        })}
                        value={shortCode}
                        className={classes.formInput}
                        validations={[
                            required(),
                            alphanumeric(),
                            min(ORGANIZATION_SHORTCODE_LENGTH_MIN, intl.formatMessage({
                                id: `validation.error.organization.shortcode.minLength`,
                            }, {
                                value: ORGANIZATION_SHORTCODE_LENGTH_MIN,
                            })),
                            max(ORGANIZATION_SHORTCODE_LENGTH_MAX, intl.formatMessage({
                                id: `validation.error.organization.shortcode.maxLength`,
                            }, {
                                value: ORGANIZATION_SHORTCODE_LENGTH_MAX,
                            })),
                        ]}
                        id="shortCode"
                        onChange={setShortCode}
                        onValidate={setShortCodeValid}
                    />
                </Grid>
            </Grid>
            <Grid
                container
                className={classes.cardBodyRow}
            >
                <Grid
                    item
                    xs={12}
                    sm={4}
                >
                    <FormattedMessage
                        id="allOrganization_organizationName"
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={4}
                >
                    <TextField
                        fullWidth
                        label={intl.formatMessage({
                            id: `allOrganization_organizationName`,
                        })}
                        variant="standard"
                        value={organizationName}
                        className={classes.formInput}
                        validations={[
                            required(),
                            letternumeric(),
                            min(ORGANIZATION_NAME_LENGTH_MIN, intl.formatMessage({
                                id: `validation.error.organization.name.minLength`,
                            }, {
                                value: ORGANIZATION_NAME_LENGTH_MIN,
                            })),
                            max(ORGANIZATION_NAME_LENGTH_MAX, intl.formatMessage({
                                id: `validation.error.organization.name.maxLength`,
                            }, {
                                value: ORGANIZATION_NAME_LENGTH_MAX,
                            })),
                        ]}
                        id="orgName"
                        onChange={setOrganizationName}
                        onValidate={setOrganizationNameValid}
                    />
                </Grid>
            </Grid>
            <Grid
                container
                className={classes.cardBodyRow}
            >
                <Grid
                    item
                    xs={12}
                    sm={4}
                >
                    <FormattedMessage
                        id="addOrganization_contactInfo"
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={4}
                    direction="column"
                >
                    {/* <TextField
                        fullWidth
                        label="Email Address"
                        value={email}
                        name="email"
                        id="email"
                        className={classes.formInput}
                        validations={[
                            email(),
                            required(),
                            min(3, `The email address must have a minimum of 3 characters`),
                            max(50, `The email address must have a maximum of 50 characters`),
                        ]}
                        onChange={setEmail}
                    /> */}
                    <TextField
                        fullWidth
                        variant="standard"
                        label={intl.formatMessage({
                            id: `addOrganization_phoneNumberLabel`,
                        })}
                        value={organizationPhone}
                        className={classes.formInput}
                        validations={[
                            required(),
                            min(ORGANIZATION_PHONE_LENGTH_MIN, intl.formatMessage({
                                id: `validation.error.organization.phone.minLength`,
                            }, {
                                value: ORGANIZATION_PHONE_LENGTH_MIN,
                            })),
                            phone(),
                            max(ORGANIZATION_PHONE_LENGTH_MAX, intl.formatMessage({
                                id: `validation.error.organization.phone.maxLength`,
                            }, {
                                value: ORGANIZATION_PHONE_LENGTH_MAX,
                            })),
                        ]}
                        id="phoneNumber"
                        onChange={setPhone}
                        onValidate={setPhoneValid}
                    />
                </Grid>
            </Grid>
            <Grid
                container
                className={classes.cardBodyRow}
            >
                <Grid
                    item
                    xs={12}
                    sm={4}
                >
                    <FormattedMessage
                        id="addOrganization_address"
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={4}
                    direction="column"
                >
                    <TextField
                        fullWidth
                        variant="standard"
                        label={intl.formatMessage({
                            id: `addOrganization_addressLabel1`,
                        })}
                        value={address1}
                        className={classes.formInput}
                        validations={[
                            required(),
                            letternumeric(),
                            min(ORGANIZATION_ADDRESS1_LENGTH_MIN, intl.formatMessage({
                                id: `validation.error.organization.address1.minLength`,
                            }, {
                                value: ORGANIZATION_ADDRESS1_LENGTH_MIN,
                            })),
                            max(ORGANIZATION_ADDRESS1_LENGTH_MAX, intl.formatMessage({
                                id: `validation.error.organization.address1.maxLength`,
                            }, {
                                value: ORGANIZATION_ADDRESS1_LENGTH_MAX,
                            })),
                        ]}
                        id="addressOne"
                        onChange={setAddress1}
                        onValidate={setAddress1Valid}
                    />
                    <TextField
                        fullWidth
                        variant="standard"
                        label={intl.formatMessage({
                            id: `addOrganization_addressLabel2`,
                        })}
                        value={address2}
                        className={classes.formInput}
                        validations={[
                            letternumeric(),
                            max(ORGANIZATION_ADDRESS2_LENGTH_MAX, intl.formatMessage({
                                id: `validation.error.organization.address2.maxLength`,
                            }, {
                                value: ORGANIZATION_ADDRESS2_LENGTH_MAX,
                            })),
                        ]}
                        id="addressTwo"
                        onChange={setAddress2}
                        onValidate={setAddress2Valid}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}
