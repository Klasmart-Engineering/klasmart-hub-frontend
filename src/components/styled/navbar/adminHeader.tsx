import { FormControl, MenuItem, NativeSelect, Select, useMediaQuery, useTheme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import React, { useState } from "react";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { history } from "../../../utils/history";

const adminNavBar = [
    { name: "View Organization", path: "allOrganization", id: "adminHeader_viewOrg" },
    { name: "View Users", path: "user", id: "adminHeader_viewUsers" },
    { name: "View Roles", path: "roles", id: "adminHeader_viewRoles" },
    { name: "View Schools", path: "school", id: "adminHeader_viewSchools" },
    { name: "Classes", path: "classes", id: "adminHeader_viewClasses" },
    { name: "Programs", path: "program", id: "adminHeader_viewPrograms" },
    { name: "Grades", path: "grade", id: "adminHeader_viewGrades" },
];

export default function Header() {
    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

    const url = new URL(window.location.href);
    const currentPath = adminNavBar.find((element) => element.path === url.hash.split("/")[2]);
    const [page, setPage] = useState(currentPath?.path || "allOrganization");

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPage(event.target.value as string);
        history.push(`/admin/${event.target.value}`);
    };

    useEffect(() => {
        const newPath = adminNavBar.find((element) => element.path === url.hash.split("/")[2]);
        setPage(newPath?.path || "allOrganization");
    }, [url]);

    return (
        <Grid
            container
            direction="row"
        >
            <Paper square style={{ flex: 1, height: "100%" }}>
                <Toolbar variant="dense">
                    {isMdDown ?
                        <FormControl>
                            <Select
                                value={page}
                                onChange={handleChange}
                                name="page"
                                inputProps={{ "aria-label": "admin page select" }}
                            >
                                {adminNavBar.map((item) => (
                                    <MenuItem key={item.path} value={item.path}>{item.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl> :
                        <Grid container direction="row" spacing={2}>
                            {
                                adminNavBar.map((item) => (
                                    <Grid item key={item.name}>
                                        <Link
                                            href="#"
                                            variant="body2"
                                            onClick={(e: React.MouseEvent) => { history.push(`/admin/${item.path}`); e.preventDefault(); }}
                                            style={{
                                                color: url.hash.includes(item.path) ? "#0E78D5" : "black",
                                                textDecoration: url.hash.includes(item.path) ? "underline" : "none",
                                            }}
                                        >
                                            <FormattedMessage id={item.id}></FormattedMessage>
                                        </Link>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    }
                </Toolbar>
            </Paper>
        </Grid>
    );
}
