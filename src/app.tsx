import { useGetOrganization } from "./api/organizations";
import { useGetUser } from "./api/users";
import {
    currentMembershipVar,
    userIdVar,
} from "./cache";
import { ActionTypes } from "./store/actions";
import { useLocalStorage } from "./utils/localStorage";
import Layout from "@/layout";
import { useReactiveVar } from "@apollo/client";
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
    const store = useStore();
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

    const userId = useReactiveVar(userIdVar);
    const { data: userData } = useGetUser({
        variables: {
            user_id: userId,
        },
    });
    const [ organizationIdStack ] = useLocalStorage<string[]>(`organizationIdStack-${userData?.user.user_id}`, userData?.user?.memberships?.map((membership) => membership.organization_id) ?? []);
    const { data: organizationData } = useGetOrganization({
        variables: {
            organization_id: organizationIdStack?.[0],
        },
    });

    useEffect(() => {
        if (!organizationData?.organization) return;
        const organization = organizationData.organization;

        currentMembershipVar({
            organization_name: organization.organization_name ?? ``,
            organization_id: organization.organization_id,
            organization_email: organization.owner?.email ?? ``,
        });
    }, [ organizationData ]);

    return (
        <Layout />
    );
}
