import { getCmsSiteEndpoint } from "@/config";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import React from "react";

interface Props {
    className?: string;
}

export default function MoreFeaturedContentPage (props: Props) {
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;

    return (
        <iframe
            src={`${getCmsSiteEndpoint()}?org_id=${organizationId}#/library/my-content-list?program_group=More Featured Content&order_by=-update_at&page=1`}
            frameBorder="0"
            className={props.className}
        />
    );
}
