import JoinedOrganizationTable from "@/components/Organization/JoinedOrganizationTable";
import MyOrganizationTable from "@/components/Organization/MyOrganizationTable";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        width: `100%`,
    },
}));

/**
 * Returns function to show Organizations table
 */
export default function OrganizationsPage () {
    const classes = useStyles();

    return (
        <Box
            display="flex"
            flexDirection="column"
            className={classes.root}
        >
            <MyOrganizationTable />
            <div style={{
                padding: 12,
            }} />
            <JoinedOrganizationTable />
        </Box>
    );
}
