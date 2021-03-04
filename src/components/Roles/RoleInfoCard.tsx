import { RoleInfo } from "@/pages/admin/Role/CreateAndEditRoleDialog";
import {
    CardHeader,
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
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: `100%`,
            borderRadius: 10,
        },
        requiredField: {
            paddingTop: `19px`,
        },
    }));

interface Props {
    setRoleInfo: Dispatch<SetStateAction<RoleInfo>>;
    roleInfo: RoleInfo;
    loading: boolean;
    nameTextHelper: (name: string) => string;
    descriptionTextHelper: (description: string) => string;
}

export default function RoleInfoCard (props: Props) {
    const {
        roleInfo,
        setRoleInfo,
        loading,
        nameTextHelper,
        descriptionTextHelper,
    } = props;
    const classes = useStyles();
    const intl = useIntl();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, id } = event.target;

        setRoleInfo((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    return (
        <Card className={classes.root}>
            {loading ? (
                <CardContent>
                    <LinearProgress />
                    <Typography
                        variant="body1"
                        color="textSecondary"
                        component="div">
                        <div
                            style={{
                                paddingTop: `10px`,
                            }}
                        >
                            <FormattedMessage id="rolesInfoCard_fetchingLabel" />
                        </div>
                    </Typography>
                </CardContent>
            ) : (
                <>
                    <CardHeader title={intl.formatMessage({
                        id: `rolesInfoCard_title`,
                    })}/>
                    <Divider />
                    <CardContent>
                        <form
                            noValidate
                            autoComplete="off">
                            <Grid
                                item
                                xs={12}>
                                <TextField
                                    fullWidth
                                    error={nameTextHelper(roleInfo.name).length !== 0}
                                    id="name"
                                    value={roleInfo.name}
                                    helperText={nameTextHelper(roleInfo.name)}
                                    label={intl.formatMessage({
                                        id: `rolesInfoCard_nameFieldLabel`,
                                    })}
                                    defaultValue={roleInfo.name}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    fullWidth
                                    error={descriptionTextHelper(roleInfo.description).length !== 0}
                                    id="description"
                                    value={roleInfo.description}
                                    helperText={descriptionTextHelper(roleInfo.description)}
                                    label={intl.formatMessage({
                                        id: `rolesInfoCard_descriptionFieldLabel`,
                                    })}
                                    defaultValue={roleInfo.description}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </form>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="div"
                        >
                            <div className={classes.requiredField}>
                                <FormattedMessage id="rolesInfoCard_requiredFieldLabel" />
                            </div>
                        </Typography>
                    </CardContent>
                </>
            )}
        </Card>
    );
}
