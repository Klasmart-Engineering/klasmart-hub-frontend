import { Role } from "@/pages/admin/Role/CreateRoleDialog";
import { Actions } from "@/pages/admin/Role/RoleTable";
import {
    MenuItem,
    TextField,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: `100%`,
            height: `100px`,
            marginBottom: `13px`,
            borderRadius: 10,
            "& .MuiTextField-root": {
                margin: theme.spacing(1),
                width: `25ch`,
            },
        },
        contentContainer: {
            display: `flex`,
            alignItems: `center`,
        },
        actionsMargin: {
            marginRight: `auto`,
        },
        actionsContainer: {
            display: `flex`,
            width: `550px`,
            justifyContent: `flex-end`,
            alignItems: `center`,
        },
        label: {
            textTransform: `capitalize`,
        },
        margin: {
            marginRight: theme.spacing(3),
        },
    }),
);

interface Props {
    roles: Role[];
    roleId: string;
    actions: Actions;
}

export default function ActionsCard(props: Props) {
    const {
        roles,
        roleId,
        actions,
    } = props;
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <div className={classes.contentContainer}>
                    <div className={classes.actionsMargin}>
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="h2">
                            Actions
                        </Typography>
                    </div>
                    <div className={classes.actionsContainer}>
                        {actions.buttons?.map((action, index) => (
                            <Button
                                key={index}
                                className={classes.margin}
                                classes={{
                                    label: classes.label,
                                }}
                                disabled={action.disabled}
                                onClick={action.onClick}
                            >
                                {action.text}
                            </Button>
                        ))}
                        <TextField
                            select
                            id="filled"
                            label={actions.textFieldLabel}
                            value={roleId}
                            variant="outlined"
                            onChange={actions.onChange}
                        >
                            {roles
                                .filter(
                                    (role) =>
                                        role.role_name &&
                                        role.status === `active`,
                                )
                                .map((role) => (
                                    <MenuItem
                                        key={role.role_id}
                                        value={role.role_id}
                                    >
                                        {role.role_name}
                                    </MenuItem>
                                ))}
                        </TextField>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
