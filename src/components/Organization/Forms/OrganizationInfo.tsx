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
            margin: `1em 0`,
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
        organizationName,
        shortCode,
        organizationPhone,
        address1,
        address2,
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
                            min(3, intl.formatMessage({
                                id: `addOrganization_shortCodeMinError`,
                            })),
                            max(10, intl.formatMessage({
                                id: `addOrganization_shortCodeMaxError`,
                            })),
                            alphanumeric(),
                        ]}
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
                            min(3, intl.formatMessage({
                                id: `addOrganization_orgNameMinError`,
                            })),
                            max(30, intl.formatMessage({
                                id: `addOrganization_orgNameMaxError`,
                            })),
                            letternumeric(),
                        ]}
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
                            min(10, intl.formatMessage({
                                id: `addOrganization_phoneMinError`,
                            })),
                            max(15, intl.formatMessage({
                                id: `addOrganization_phoneMaxError`,
                            })),
                            phone(),
                        ]}
                        onChange={setPhone}
                        onValidate={setPhoneValid}
                    />
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
                            min(3, intl.formatMessage({
                                id: `addOrganization_address1MinError`,
                            })),
                            max(60, intl.formatMessage({
                                id: `addOrganization_address1MaxError`,
                            })),
                            letternumeric(),
                        ]}
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
                            max(60, intl.formatMessage({
                                id: `addOrganization_address2MaxError`,
                            })),
                            letternumeric(),
                        ]}
                        onChange={setAddress2}
                        onValidate={setAddress2Valid}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}
