import JoinedOrganizationTable from "@/components/Organization/JoinedOrganizationTable";
import MyOrganizationTable from "@/components/Organization/MyOrganizationTable";
import { TabTitle } from "@/utils/tabTitle";
import { Box } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
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
    TabTitle(`Kidsloop | Interactive Digital Platform for Education | Organizations`);

    return (
        <Box
            display="flex"
            flexDirection="column"
            className={classes.root}
        >
            <MyOrganizationTable />
            <div style={{
                padding: 12,
            }}
            />
            <JoinedOrganizationTable />
        </Box>
    );
}
