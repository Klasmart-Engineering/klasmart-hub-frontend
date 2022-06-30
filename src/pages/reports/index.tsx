import { getCmsSiteEndpoint } from "@/config";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { TabTitle } from "@/utils/tabTitle";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `100%`,
        height: `100%`,
    },
}));

interface Props {
}

export default function ReportsPage (props: Props) {
    const classes = useStyles();
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;
    TabTitle(`Kidsloop | Interactive Digital Platform for Education | Analytics & Reports`);

    return (
        <iframe
            src={`${getCmsSiteEndpoint()}?org_id=${organizationId}#/report/achievement-list`}
            frameBorder="0"
            className={classes.root}
        />
    );
}
