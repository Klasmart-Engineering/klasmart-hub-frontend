import { getCmsSiteEndpoint } from "@/config";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `100%`,
        height: `100%`,
    },
}));

interface Props {
}

export default function MoreFeaturedContentPage (props: Props) {
    const classes = useStyles();
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;

    return (
        <iframe
            src={`${getCmsSiteEndpoint()}?org_id=${organizationId}#/library/my-content-list?program_group=More Featured Content&order_by=-update_at&page=1`}
            frameBorder="0"
            className={classes.root}
        />
    );
}
