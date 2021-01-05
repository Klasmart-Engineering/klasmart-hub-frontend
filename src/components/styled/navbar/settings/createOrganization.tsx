import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { TransitionProps } from "@material-ui/core/transitions";
import React, { useState } from "react";
import DialogAppBar from "../../../../components/styled/dialogAppBar";

import Organization from "../../../../pages/admin/Organization/Organization";
import StyledButton from "../../button";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuContainer: {
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(2, 2),
            },
        },
        menuButton: {
            minHeight: 64,
            padding: theme.spacing(2),
        },
        menuLink: {
            textDecoration: "none",
            textAlign: "center",
            display: "block",
        },
    }),
);


const Motion = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Grow style={{ transformOrigin: "0 0 0" }} ref={ref} {...props} />;
});

export default function CreateOrganizationDialog() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <StyledButton
                fullWidth
                extendedOnly
                onClick={handleClickOpen}
                color="inherit"
                aria-label="menu"
                size="small"
                style={{ paddingLeft: 16, paddingRight: 16, marginRight: 8}}
            >
                Create Your Organization
            </StyledButton>
            <Dialog
                aria-labelledby="nav-menu-title"
                aria-describedby="nav-menu-description"
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Motion}
            >
                <DialogAppBar
                    handleClose={handleClose}
                    subtitleID={"navMenu_adminConsoleLabel"}
                />
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="stretch"
                    spacing={2}
                    className={classes.menuContainer}
                >
                    <Organization isDialog />
                </Grid>
            </Dialog>
        </>
    );
}
