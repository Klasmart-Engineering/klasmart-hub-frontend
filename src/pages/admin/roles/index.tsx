import RolesTable from "@/components/Role/Table";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
}

export default function RolesPage (props: Props) {
    const classes = useStyles();

    return (
        <RolesTable />
    );

}
