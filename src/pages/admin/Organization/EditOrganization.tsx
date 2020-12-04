import { useMutation, useQuery } from "@apollo/client";
import {
    Avatar,
    Button,
    CircularProgress,
    LinearProgress,
} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import { AddPhotoAlternate, Block, Save } from "@material-ui/icons";
import { Alert, AlertTitle } from "@material-ui/lab";
import _get from "lodash/get";
import React, { useEffect, useRef, useState } from "react";
import { SketchPicker } from "react-color";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ORGANIZATION } from "../../../operations/mutations/organization";
import { GET_ORGANIZATION } from "../../../operations/queries/getOrganization";
import { history, ParameterHOC } from "../../../utils/history";
import { constantValues } from "../constants";
import {
    BootstrapInput,
    BootstrapInputDashed,
    useStyles,
} from "./organizationMaterialStyles";

/**
 * Returns function to show Organization Form
 */
export default function Organization() {
    const classes = useStyles();
    const formRef = useRef<HTMLFormElement | null>(null);
    const { organizationId: orgIdParams } = ParameterHOC();
    const [organization_name, setOrganizationName] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [email, setEmail] = useState("");
    const [shortCode, setShortCode] = useState("");
    const [logo, setLogo] = useState<File | string>();
    const [phone, setPhone] = useState("");
    const [success, setSuccess] = useState(false);

    // Apollo
    const [saveOrganization] = useMutation(ORGANIZATION);
    const { data: organization, loading } = useQuery(GET_ORGANIZATION, {
        fetchPolicy: "network-only",
        variables: {
            organization_id: orgIdParams,
        },
    });

    const [logoPreview, setLogoPreview] = useState("");
    const [error, setError] = useState(false);
    const [apolloErrors, setErrors] = useState([]);
    const [serverError, setServerError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [colorPicker, setColorPicker] = useState({
        displayColorPicker: false,
        color: constantValues.colorDefaultPicker,
    });
    const color = colorPicker.color;

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
            return { ...prevState, displayColorPicker: false };
        });
    };

    const handleChange = (color: any) => {
        setColorPicker((prevState: any) => {
            return { ...prevState, color: color.hex };
        });
    };

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setLogo(event.target.files[0]);
            const reader = new FileReader();
            reader.onload = (e: any) => {
                setLogoPreview(e.target.result);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const handleBlurNameOrganization = () => {
        if (organization_name.length < 3) {
            setOrganizationName("");
        } else {
            // getShortCode({ variables: { name: organization_name } });
        }
    };

    const reset = () => {
        return history.push("/admin/allOrganization");
    };

    const onSubmit = async (e: any) => {
        try {
            e.preventDefault();
            setSuccess(false);
            setIsLoading(true);
            setError(false);
            setServerError("");

            const variables = {
                organization_id: orgIdParams,
                organization_name,
                email,
                address1,
                address2: address2.length === 0 ? null : address2,
                phone,
                shortCode,
                logo: logo === logoPreview ? null : logo,
                color,
            };

            const response = await saveOrganization({
                variables,
            });

            if (!response.data.organization.errors) {
                setSuccess(true);
            } else {
                setError(true);
                setErrors(response.data.organization.errors);
                setSuccess(false);
            }
        } catch (e) {
            // System Error
            setError(true);
            setServerError(e.message);
            setSuccess(false);
            setSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (organization && !loading) {
            setOrganizationName(organization.organization.organization_name);
            setAddress1(organization.organization.address1);

            if (organization.organization.address2 === null) {
                setAddress2("");
            } else {
                setAddress2(organization.organization.address2);
            }

            setEmail(_get(organization, "organization.email", ""));
            setLogo(organization.organization.logo);
            setPhone(organization.organization.phone);
            setShortCode(organization.organization.shortCode);
            setLogoPreview(organization.organization.logo);
            setColorPicker((prevState: any) => {
                return {
                    ...prevState,
                    color: organization.organization.color,
                    displayColorPicker: false,
                };
            });
        }
    }, [loading, organization]);

    useEffect(() => {
        if (success) {
            history.push("/admin/allOrganization");
        }
    });

    return (
        <Container component="main" maxWidth="md">
            <div className={classes.paper}>
                {error && (
                    <div className={classes.root}>
                        <Alert severity="error">
                            <AlertTitle>Error at editing organization</AlertTitle>
                            <ul>
                                {apolloErrors.map((e: any) => (
                                    <li key={e.property}>
                                        {e.property} {e.constraint}
                                    </li>
                                ))}
                            </ul>
                            <div>{serverError}</div>
                        </Alert>
                    </div>
                )}
                {loading && <LinearProgress />}
                <form
                    className={classes.form}
                    noValidate
                    ref={formRef}
                    onSubmit={(e) => onSubmit(e)}
                    onReset={() => reset()}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <FormControl className={classes.formControl} error>
                                <label htmlFor="organization_name">
                                    <b>Name of Organization</b>
                                </label>
                                <BootstrapInput
                                    fullWidth
                                    onBlur={handleBlurNameOrganization}
                                    onChange={(e) => {
                                        setOrganizationName(e.target.value);
                                    }}
                                    value={organization_name}
                                    name="organization_name"
                                    id="organization_name"
                                    placeholder={"OFFICIAL NAME OF YOU ORGANIZATION"}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <FormControl className={classes.formControl} error>
                                <label>
                                    <b>Address</b>
                                </label>
                                <br />
                                <BootstrapInput
                                    autoComplete="off"
                                    name="address1"
                                    fullWidth
                                    onChange={(e) => {
                                        setAddress1(e.target.value);
                                    }}
                                    value={address1}
                                    placeholder={"ORGANIZATION ADDRESS"}
                                />
                            </FormControl>

                            <FormControl className={classes.formControl} error>
                                <BootstrapInput
                                    id="address2"
                                    name="address2"
                                    fullWidth
                                    onChange={(e) => {
                                        setAddress2(e.target.value);
                                    }}
                                    value={address2}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormControl className={classes.formControl} error>
                                <label htmlFor="phone">
                                    <b>Phone Number</b>
                                </label>
                                <br />
                                <PhoneInput
                                    onChange={(e) => {
                                        setPhone(e);
                                    }}
                                    value={phone}
                                    inputProps={{
                                        id: "phone",
                                        name: "phone",
                                    }}
                                    enableAreaCodes={true}
                                    onlyCountries={["kr", "us"]}
                                    buttonStyle={{ border: "1px solid #030303" }}
                                    inputStyle={{
                                        border: "1px solid #030303",
                                        height: "42px",
                                        width: "100%",
                                    }}
                                    inputClass={classes.containerPhoneInput}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormControl className={classes.formControl} error>
                                <label htmlFor="email">
                                    <b>Email Address</b>
                                </label>
                                <br />
                                <BootstrapInput
                                    fullWidth
                                    id="email"
                                    name="email"
                                    placeholder={"ORGANIZATION EMAIL"}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    value={email}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl className={classes.formControl} error>
                                <label htmlFor="shortCode">
                                    <b>Organization Short Code</b>
                                </label>
                                <br />
                                <BootstrapInputDashed
                                    fullWidth
                                    id="shortCode"
                                    name="shortCode"
                                    placeholder={"Organization Short Code"}
                                    onChange={(e) => {
                                        setShortCode(e.target.value);
                                    }}
                                    value={shortCode}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormControl className={classes.formControl} error>
                                <label htmlFor="txtOrganizationLogo">
                                    <b>Add Organization Logo</b>
                                </label>
                                <br />
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        position: "relative",
                                    }}
                                >
                                    <input
                                        accept="image/gif, image/jpg, image/jpeg, image/png"
                                        className={classes.fileInput}
                                        id="logo"
                                        name="logo"
                                        onChange={onImageChange}
                                        type="file"
                                    />
                                    <label htmlFor="logo">
                                        <Button
                                            variant="contained"
                                            className={classes.fieldDashed}
                                            component="span"
                                        >
                      Add Organization Logo
                                            <AddPhotoAlternate />
                                        </Button>
                                    </label>
                                    <Avatar
                                        alt="Logo"
                                        src={logoPreview}
                                        className={classes.largeLogoPreview}
                                    />
                                </div>
                            </FormControl>
                        </Grid>

                        <Grid>
                            <FormControl className={classes.formControl}>
                                <label htmlFor="color">
                                    <b>Organization color</b>
                                </label>
                                <br />
                                <div className={classes.orgColorContainer}>
                                    <div className={classes.swatch} onClick={handleClick}>
                                        <div
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                                borderRadius: "2px",
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
                                            <SketchPicker color={color} onChange={handleChange} />
                                        </div>
                                    ) : null}
                                </div>
                            </FormControl>
                        </Grid>

                        <Grid container justify="flex-end">
                            <Grid item sm={2}>
                                <FormControl>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        endIcon={
                                            isLoading ? <CircularProgress size={17} /> : <Save />
                                        }
                                        disabled={isLoading}
                                    >
                    Save
                                    </Button>
                                </FormControl>
                            </Grid>

                            <Grid item sm={2}>
                                <FormControl>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        className={classes.btnCancel}
                                        endIcon={<Block />}
                                        type="reset"
                                    >
                    Cancel
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}
