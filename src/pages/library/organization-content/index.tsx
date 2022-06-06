import { getCmsSiteEndpoint } from "@/config";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import React from "react";

interface Props {
    className?: string;
}

export default function OrganizationContentPage (props: Props) {
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;

    return (
        <iframe
            src={`${getCmsSiteEndpoint()}?org_id=${organizationId}#/library`}
            allow="microphone"
            frameBorder="0"
            className={props.className}
        />
    );
}
