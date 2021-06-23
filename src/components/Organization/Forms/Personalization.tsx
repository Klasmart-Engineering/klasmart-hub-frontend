import { useOrganizationStack } from "@/store/organizationMemberships";
import { Organization } from "@/types/graphQL";
import { useValidations } from "@/utils/validations";
import {
    FormHelperText,
    Grid,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import {
    Button,
    FileInputButton,
    ImagePicker,
    OrganizationAvatar,
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
            margin: theme.spacing(1, 0),
        },
        logoPicker: {
            display: `flex`,
            flexDirection: `column`,
        },
        fileInput: {
            display: `none`,
            borderStyle: `dashed`,
        },
        fileInputControls: {
            display: `flex`,
            alignItems: `center`,
            margin: theme.spacing(1, 0),
        },
        imageSelectErrorMessage: {
            height: `1em`,
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
    const [ color, setColor ] = useState(`79d2bc`);
    const [ colorValid, setColorValid ] = useState(false);
    const [ tempOrganizationLogo, setTempOrganizationLogo ] = useState(new File([ `` ], `emptyFile`));
    const [ organizationLogoPreview, setOrganizationLogoPreview ] = useState(``);
    const [ imageToBeCropped, setImageToBeCropped ] = useState(``);
    const [ isCropperOpen, setIsCropperOpen ] = useState(false);
    const [ imageSelectError, setImageSelectError ] = useState(` `);

    const [ organizationMembershipStack ] = useOrganizationStack();

    const memberships = organizationMembershipStack.slice();
    const currentOrganizationMembership = memberships[0];
    const organizationName = currentOrganizationMembership?.organization?.organization_name ?? ``;

    const onImageChange = (file: File) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                setImageToBeCropped(e.target?.result);
            };
            reader.readAsDataURL(file);
            setIsCropperOpen(true);
            setImageSelectError(``);
        }
    };

    const removeLogoPreview = () => {
        setOrganizationLogoPreview(``);
        setTempOrganizationLogo(new File([ `` ], `emptyFile`));
        setImageToBeCropped(``);
    };

    const imageSelectErrorMessages = {
        noFileError: intl.formatMessage({
            id: `addOrganization_noFileFound`,
        }),
        fileSizeTooBigError: intl.formatMessage({
            id: `addOrganization_imagePickerImageTooLargeError`,
        }, {
            fileSize: `2MB`,
        }),
        wrongFileTypeUploadError: intl.formatMessage({
            id: `addOrganization_imagePickerWrongFormatError`,
        }),
    };

    useEffect(() => {
        if (!value.color) return;
        setColor(value.color);
    }, [ value ]);

    useEffect(() => {
        const updatedOrganizationState: Organization = {
            ...value,
            color,
            organizationLogo: tempOrganizationLogo,
        };
        onChange(updatedOrganizationState);
    }, [ color, tempOrganizationLogo ]);

    return (
        <>
            <Grid
                item
                xs={12}
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
                        sm={8}
                    >
                        <Grid
                            container
                            className={classes.logoPicker}
                        >
                            <OrganizationAvatar
                                name={organizationName}
                                size="large"
                                src={organizationLogoPreview}
                            />
                            <div className={classes.fileInputControls}>
                                {!organizationLogoPreview ? (
                                    <FileInputButton
                                        label={intl.formatMessage({
                                            id: `addOrganization_selectImageLabel`,
                                        })}
                                        accept={[
                                            `image/jpg`,
                                            `image/jpeg`,
                                            `image/png`,
                                        ]}
                                        errorMessages={imageSelectErrorMessages}
                                        onFileChange={onImageChange}
                                        onError={setImageSelectError}
                                    />
                                ) : (
                                    <Button
                                        label={intl.formatMessage({
                                            id: `addOrganization_removeImageLabel`,
                                        })}
                                        variant="outlined"
                                        color="error"
                                        size="large"
                                        onClick={removeLogoPreview}
                                    />
                                )}
                            </div>
                            <div className={classes.imageSelectErrorMessage}>
                                <FormHelperText error>
                                    {imageSelectError ?? ` `}
                                </FormHelperText>
                            </div>
                        </Grid>
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
                            id="orgColor"
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
            <ImagePicker
                isZoomDisabled={false}
                isRotationDisabled={false}
                imageToBeCropped={imageToBeCropped}
                dialogTitle={intl.formatMessage({
                    id: `addOrganization_imagePickerDialogTitle`,
                })}
                isCropperOpen={isCropperOpen}
                zoomLabel={intl.formatMessage({
                    id: `addOrganization_imagePickerZoomLabel`,
                })}
                rotateLabel={intl.formatMessage({
                    id: `addOrganization_imagePickerRotateLabel`,
                })}
                cancelLabel={intl.formatMessage({
                    id: `addOrganization_imagePickerCancelLabel`,
                })}
                okLabel={intl.formatMessage({
                    id: `addOrganization_imagePickerOkLabel`,
                })}
                aspect={4 / 4}
                onCancelCrop={() => setIsCropperOpen(false)}
                onImageCropComplete={image => {
                    setOrganizationLogoPreview(image.base64);
                    setTempOrganizationLogo(image.file);
                    setIsCropperOpen(false);
                }}
                onError={setImageSelectError}
            />
        </>
    );
}
