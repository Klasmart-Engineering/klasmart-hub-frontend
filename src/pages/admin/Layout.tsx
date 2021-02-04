import Grid from "@material-ui/core/Grid";
import React from "react";

export default function Layout(props: { children: React.ReactNode }) {
    return <Grid
        container
        style={{
            width: `100vw`,
            padding: 24,
        }}>
        {props.children}
    </Grid>;
}
