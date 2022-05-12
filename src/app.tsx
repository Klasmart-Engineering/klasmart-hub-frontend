import { getInitialOwnedOrg } from "./utils/organizationMemberships";
import { useQueryMyUser } from "@/api/myUser";
import { OrganizationMembershipConnectionNode } from "@/api/organizationMemberships";
import Layout from "@/layout";
import { organizationMembershipStackState } from "@/store/organizationMemberships";
import { useSetGlobalState } from "@kl-engineering/frontend-state";
import { isEqual } from "lodash";
import React,
{ useEffect } from "react";

interface Props {
}

export default function App (props: Props) {
    const setOrganizationMembershipStack = useSetGlobalState(organizationMembershipStackState);
    const {
        data: myUserData,
        loading: myUserLoading,
        error: myUserError,
    } = useQueryMyUser();

    const setOrganizationMemberships = (memberships: OrganizationMembershipConnectionNode[]) => {
        setOrganizationMembershipStack((membershipStack) => {
            const ownedId = getInitialOwnedOrg(myUserData);
            const sortedMemberships = memberships.sort((a, b) => {
                const aIndex = membershipStack.findIndex((membership) => membership.organization?.id === a.organization?.id);
                const bIndex = membershipStack.findIndex((membership) => membership.organization?.id === b.organization?.id);
                if (aIndex === bIndex && a.organization?.name && b.organization?.name) return a.organization.name.localeCompare(b.organization.name);
                return aIndex - bIndex;
            });

            if (!membershipStack.length && ownedId) {
                const ownedIndex = sortedMemberships.findIndex(membership => membership.organization?.id === ownedId);
                const ownedOrg = sortedMemberships.splice(ownedIndex, 1)[0];
                sortedMemberships.unshift(ownedOrg);
            }

            return isEqual(sortedMemberships, membershipStack) ? membershipStack : sortedMemberships;
        });
    };

    useEffect(() => {
        if (myUserLoading) return;
        if (!myUserData || myUserError) {
            setOrganizationMemberships([]);
            return;
        }
        const organizationMemberships = myUserData.myUser.node.organizationMembershipsConnection.edges.map((edge) => edge.node);
        setOrganizationMemberships(organizationMemberships);
    }, [
        myUserData,
        myUserLoading,
        myUserError,
    ]);

    return (
        myUserLoading ? <></> : <Layout />
    );
}
