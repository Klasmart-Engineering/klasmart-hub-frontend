import { PRIMARY_THEME_COLOR as THEME_PRIMARY_COLOR } from "@/theme/utils/utils";
import { Organization } from "@/types/graphQL";
import {
    Button,
    ColorPicker,
    FileInputButton,
    ImagePicker,
    OrganizationAvatar,
    utils,
} from "@kl-engineering/kidsloop-px";
import { CroppedImage } from "@kl-engineering/kidsloop-px/dist/src/components/ImagePicker/ImagePicker";
import {
    FormHelperText,
    Grid,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
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
            margin: theme.spacing(1, 0),
        },
        logoPicker: {
            display: `flex`,
            flexDirection: `column`,
            alignItems: `flex-start`,
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
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const [ tempOrganizationLogo, setTempOrganizationLogo ] = useState<CroppedImage>();
    const [ organizationLogoPreview, setOrganizationLogoPreview ] = useState<string | null>(null);
    const [ imageToBeCropped, setImageToBeCropped ] = useState(``);
    const [ isCropperOpen, setIsCropperOpen ] = useState(false);
    const [ imageSelectError, setImageSelectError ] = useState(``);

    const [ previewOrganizationColor, setPreviewOrganizationColor ] = useState(value?.branding?.primaryColor || THEME_PRIMARY_COLOR);
    const organizationName = value.organization_name;

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
        setOrganizationLogoPreview(null);
        setTempOrganizationLogo(undefined);
        setImageToBeCropped(``);
    };

    useEffect(() => {
        setOrganizationLogoPreview(tempOrganizationLogo ? tempOrganizationLogo.base64 : null);
    }, [ tempOrganizationLogo ]);

    useEffect(() => {
        setOrganizationLogoPreview(tempOrganizationLogo ? tempOrganizationLogo.base64 : (value.branding?.iconImageURL ?? ``));
        setPreviewOrganizationColor(value?.branding?.primaryColor || THEME_PRIMARY_COLOR);
    }, [ value ]);

    const handleColorChange = (color: string) => {
        setPreviewOrganizationColor(color || THEME_PRIMARY_COLOR);
    };

    useEffect(() => {
        const updatedOrganizationState: Organization = {
            ...value,
            branding: {
                iconImageURL: value.branding?.iconImageURL ?? ``,
                primaryColor: previewOrganizationColor ?? ``,
            },
            setBranding: {
                iconImage: organizationLogoPreview === null ? null : tempOrganizationLogo?.file,
                primaryColor: previewOrganizationColor,
            },
        };
        onChange(updatedOrganizationState);
    }, [
        previewOrganizationColor,
        tempOrganizationLogo,
        organizationLogoPreview,
    ]);

    useEffect(() => {
        setPreviewOrganizationColor(value.branding?.primaryColor ?? (value.organization_name ? utils.stringToColor(value.organization_name) : THEME_PRIMARY_COLOR));
        return () => setPreviewOrganizationColor(undefined);
    }, []);

    return (<>
        <Grid
            item
            xs={12}
            justifyContent="space-between"
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
                            color={previewOrganizationColor}
                            src={organizationLogoPreview ?? undefined}
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
                                    errorMessages={{
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
                                    }}
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
                    <ColorPicker
                        hideHelperText
                        fullWidth
                        value={previewOrganizationColor}
                        label="Color"
                        variant="standard"
                        defaultButtonLabel="Default"
                        defaultColor={THEME_PRIMARY_COLOR}
                        onChange={handleColorChange}
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
            aspect={1 / 1}
            onCancelCrop={() => setIsCropperOpen(false)}
            onImageCropComplete={(image) => {
                setOrganizationLogoPreview(image.base64);
                setTempOrganizationLogo(image);
                setIsCropperOpen(false);
            }}
            onError={setImageSelectError}
        />
    </>);
}
