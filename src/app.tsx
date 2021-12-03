import { useGetOrganizationMemberships } from "@/api/organizations";
import { useGetMe } from "@/api/users";
import { userIdVar } from "@/cache";
import Layout from "@/layout";
import { useOrganizationStack } from "@/store/organizationMemberships";
import {
    isActive,
    OrganizationMembership,
} from "@/types/graphQL";
import { isEqual } from "lodash";
import React,
{ useEffect } from "react";

interface Props {
}

export default function App (props: Props) {
    const [ , setOrganizationMembershipStack ] = useOrganizationStack();
    const { data: userData } = useGetMe();
    const {
        data: organizationsData,
        loading: organizationsLoading,
    } = useGetOrganizationMemberships();

    useEffect(() => {
        if (!userData) return;
        userIdVar(userData.me.user_id);
    }, [ userData ]);

    useEffect(() => {
        if (organizationsLoading) return;
        const memberships = organizationsData?.me.memberships?.filter((membership): membership is OrganizationMembership => !!membership);
        setOrganizationMembershipStack((membershipStack) => {
            const updatedMemberships = memberships
                ?.sort((a, b) => {
                    const aIndex = membershipStack.findIndex((membership) => membership.organization_id === a.organization_id);
                    const bIndex = membershipStack.findIndex((membership) => membership.organization_id === b.organization_id);
                    if (aIndex === bIndex && a.organization?.organization_name && b.organization?.organization_name) return a.organization.organization_name.localeCompare(b.organization.organization_name);
                    return aIndex - bIndex;
                })
                .filter(isActive) ?? [];
            return isEqual(updatedMemberships, membershipStack) ? membershipStack : updatedMemberships;
        });
    }, [ organizationsData ]);

    return (
        <Layout />
    );
}
