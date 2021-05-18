import { Organization } from "@/types/graphQL";
import { useValidations } from "@/utils/validations";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import {
    Button,
    TextField,
} from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";
import { SliderPicker } from 'react-color';
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
        fileInput: {
            display: `none`,
            borderStyle: `dashed`,
        },
        logoPreview: {
            border: `1px dashed ${theme.palette.grey[300]}`,
            width: `100%`,
            minWidth: `100%`,
            minHeight: `5em`,
            margin: `1em 0`,
        },
    }));

interface Props {
    value: Organization;
    onChange: (value: Organization) => void;
    onValidation: (valid: boolean) => void;
}

export default function Personalization (props: Props) {
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
        letternumeric,
    } = useValidations();
    const [ alternateText, setAlternateText ] = useState(``);
    const [ alternateTextValid, setAlternateTextValid ] = useState(false);
    const [ color, setColor ] = useState(`#79d2bc`);
    const [ colorValid, setColorValid ] = useState(false);
    const [ organizationLogo, setOrganizationLogo ] = useState<File>();
    const [ organizationLogoPreview, setOrganizationLogoPreview ] = useState();

    const altTextValidations = organizationLogo ? [
        letternumeric(),
        required(organizationLogo),
        min(3, `Alternate text must have a minimum of 3 characters`),
        max(15, `Alternate text must have a maximum of 15 characters`),
    ] : [];

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setOrganizationLogo(event.target.files[0]);
            const reader = new FileReader();
            reader.onload = (e: any) => {
                setOrganizationLogoPreview(e.target.result);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    useEffect(() => {
        if (!value) return;
        setAlternateText(value.alternateText ?? ``);

        if (!value.color) return;
        setColor(value.color);
    }, [ value ]);

    // useEffect(() => {
    //     onValidation([ alternateTextValid, colorValid ].every((value) => value));
    // }, [ alternateTextValid, colorValid ]);

    useEffect(() => {
        const updatedOrganizationState: Organization = {
            ...value,
            alternateText,
            color,
            organizationLogo,
        };
        onChange(updatedOrganizationState);
    }, [
        alternateText,
        color,
        organizationLogo,
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
                        id="addOrganization_logo"
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={4}
                >
                    <img
                        src={organizationLogoPreview}
                        className={classes.logoPreview}
                    />
                    <Typography variant="caption">
                        <FormattedMessage
                            id="addOrganization_imageFormat"
                        />
                    </Typography>
                    {/* <input
                        accept="image/gif, image/jpg, image/jpeg, image/png"
                        className={classes.fileInput}
                        id="logo"
                        name="logo"
                        type="file"
                    /> */}
                    <label htmlFor="logo">
                        <Button
                            disabled
                            label="SELECT FILE TO UPLOAD"
                            variant="contained"
                            color="primary"
                            size="large"
                        />
                    </label>
                    <TextField
                        fullWidth
                        disabled
                        variant="standard"
                        label={intl.formatMessage({
                            id: `addOrganization_alternateTextLabel`,
                        })}
                        validations={altTextValidations}
                        value={alternateText}
                        className={classes.formInput}
                        onChange={setAlternateText}
                        onValidate={setAlternateTextValid}
                    />
                    <Typography variant="caption">
                        <FormattedMessage
                            id="addOrganization_alternateText"
                        />
                    </Typography>
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
                        id="addOrganization_organizationColorLabel"
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={4}
                >
                    <TextField
                        fullWidth
                        disabled
                        variant="standard"
                        value={color}
                        className={classes.formInput}
                        onChange={setColor}
                        onValidate={setColorValid}
                    />
                    <SliderPicker
                        color={ color }
                        onChange={(color) => setColor(color.hex)}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}
