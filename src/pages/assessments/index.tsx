import { getCNEndpoint } from "@/config";
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

export default function AssessmentsPage (props: Props) {
    const classes = useStyles();
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;

    return (
        <iframe
            src={`${getCNEndpoint()}?org_id=${organizationId}#/assessments/assessment-list`}
            frameBorder="0"
            className={classes.root}
        />
    );
}
