import { RoleInfo } from "@/pages/admin/Role/CreateRoleDialog";
import {
    Divider,
    Grid,
    LinearProgress,
    TextField,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, {
    Dispatch,
    SetStateAction,
} from "react";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: `1342px`,
            borderRadius: 10,
        },
        textField: {
            paddingTop: `10px`,
        },
        requiredField: {
            paddingTop: `19px`,
        },
    }),
);

interface Props {
    setRoleInfo: Dispatch<SetStateAction<RoleInfo>>;
    roleInfo: RoleInfo;
    loading: boolean;
    nameTextHelper: (name: string) => string;
    descriptionTextHelper: (description: string) => string;
}

export default function RoleInfoCard(props: Props) {
    const {
        roleInfo,
        setRoleInfo,
        loading,
        nameTextHelper,
        descriptionTextHelper,
    } = props;
    const classes = useStyles();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, id } = event.target;

        setRoleInfo((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    return (
        <Card className={classes.root}>
            <CardContent>
                {loading ? (
                    <div>
                        <LinearProgress />
                        <Typography
                            variant="body1"
                            color="textSecondary"
                            component="div"
                        >
                            <div
                                style={{
                                    padding: `10px`,
                                }}
                            >
                                Fetching permissions
                            </div>
                        </Typography>
                    </div>
                ) : (
                    <div>
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
                                        error={
                                            nameTextHelper(roleInfo.name)
                                                .length !== 0
                                        }
                                        id="name"
                                        label="Name*"
                                        defaultValue={roleInfo.name}
                                        helperText={nameTextHelper(
                                            roleInfo.name,
                                        )}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={classes.textField}>
                                    <TextField
                                        fullWidth
                                        error={
                                            descriptionTextHelper(
                                                roleInfo.description,
                                            ).length !== 0
                                        }
                                        id="description"
                                        label="Description"
                                        defaultValue={roleInfo.description}
                                        helperText={descriptionTextHelper(
                                            roleInfo.description,
                                        )}
                                        onChange={handleInputChange}
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
                                Required field*
                            </div>
                        </Typography>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
