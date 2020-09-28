import * as React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import { mainNavBar } from "../../../app";
import NavBar from "../../../components/styled/navbar/navbar";

import ReportInfo from "../../../assets/img/report_infograph.png";

export default function ReportLayout() {
    return (<>
        <NavBar menuLabels={mainNavBar} />
        <Container
            disableGutters
            maxWidth={"lg"}
        >
            <Box>
                <Grid container>
                    <Grid item style={{ textAlign: "center" }}>
                        <img src={ReportInfo} width="90%" />
                    </Grid>
                </Grid>
            </Box>
        </Container>
    </>);
}
