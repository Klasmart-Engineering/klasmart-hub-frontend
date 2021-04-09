import "react-phone-input-2/lib/material.css";
import { constantValues } from "../constants";
import {
    AddOrganizationLogoLabel,
    AddressLabel,
    CancelButtonLabel,
    EmailAddressLabel,
    NameOfOrganizationLabel,
    OrganizationColorLabel,
    OrganizationShortCodeLabel,
    PhoneNumberLabel,
    SaveButtonLabel,
} from "./Labels";
import {
    BootstrapInput,
    BootstrapInputDashed,
    useStyles,
} from "./organizationMaterialStyles";
import { organizationValidations } from "./organizationValidations";
import { useGetOrganizationMembershipsPermissions } from "@/api/organizationMemberships";
import {
    useAddUserToOrganization,
    useCreateOrganization,
} from "@/api/organizations";
import { userProfileVar } from "@/cache";
import { ActionTypes } from "@/store/actions";
import {
    useCurrentOrganization,
    useOrganizationStack,
} from "@/store/organizationMemberships";
import { history } from "@/utils/history";
import {
    ApolloError,
    useReactiveVar,
} from "@apollo/client";
import {
    Avatar,
    Button,
    CircularProgress,
    FormHelperText,
} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import {
    AddPhotoAlternate,
    Block,
    Save,
} from "@material-ui/icons";
import {
    Alert,
    AlertTitle,
} from "@material-ui/lab";
import { useFormik } from "formik";
import React,
{
    useEffect,
    useRef,
    useState,
} from "react";
import { SketchPicker } from "react-color";
import { useIntl } from "react-intl";
import PhoneInput from "react-phone-input-2";

/**
 * Returns function to show Organization Form
 */
