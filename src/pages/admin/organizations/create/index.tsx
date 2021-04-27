import { useGetOrganizationMembershipsPermissions } from "@/api/organizationMemberships";
import {
    useAddUserToOrganization,
    useCreateOrganization,
} from "@/api/organizations";
import { userProfileVar } from "@/cache";
import OrganizationForm from "@/components/Organization/Form";
import { useOrganizationStack } from "@/store/organizationMemberships";
import { history } from "@/utils/history";
import { buildEmptyOrganization } from "@/utils/organization";
import { useReactiveVar } from "@apollo/client";
import Container from "@material-ui/core/Container";
import React,
{ useState } from "react";

export default function CreateOrganizationPage () {
    const userProfile = useReactiveVar(userProfileVar);
    const [ isValid, setValid ] = useState(true);
    const [ organizationState, setOrganizationState ] = useState(buildEmptyOrganization);
    const [ createOrganization ] = useCreateOrganization();
    const [ addUserToOrg ] = useAddUserToOrganization();
    const [ , setOrganizationStack ] = useOrganizationStack();
    const { refetch: refetchOrganizationMembershipsPermissions } = useGetOrganizationMembershipsPermissions({
        nextFetchPolicy: `network-only`,
    });

    const onCreate = async () => {
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

        return history.goBack();
    };

    return (
        <Container
            component="main"
            maxWidth="md"
        >
            <OrganizationForm
                isCreateForm
                value={organizationState}
                isValid={isValid}
                onChange={setOrganizationState}
                onValidation={setValid}
                onSubmit={onCreate}
            />
        </Container>
    );
}
