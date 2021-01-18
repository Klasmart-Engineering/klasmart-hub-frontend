import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {
    MenuItem,
    TextField,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import { teacherRole } from "@/utils/permissions/teacher";
import { studentRole } from "@/utils/permissions/student";
import { schoolAdminRole } from "@/utils/permissions/schoolAdmin";
import { parentRole } from "@/utils/permissions/parent";
import { organizationAdminRole } from "@/utils/permissions/organizationAdmin";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: theme.breakpoints.values.lg,
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
            justifyContent: `space-between`,
        },
        label: {
            textTransform: `capitalize`,
        },
    }),
);

const roles = [
    {
        value: teacherRole.role_name,
        label: teacherRole.role_name,
    },
    {
        value: studentRole.role_name,
        label: studentRole.role_name,
    },
    {
        value: schoolAdminRole.role_name,
        label: schoolAdminRole.role_name,
    },
    {
        value: parentRole.role_name,
        label: parentRole.role_name,
    },
    {
        value: organizationAdminRole.role_name,
        label: organizationAdminRole.role_name,
    },
];

export default function PermissionsActionsCard() {
    const classes = useStyles();
    const [ role, setRole ] = React.useState(``);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRole(event.target.value);
    };

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
                        <Button
                            classes={{
                                label: classes.label,
                            }}
                        >
                            Clear
                        </Button>
                        <Button
                            classes={{
                                label: classes.label,
                            }}
                        >
                            Reset to Default
                        </Button>
                        <div>
                            <TextField
                                select
                                id="filled"
                                label="Copy role from..."
                                value={role}
                                variant="outlined"
                                onChange={handleChange}
                            >
                                {roles.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
