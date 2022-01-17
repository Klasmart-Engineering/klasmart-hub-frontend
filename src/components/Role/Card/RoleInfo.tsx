import {
    Role,
    RoleInfo,
} from "@/components/Role/Dialog/CreateEdit";
import { RoleRow } from "@/components/Role/Table";
import {
    ROLE_DESCRIPTION_LENGTH_MAX,
    ROLE_NAME_LENGTH_MAX,
    ROLE_NAME_LENGTH_MIN,
} from "@/config/index";
import { Status } from "@/types/graphQL";
import { useValidations } from "@/utils/validations";
import {
    CardHeader,
    Divider,
    Grid,
    LinearProgress,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { TextField } from "kidsloop-px";
import React,
{
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
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
    setRoleInfoIsValid: Dispatch<SetStateAction<boolean>>;
    roleInfo: RoleInfo;
    loading: boolean;
    roles: Role[];
    row: RoleRow;
}

export default function RoleInfoCard (props: Props) {
    const {
        roleInfo,
        setRoleInfo,
        loading,
        setRoleInfoIsValid,
        roles,
        row,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const [ roleNameIsValid, setRoleNameIsValid ] = useState(true);
    const [ roleDescriptionIsValid, setRoleDescriptionIsValid ] = useState(true);
    const {
        required,
        letternumeric,
        min,
        max,
        notEquals,
    } = useValidations();

    const handleRoleNameChange = (value: string) => {
        setRoleInfo((prevState) => ({
            ...prevState,
            name: value,
        }));
    };

    const handleRoleDescriptionChange = (value: string) => {
        setRoleInfo((prevState) => ({
            ...prevState,
            description: value,
        }));
    };

    useEffect(() => {
        setRoleInfoIsValid([ roleNameIsValid, roleDescriptionIsValid ].every((valid) => valid));
    }, [ roleNameIsValid, roleDescriptionIsValid ]);

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
                    <CardHeader
                        title={intl.formatMessage({
                            id: `rolesInfoCard_title`,
                        })}
                    />
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
                                    value={roleInfo.name ?? ``}
                                    label={intl.formatMessage({
                                        id: `rolesInfoCard_nameFieldLabel`,
                                    })}
                                    variant="standard"
                                    type="text"
                                    validations={[
                                        required(),
                                        min(ROLE_NAME_LENGTH_MIN, intl.formatMessage({
                                            id: `validation.error.role.name.minLength`,
                                        }, {
                                            value: ROLE_NAME_LENGTH_MIN,
                                        })),
                                        max(ROLE_NAME_LENGTH_MAX, intl.formatMessage({
                                            id: `validation.error.role.name.maxLength`,
                                        }, {
                                            value: ROLE_NAME_LENGTH_MAX,
                                        })),
                                        letternumeric(),
                                        ...roles
                                            .filter((role) => role.status === Status.ACTIVE)
                                            .filter((role) => role.role_name !== row.role)
                                            .map((role) => notEquals(role.role_name, intl.formatMessage({
                                                id: `roles_notEqualValidation`,
                                            }))),
                                    ]}
                                    onChange={handleRoleNameChange}
                                    onValidate={setRoleNameIsValid}
                                />
                                <TextField
                                    fullWidth
                                    value={roleInfo.description ?? ``}
                                    label={intl.formatMessage({
                                        id: `rolesInfoCard_descriptionFieldLabel`,
                                    })}
                                    variant="standard"
                                    type="text"
                                    validations={[
                                        max(ROLE_DESCRIPTION_LENGTH_MAX, intl.formatMessage({
                                            id: `validation.error.role.description.maxLength`,
                                        }, {
                                            value: ROLE_DESCRIPTION_LENGTH_MAX,
                                        })),
                                        letternumeric(),
                                    ]}
                                    onChange={handleRoleDescriptionChange}
                                    onValidate={setRoleDescriptionIsValid}
                                />
                            </Grid>
                        </form>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="div">
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
