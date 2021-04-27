import {
    useGetOrganization,
    useSaveOrganization,
} from "@/api/organizations";
import OrganizationForm from '@/components/Organization/Form';
import { history } from "@/utils/history";
import { buildEmptyOrganization } from "@/utils/organization";
import Container from "@material-ui/core/Container";
import React,
{
    useEffect,
    useState,
} from "react";
import { useParams } from "react-router";

interface Params {
    organizationId: string;
}

export default function EditOrganizationPage () {
    const { organizationId } = useParams<Params>();
    const [ isValid, setValid ] = useState(true);
    const [ organizationState, setOrganizationState ] = useState(buildEmptyOrganization);

    const [ saveOrganization ] = useSaveOrganization();
    const { data: organization, loading } = useGetOrganization({
        fetchPolicy: `network-only`,
        variables: {
            organization_id: organizationId,
        },
    });

    const onSave = async () => {
        const response = await saveOrganization({
            variables: {
                ...organizationState,
                organization_id: organizationId,
            },
        });

        if (!response.data?.organization.errors) {
            return history.goBack();
        }
    };

    useEffect(() => {
        if (!organization) return;
        setOrganizationState(organization.organization);
    }, [ loading, organization ]);

    return (
        <Container
            component="main"
            maxWidth="md"
        >
            <OrganizationForm
                value={organizationState}
                isValid={isValid}
                isCreateForm={false}
                onChange={setOrganizationState}
                onValidation={setValid}
                onSubmit={onSave}
            />
        </Container>
    );
}
