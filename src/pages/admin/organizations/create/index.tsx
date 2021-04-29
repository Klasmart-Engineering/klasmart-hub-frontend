import { useGetOrganizationMembershipsPermissions } from "@/api/organizationMemberships";
import {
    useAddUserToOrganization,
    useCreateOrganization,
} from "@/api/organizations";
import { userProfileVar } from "@/cache";
import OrganizationForm from "@/components/Organization/Form";
import { useOrganizationStack } from "@/store/organizationMemberships";
import { OrganizationTab } from "@/types/graphQL";
import { history } from "@/utils/history";
import { buildEmptyOrganization } from "@/utils/organization";
import { useReactiveVar } from "@apollo/client";
import { Grid } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import {
    Button,
    Card,
    Tabs,
    useSnackbar,
} from "kidsloop-px";
import React,
{ useState } from "react";
import { useIntl } from "react-intl";

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

export default function CreateOrganizationPage () {
    const classes = useStyles();
    const userProfile = useReactiveVar(userProfileVar);
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ isValid, setValid ] = useState(true);
    const [ organizationState, setOrganizationState ] = useState(buildEmptyOrganization);
    const [ createOrganization ] = useCreateOrganization();
    const [ addUserToOrg ] = useAddUserToOrganization();
    const [ , setOrganizationStack ] = useOrganizationStack();
    const { refetch: refetchOrganizationMembershipsPermissions } = useGetOrganizationMembershipsPermissions({
        nextFetchPolicy: `network-only`,
    });
    const [ currentTab, setCurrentTab ] = useState<OrganizationTab>(`organizationInfo`);

    const tabs = [
        {
            value: `organizationInfo`,
            text: intl.formatMessage({
                id: `addOrganization_organizationInfo`,
            }),
        },
        {
            value: `personalization`,
            text: intl.formatMessage({
                id: `addOrganization_personalization`,
            }),
        },
    ];

    const handleCancel = () => {
        history.goBack();
    };

    const handleCreate = async () => {
        try {
            const createOrganizationResp = await createOrganization({
                variables: {
                    user_id: userProfile.user_id,
                    ...organizationState,
                },
            });

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
            setOrganizationStack([ organizationMembership ]);

            history.goBack();

            enqueueSnackbar(intl.formatMessage({
                id: `allOrganization_createSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `allOrganization_createError`,
            }), {
                variant: `error`,
            });
        }

    };

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
                                justify="space-between"
                                alignItems="center"
                                className={classes.cardHead}
                            >
                                <Grid item>
                                    <Tabs
                                        tabs={tabs}
                                        value={currentTab}
                                        onChange={(newTab) => setCurrentTab(newTab)}
                                    />
                                </Grid>
                            </Grid>
                            <OrganizationForm
                                value={organizationState}
                                currentTab={currentTab}
                                onChange={setOrganizationState}
                                onValidation={setValid}
                            />
                            <Grid
                                container
                                justify="flex-end"
                                alignItems="center"
                                className={classes.cardFooter}
                            >
                                <Grid item>
                                    <Grid
                                        container
                                        spacing={2}
                                    >
                                        <Grid item>
                                            <Button
                                                label={intl.formatMessage({
                                                    id: `addOrganization_cancelButtonLabel`,
                                                })}
                                                size="large"
                                                color="primary"
                                                onClick={handleCancel}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                label={intl.formatMessage({
                                                    id: `organizations_createButton`,
                                                })}
                                                type="submit"
                                                size="large"
                                                color="primary"
                                                disabled={!isValid}
                                                onClick={handleCreate}
                                            />
                                        </Grid>
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
