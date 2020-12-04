import Grid from "@material-ui/core/Grid";
import React from "react";
import Header from "../../components/styled/navbar/adminHeader";

export default function Layout(props: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <Grid container style={{ width: "100vw", padding: 24 }}>
                {props.children}
            </Grid>
        </>
    );
}
