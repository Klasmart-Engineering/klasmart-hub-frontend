import { useQueryMyUser } from '@/api/myUser';
import { useCurrentOrganizationMembership } from '@/state/organizationMemberships';
import { withLDProvider } from 'launchdarkly-react-client-sdk';
import React from 'react';

interface Props {
}
const LDProvider: React.FC<Props> = (props) => {
    const { loading, data: userData } = useQueryMyUser();
    const currentOrganizationMembership = useCurrentOrganizationMembership();
    const { id: orgId, name: orgName } = currentOrganizationMembership?.organization ?? {
        id: null,
        name: ``,
    };
    const userId = userData?.myUser.node.id;

    if (loading) {
        return <></>;
    }
    if (!orgId || !userId || !process.env.LAUNCHDARKLY_CLIENT_ID) {
        return <>{props.children}</>;
    }
    const LDProvider = withLDProvider({
        clientSideID: process.env.LAUNCHDARKLY_CLIENT_ID,
        user: {
            key: orgId,
            custom: {
                orgId,
                orgName,
            },
        },
        options: {
            bootstrap: `localStorage`,
        },
    })(() => <>{props.children}</>);
    return <LDProvider />;
};

export default LDProvider;
