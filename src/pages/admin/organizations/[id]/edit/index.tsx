import { useQueryMyUser } from "@/api/myUser";
import {
    useDeleteOrganizationBrandingImage,
    useDeleteOrganizationBrandingPrimaryColor,
    useGetOrganization,
    useSaveOrganization,
    useSetOrganizationBranding,
} from "@/api/organizations";
import OrganizationForm,
{ OrganizationTabName } from '@/components/Organization/Form';
import { OrganizationTab } from "@/types/graphQL";
import { history } from "@/utils/history";
import { buildEmptyOrganization } from "@/utils/organization";
import {
    Box,
    Grid,
} from "@mui/material";
import Container from "@mui/material/Container";
import { Theme } from "@mui/material/styles";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import {
    Button,
    Card,
    Tabs,
} from "kidsloop-px";
import { useSnackbar } from "notistack";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cardHead: {
            padding: theme.spacing(0, 4),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(1, 2),
            },
            borderBottom: `1px solid ${theme.palette.grey[300]}`,
        },
        cardBody: {
            padding: theme.spacing(2, 4),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(2, 2),
            },
        },
        cardFooter: {
            padding: theme.spacing(1, 4),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(1, 2),
            },
            borderTop: `1px solid ${theme.palette.grey[300]}`,
        },
        cardBodyRow: {
            marginBottom: `3em`,
        },
    }));

export interface Params {
    organizationId: string;
}

export default function EditOrganizationPage () {
    const classes = useStyles();
    const { organizationId } = useParams<Params>();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ isValid, setValid ] = useState(true);
    const [ organizationState, setOrganizationState ] = useState(buildEmptyOrganization);
    const [ editedOrganizationState, setEditedOrganizationState ] = useState(buildEmptyOrganization);
    const [ currentTab, setCurrentTab ] = useState<OrganizationTab>(OrganizationTabName.ORGANIZATIONINFO);

    const [ saveOrganization ] = useSaveOrganization();
    const [ setOrganizationBranding ] = useSetOrganizationBranding();
    const [ deleteBrandingImage ] = useDeleteOrganizationBrandingImage();
    const [ deleteBrandingPrimaryColor ] = useDeleteOrganizationBrandingPrimaryColor();
    const { data: organizationData, loading } = useGetOrganization({
        fetchPolicy: `network-only`,
        variables: {
            organization_id: organizationId,
        },
    });
    const { refetch: refetchMemberships } = useQueryMyUser({
        nextFetchPolicy: `network-only`,
    });

    const tabs = [
        {
            value: OrganizationTabName.ORGANIZATIONINFO,
            text: intl.formatMessage({
                id: `addOrganization_organizationInfo`,
            }),
        },
        {
            value: OrganizationTabName.PERSONALIZATION,
            text: intl.formatMessage({
                id: `addOrganization_personalization`,
            }),
        },
    ];

    const handleCancel = () => {
        history.goBack();
    };

    const handleSave = async () => {
        const {
            organization_name,
            address1,
            address2,
            phone,
            setBranding,
            shortCode,
        } = editedOrganizationState;
        try {
            const organizationLogo = setBranding?.iconImage;
            const primaryColor = setBranding?.primaryColor;

            await Promise.all([
                saveOrganization({
                    variables: {
                        organization_id: organizationId,
                        organization_name,
                        address1: address1 ?? ``,
                        address2: address2 ?? ``,
                        phone: phone ?? ``,
                        shortCode: shortCode ?? ``,
                    },
                }),
                setOrganizationBranding({
                    variables: {
                        organizationId,
                        organizationLogo: organizationLogo ?? undefined,
                        primaryColor: primaryColor ?? undefined,
                    },
                }),
                ...(organizationLogo === null ? [
                    deleteBrandingImage({
                        variables: {
                            organizationId,
                        },
                    }),
                ] : [] as Promise<any>[]),
                ...(primaryColor === null ? [
                    deleteBrandingPrimaryColor({
                        variables: {
                            organizationId,
                        },
                    }),
                ] : [] as Promise<any>[]),
            ]);
            await refetchMemberships();
            history.goBack();
            enqueueSnackbar(intl.formatMessage({
                id: `allOrganization_editSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `allOrganization_editError`,
            }), {
                variant: `error`,
            });
        }
    };

    useEffect(() => {
        if (!organizationData) return;
        setOrganizationState(organizationData.organization);
    }, [ loading, organizationData ]);

    return (
        <Container
            component="main"
            maxWidth="md"
        >
            <Grid
                container
                spacing={4}
                direction="column"
            >
                <Grid item>
                    <Card>
                        <Grid container>
                            <Grid
                                container
                                justifyContent="space-between"
                                alignItems="center"
                                className={classes.cardHead}
                            >
                                <Grid item>
                                    <Tabs
                                        tabs={tabs}
                                        value={currentTab}
                                        onChange={(newTab: OrganizationTab) => setCurrentTab(newTab)}
                                    />
                                </Grid>
                            </Grid>
                            <OrganizationForm
                                value={organizationState}
                                currentTab={currentTab}
                                onChange={setEditedOrganizationState}
                                onValidation={setValid}
                            />
                            <Grid
                                container
                                justifyContent="flex-end"
                                alignItems="center"
                                className={classes.cardFooter}
                            >
                                <Grid item>
                                    <Grid
                                        container
                                    >
                                        <Box mr={2}>
                                            <Button
                                                label={intl.formatMessage({
                                                    id: `addOrganization_cancelButtonLabel`,
                                                })}
                                                size="large"
                                                color="primary"
                                                variant="text"
                                                onClick={handleCancel}
                                            />
                                        </Box>
                                        <Box>
                                            <Button
                                                label={intl.formatMessage({
                                                    id: `addOrganization_saveButtonLabel`,
                                                })}
                                                type="submit"
                                                size="large"
                                                color="primary"
                                                variant="text"
                                                disabled={!isValid}
                                                onClick={handleSave}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
