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

export const NO_ORGANIZATION = `no-organization`;
export const ERROR_ORGANIZATION = `error-organization`;

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
    const {
        data: organizationData,
        loading: organizationLoading,
        error: organizationError,
    } = useGetOrganization({
        variables: {
            organization_id: organizationIdStack?.[0],
        },
    });

    useEffect(() => {
        if (organizationLoading) {
            currentMembershipVar({
                organization_name: ``,
                organization_id: ``,
                organization_email: ``,
            });
            return;
        }
        if (!userData?.user.user_id && organizationError) {
            currentMembershipVar({
                organization_name: ``,
                organization_id: ERROR_ORGANIZATION,
                organization_email: ``,
            });
            return;
        }
        if (!organizationData?.organization) {
            currentMembershipVar({
                organization_name: ``,
                organization_id: NO_ORGANIZATION,
                organization_email: ``,
            });
            return;
        }
        const {
            organization_id,
            organization_name,
            owner,
        } = organizationData.organization;
        currentMembershipVar({
            organization_id,
            organization_name: organization_name ?? ``,
            organization_email: owner?.email ?? ``,
        });
    }, [
        userData,
        organizationData,
        organizationLoading,
        organizationError,
    ]);

    return (
        <Layout />
    );
}
