import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import JoinedOrganizationTable from "./JoinedOrganizationTable";
import MyOrganizationTable from "./MyOrganizationTable";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
}));

/**
 * Returns function to show Organizations table
 */
export default function AllOrganization() {
    const classes = useStyles();

    return (
        <Box
            display="flex"
            flexDirection="column"
            className={classes.root}
        >
            <MyOrganizationTable />
            <JoinedOrganizationTable />
        </Box>
    );
}
