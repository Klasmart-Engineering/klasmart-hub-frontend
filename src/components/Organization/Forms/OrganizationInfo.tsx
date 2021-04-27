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
        setShortCode(value.shortCode);
        setPhone(value.phone);
        setAddress1(value.address1);
        setAddress2(value.address2);
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
                        id="addOrganization_organizationShortCodeLabel"
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
                            id: `addOrganization_organizationShortCodeLabel`,
                        })}
                        value={shortCode}
                        className={classes.formInput}
                        validations={[
                            alphanumeric(),
                            required(),
                            min(3, `Shortcode must have a minimum of 3 characters`),
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
                        id="addOrganization_nameOfOrganizationLabel"
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
                            id: `addOrganization_nameOfOrganizationLabel`,
                        })}
                        variant="standard"
                        value={organizationName}
                        className={classes.formInput}
                        validations={[
                            letternumeric(),
                            required(),
                            min(3, `The Organisation Name must have a minimum of 3 characters`),
                            max(30, `The Organisation Name must have a maximum of 30 characters`),
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
                            phone(),
                            required(),
                            min(10, `The phone number must have a minimum of 10 characters`),
                            max(15, `The phone number must have a maximum of 15 characters`),
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
                            letternumeric(),
                            required(),
                            min(3, `The first address must have a minimum of 3 characters`),
                            max(30, `The first address must have a maximum of 60 characters`),
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
                            letternumeric(),
                            required(),
                            min(3, `The second address must have a minimum of 3 characters`),
                            max(30, `The second address must have a maximum of 60 characters`),
                        ]}
                        onChange={setAddress2}
                        onValidate={setAddress2Valid}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}
