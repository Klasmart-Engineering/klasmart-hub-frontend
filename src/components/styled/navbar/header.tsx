import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import { useHistory } from "react-router-dom";

const adminNavBar = [
    { name: "View Organization", path: "allOrganization" },
    { name: "View Users", path: "user" },
    { name: "View Groups", path: "group" },
    { name: "View Schools", path: "school" },
    { name: "Classes", path: "classes" },
    { name: "Programs", path: "program" },
    { name: "Grades", path: "grade" },
];

export default function Header() {
    const history = useHistory();
    const location = new URL(window.location.href);

    return (
        <Grid
            container
            direction="row"
        >
            <Paper square style={{ flex: 1, height: "100%" }}>
                <Toolbar variant="dense">
                    <Grid container direction="row" spacing={2}>
                        {
                            adminNavBar.map((item) => (
                                <Grid item key={item.name}>
                                    <Link
                                        href="#"
                                        variant="body2"
                                        onClick={(e: React.MouseEvent) => { history.push(`${item.path}`); e.preventDefault(); }}
                                        style={{
                                            color: location.hash.includes(item.path) ? "#0E78D5" : "black",
                                            textDecoration: location.hash.includes(item.path) ? "underline" : "none",
                                        }}
                                    >
                                        {item.name}
                                    </Link>
                                </Grid>
                            ))
                        }
                    </Grid>
                </Toolbar>
            </Paper>
        </Grid>
    );
}
