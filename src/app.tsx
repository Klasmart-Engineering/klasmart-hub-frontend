import { useGetOrganizationMemberships } from "@/api/organizations";
import Layout from "@/layout";
import { ActionTypes } from "@/store/actions";
import { useOrganizationStack } from "@/store/organizationMemberships";
import { Store } from "@/store/store";
import {
    isActive,
    Organization,
    OrganizationMembership,
} from "@/types/graphQL";
import { isEqual } from "lodash";
import React,
{ useEffect } from "react";
import {
    isEdge,
    isIE,
    isIOS,
    isMobile,
    isMobileSafari,
} from "react-device-detect";
import { useStore } from "react-redux";

interface Props {
}

export default function App (props: Props) {
    const [ , setOrganizationMembershipStack ] = useOrganizationStack();

    const store = useStore<Store>();
    useEffect(() => {
        const userInformation = {
            isEdge,
            isIE,
            isIOS,
            isMobile,
            isMobileSafari,
        };

        store.dispatch({
            type: ActionTypes.USER_AGENT,
            payload: userInformation,
        });
    }, []);

    const {
        data: organizationsData,
        loading: organizationsLoading,
    } = useGetOrganizationMemberships();

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
            const updatedMembershipIds = updatedMemberships
                .map((membership) => membership.organization_id)
                .filter((id): id is string => !!id);
            const oldMembershipIds = membershipStack
                .map((membership) => membership.organization_id)
                .filter((id): id is string => !!id);
            return isEqual(updatedMembershipIds, oldMembershipIds) ? membershipStack : updatedMemberships;
        });
    }, [ organizationsData, organizationsLoading ]);

    return (
        <Layout />
    );
}
