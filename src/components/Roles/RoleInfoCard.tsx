import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {
    Divider,
    Grid,
    TextField,
} from "@material-ui/core";
import React from "react";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: `1342px`,
            height: `397px`,
            borderRadius: 10,
        },
        textField: {
            padding: `13px`,
        },
        requiredField: {
            padding: `17px 0 0 10px`,
        },
    }),
);

export default function RoleInfoCard() {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography
                    gutterBottom
                    variant="h5"
                    component="h2">
                    Role Info
                </Typography>
                <Divider />
                <form
                    noValidate
                    autoComplete="off">
                    <Grid
                        item
                        xs={12}>
                        <div className={classes.textField}>
                            <TextField
                                fullWidth
                                id="standard-basic"
                                label="Name*"
                            />
                        </div>
                        <div className={classes.textField}>
                            <TextField
                                fullWidth
                                id="standard-basic2"
                                label="Description"
                            />
                        </div>
                    </Grid>
                </form>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    component="div"
                >
                    <div className={classes.requiredField}>
                        *Required fields
                    </div>
                </Typography>
            </CardContent>
        </Card>
    );
}
