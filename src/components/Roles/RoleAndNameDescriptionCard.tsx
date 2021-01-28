import { RoleInfo } from "@/pages/admin/Role/CreateRoleDialog";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: `1342px`,
            height: `106px`,
            borderRadius: 10,
            marginBottom: `13px`,
        },
        nameContainer: {
            display: `flex`,
        },
        name: {
            flex: `1 1 30px`,
            color: `#808080`,
            fontSize: `14px`,
        },
        description: {
            flex: `1 1 auto`,
            color: `#808080`,
            fontSize: `14px`,
        },
    }),
);

interface Props {
    roleInfo: RoleInfo;
}

export default function RoleAndNameDescriptionCard(props: Props) {
    const { roleInfo } = props;
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography
                    gutterBottom
                    variant="h5"
                    component="h2">
                    Role
                </Typography>
                <div className={classes.nameContainer}>
                    <div className={classes.name}>{roleInfo.name}</div>
                    <div className={classes.description}>
                        {roleInfo.description}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