export default function Organization (isDialog: { isDialog?: boolean }) {
    const intl = useIntl();
    const classes = useStyles();
    const formRef = useRef<HTMLFormElement | null>(null);
    const userProfile = useReactiveVar(userProfileVar);
    const [ shortCode, setShortCode ] = useState(``);
    const [ success, setSuccess ] = useState(false);
    const [ logoPreview, setLogoPreview ] = useState(``);
    const [ error, setError ] = useState(false);
    const [ apolloErrors, setErrors ] = useState<ApolloError[]>([]);
    const [ serverError, setServerError ] = useState(``);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ colorPicker, setColorPicker ] = useState({
        displayColorPicker: false,
        color: constantValues.colorDefaultPicker,
    });
    const color = colorPicker.color;
    const [ createOrganization ] = useCreateOrganization();
    const [ addUserToOrg ] = useAddUserToOrganization();
    const [ , setOrganizationStack ] = useOrganizationStack();
    const { refetch: refetchOrganizationMembershipsPermissions } = useGetOrganizationMembershipsPermissions({
        nextFetchPolicy: `network-only`,
    });

    const handleClick = () => {
        setColorPicker((prevState: any) => {
            return {
                ...prevState,
                displayColorPicker: !colorPicker.displayColorPicker,
            };
        });
    };

    const handleClosePicker = () => {
        setColorPicker((prevState: any) => {
            return {
                ...prevState,
                displayColorPicker: false,
            };
        });
    };

    const handleChange = (color: any) => {
        setColorPicker((prevState: any) => {
            return {
                ...prevState,
                color: color.hex,
            };
        });
    };

    const formik = useFormik({
        initialValues: {
            organization_name: ``,
            address1: ``,
            address2: ``,
            email: ``,
            shortCode: ``,
            logo: {},
            color: constantValues.colorDefaultPicker,
            phone: ``,
        },
        enableReinitialize: true,
        validate: organizationValidations,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                setError(false);
                setServerError(``);
                setSuccess(false);
                const createOrganizationResp = await createOrganization({
                    variables: {
                        user_id: userProfile.user_id,
                        organization_name: values.organization_name,
                        email: values.email,
                        address1: values.address1,
                        address2: values.address2,
                        phone: values.phone,
                        shortCode,
                    },
                });
                const errors = createOrganizationResp.data?.user.errors;
                if (errors) {
                    setSuccess(true);
                    setError(true);
                    setErrors(errors);
                    setIsLoading(false);
                    return;
                }
                const createdOrganization = createOrganizationResp.data?.user?.createOrganization;
                if (!createdOrganization) throw Error(`No organization created`);
                const organizationId = createdOrganization?.organization_id ?? ``;
                const organizationMembershipResp = await addUserToOrg({
                    variables: {
                        user_id: userProfile.user_id,
                        organization_id: organizationId,
                    },
                });
                const organizationMembership = organizationMembershipResp.data?.organization.addUser;
                if (!organizationMembership) throw Error(`No organization joined`);
                await refetchOrganizationMembershipsPermissions();
                setSuccess(false);
                setOrganizationStack([ organizationMembership ]);
            } catch (e) {
                const errorMessage =
                    e.message ===
                    `Cannot read property 'organization_id' of null`
                        ? `You have already created an organization`
                        : e.message;
                setError(true);
                setServerError(errorMessage);
                setSuccess(false);
            }
            setIsLoading(false);
        },
    });

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            formik.setFieldValue(`logo`, event.target.files[0]);
            const reader = new FileReader();
            reader.onload = (e: any) => {
                setLogoPreview(e.target.result);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const handleBlurNameOrganization = () => {
        if (formik.values.organization_name.length < 3) {
            formik.setFieldValue(`shortCode`, ``);
        }
    };

    const reset = () => {
        return history.push(`/admin/organizations`);
    };

    const setPhoneFormik = (phone: string) => {
        formik.setFieldValue(`phone`, phone);
    };

    useEffect(() => {
        if (success) {
            history.push(`/admin/organizations`);
        }
    }, [ success ]);

    return (
        <Container
            component="main"
            maxWidth="md">
            <div className={classes.paper}>
                {error && (
                    <div className={classes.root}>
                        <Alert severity="error">
                            <AlertTitle>
                                Error at creating organization
                            </AlertTitle>
                            <ul>
                                {apolloErrors.map((error, i) => (
                                    <li key={`error-${i}`}>
                                        {error.name}: {error.message}
                                    </li>
                                ))}
                            </ul>
                            <div>{serverError}</div>
                        </Alert>
                    </div>
                )}
                <form
                    ref={formRef}
                    noValidate
                    className={classes.form}
                    onSubmit={formik.handleSubmit}
                    onReset={reset}
                >
                    <Grid
                        container
                        spacing={2}>
                        <Grid
                            item
                            xs={12}
                            sm={12}>
                            <FormControl
                                error
                                className={classes.formControl}>
                                <label htmlFor="organization_name">
                                    <b>{NameOfOrganizationLabel()}</b>
                                </label>
                                <BootstrapInput
                                    fullWidth
                                    value={formik.values.organization_name}
                                    name="organization_name"
                                    id="organization_name"
                                    placeholder={intl.formatMessage({
                                        id:
                                            `addOrganization_nameOfOrganizationPlaceholder`,
                                    })}
                                    onBlur={handleBlurNameOrganization}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.organization_name &&
                                formik.errors.organization_name ? (
                                        <FormHelperText>
                                            {formik.errors.organization_name}
                                        </FormHelperText>
                                    ) : null}
                            </FormControl>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={12}>
                            <FormControl
                                error
                                className={classes.formControl}>
                                <label>
                                    <b>{AddressLabel()}</b>
                                </label>
                                <br />
                                <BootstrapInput
                                    fullWidth
                                    autoComplete="off"
                                    name="address1"
                                    value={formik.values.address1}
                                    placeholder={intl.formatMessage({
                                        id:
                                            `addOrganization_addressPlaceholder`,
                                    })}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.address1 &&
                                formik.errors.address1 ? (
                                        <FormHelperText>
                                            {formik.errors.address1}
                                        </FormHelperText>
                                    ) : null}
                            </FormControl>

                            <FormControl
                                error
                                className={classes.formControl}>
                                <BootstrapInput
                                    fullWidth
                                    id="address2"
                                    name="address2"
                                    value={formik.values.address2}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.address2 &&
                                formik.errors.address2 ? (
                                        <FormHelperText>
                                            {formik.errors.address2}
                                        </FormHelperText>
                                    ) : null}
                            </FormControl>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={4}>
                            <FormControl
                                error
                                className={classes.formControl}>
                                <label
                                    htmlFor="phone"
                                    style={{
                                        paddingBottom: 20,
                                    }}>
                                    <b>{PhoneNumberLabel()}</b>
                                </label>
                                <PhoneInput
                                    value={formik.values.phone}
                                    inputProps={{
                                        id: `phone`,
                                        name: `phone`,
                                    }}
                                    preferredCountries={[
                                        `cn`,
                                        `gb`,
                                        `id`,
                                        `kr`,
                                        `vn`,
                                        `us`,
                                    ]}
                                    buttonStyle={{
                                        border: `1px solid #030303`,
                                    }}
                                    inputStyle={{
                                        border: `1px solid #030303`,
                                        height: `42px`,
                                        width: `100%`,
                                    }}
                                    inputClass={classes.containerPhoneInput}
                                    specialLabel=""
                                    placeholder="Phone Number"
                                    onChange={(value) => setPhoneFormik(value)}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.phone && formik.errors.phone ? (
                                    <FormHelperText>
                                        {formik.errors.phone}
                                    </FormHelperText>
                                ) : null}
                            </FormControl>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={4}>
                            <FormControl
                                error
                                className={classes.formControl}>
                                <label htmlFor="email">
                                    <b>{EmailAddressLabel()}</b>
                                </label>
                                <br />
                                <BootstrapInput
                                    fullWidth
                                    id="email"
                                    name="email"
                                    placeholder={intl.formatMessage({
                                        id:
                                            `addOrganization_emailAddressPlaceholder`,
                                    })}
                                    value={formik.values.email}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <FormHelperText>
                                        {formik.errors.email}
                                    </FormHelperText>
                                ) : null}
                            </FormControl>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}>
                            <FormControl
                                error
                                className={classes.formControl}>
                                <label htmlFor="shortCode">
                                    <b>{OrganizationShortCodeLabel()}</b>
                                </label>
                                <br />
                                <BootstrapInputDashed
                                    fullWidth
                                    id="shortCode"
                                    name="shortCode"
                                    placeholder={intl.formatMessage({
                                        id:
                                            `addOrganization_organizationShortCodePlaceholder`,
                                    })}
                                    value={shortCode}
                                    onChange={(e) => {
                                        setShortCode(e.target.value);
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid>
                            <FormControl
                                error
                                className={classes.formControl}>
                                <label htmlFor="txtOrganizationLogo">
                                    <b>{AddOrganizationLogoLabel()}</b>
                                </label>
                                <br />
                                <div
                                    style={{
                                        display: `flex`,
                                        alignItems: `center`,
                                        justifyContent: `space-around`,
                                    }}
                                >
                                    <div>
                                        <input
                                            accept="image/gif, image/jpg, image/jpeg, image/png"
                                            className={classes.fileInput}
                                            id="logo"
                                            name="logo"
                                            type="file"
                                            onChange={onImageChange}
                                        />

                                        <label htmlFor="logo">
                                            <Button
                                                variant="contained"
                                                className={classes.fieldDashed}
                                                component="span"
                                            >
                                                {AddOrganizationLogoLabel()}
                                                <AddPhotoAlternate />
                                            </Button>
                                        </label>
                                    </div>
                                    <div
                                        style={{
                                            padding: `5px`,
                                        }}
                                    >
                                        <div>
                                            <Avatar
                                                alt="Logo"
                                                src={logoPreview}
                                                className={
                                                    classes.largeLogoPreview
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                {formik.touched.logo && formik.errors.logo ? (
                                    <FormHelperText>
                                        {formik.errors.logo}
                                    </FormHelperText>
                                ) : null}
                            </FormControl>
                        </Grid>
                        <Grid>
                            <FormControl className={classes.formControl}>
                                <label htmlFor="color">
                                    <b>{OrganizationColorLabel()}</b>
                                </label>
                                <br />
                                <div className={classes.orgColorContainer}>
                                    <div
                                        className={classes.swatch}
                                        onClick={handleClick}
                                    >
                                        <div
                                            style={{
                                                width: `30px`,
                                                height: `30px`,
                                                borderRadius: `2px`,
                                                background: `${color}`,
                                            }}
                                        />
                                    </div>

                                    {colorPicker.displayColorPicker ? (
                                        <div className={classes.popover}>
                                            <div
                                                className={classes.cover}
                                                onClick={handleClosePicker}
                                            />
                                            <SketchPicker
                                                color={color}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            </FormControl>
                        </Grid>

                        <Grid
                            container
                            justify="flex-end">
                            <div
                                style={{
                                    display: `flex`,
                                    alignItems: `center`,
                                    padding: `5px`,
                                    justifyContent: `space-around`,
                                }}
                            >
                                <div
                                    style={{
                                        padding: `2px`,
                                    }}
                                >
                                    <FormControl>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            endIcon={
                                                isLoading ? (
                                                    <CircularProgress
                                                        size={17}
                                                    />
                                                ) : (
                                                    <Save />
                                                )
                                            }
                                            disabled={isLoading}
                                        >
                                            {SaveButtonLabel()}
                                        </Button>
                                    </FormControl>
                                </div>

                                <div
                                    style={{
                                        padding: `2px`,
                                    }}
                                >
                                    { !isDialog &&
                                        <FormControl>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="large"
                                                className={classes.btnCancel}
                                                endIcon={<Block />}
                                                type="reset"
                                            >
                                                {CancelButtonLabel()}
                                            </Button>
                                        </FormControl>
                                    }
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}
