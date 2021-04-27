import OrganizationInfo from "./Forms/OrganizationInfo";
import Personalization from "./Forms/Personalization";
import { Organization } from "@/types/graphQL";
import { history } from "@/utils/history";
import Grid from "@material-ui/core/Grid";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import {
    Button,
    Card,
    Tabs,
} from "kidsloop-px";
import React,
{
    useRef,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cardHead: {
            padding: theme.spacing(0, 4),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(1, 2),
            },
            borderBottom: `1px solid ${theme.palette.grey[300]}`,
        },
        cardBody: {
            padding: theme.spacing(2, 4),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(2, 2),
            },
        },
        cardFooter: {
            padding: theme.spacing(1, 4),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(1, 2),
            },
            borderTop: `1px solid ${theme.palette.grey[300]}`,
        },
        cardBodyRow: {
            marginBottom: `3em`,
        },
        formInput: {
            margin: `1em 0`,
        },
        fileInput: {
            display: `none`,
            borderStyle: `dashed`,
        },
        logoPreview: {
            border: `1px dashed ${theme.palette.grey[300]}`,
            width: `100%`,
            minWidth: `100%`,
            minHeight: `5em`,
            margin: `1em 0`,
        },
        hideForm: {
            display: `none`,
        },
        showForm: {
            display: `block`,
        },
    }));

interface Props {
    value: Organization;
    isValid: boolean;
    isCreateForm: boolean;
    onChange: (value: Organization) => void;
    onValidation: (valid: boolean) => void;
    onSubmit: () => void;
}

type OrganizationTab = `organizationInfo` | `personalization`

export default function OrganizationForm (props: Props) {
    const {
        value,
        isValid,
        isCreateForm,
        onChange,
        onValidation,
        onSubmit,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const formRef = useRef<HTMLFormElement | null>(null);
    const [ currentTab, setCurrentTab ] = useState<OrganizationTab>(`organizationInfo`);

    const tabs = [
        {
            value: `organizationInfo`,
            text: intl.formatMessage({
                id: `addOrganization_organizationInfo`,
            }),
        },
        {
            value: `personalization`,
            text: intl.formatMessage({
                id: `addOrganization_personalization`,
            }),
        },
    ];

    const onCancel = () => {
        return history.goBack();
    };

    return (
        <form
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
        >
            <Grid
                container
                spacing={4}
                direction="column"
            >
                <Grid item>
                    <Card>
                        <Grid container>
                            <Grid
                                container
                                justify="space-between"
                                alignItems="center"
                                className={classes.cardHead}
                            >
                                <Grid item>
                                    <Tabs
                                        tabs={tabs}
                                        value={currentTab}
                                        onChange={(newTab) => setCurrentTab(newTab)}
                                    />
                                </Grid>
                            </Grid>
                            <div className={currentTab === `organizationInfo` ? classes.showForm : classes.hideForm}>
                                <OrganizationInfo
                                    value={value}
                                    onChange={onChange}
                                    onValidation={onValidation}
                                />
                            </div>
                            <div className={currentTab === `personalization` ? classes.showForm : classes.hideForm}>
                                <Personalization
                                    value={value}
                                    onChange={onChange}
                                    onValidation={onValidation}
                                />
                            </div>
                            <Grid
                                container
                                justify="flex-end"
                                alignItems="center"
                                className={classes.cardFooter}
                            >
                                <Grid item>
                                    <Grid
                                        container
                                        spacing={2}
                                    >
                                        <Grid item>
                                            <Button
                                                label={intl.formatMessage({
                                                    id: `addOrganization_cancelButtonLabel`,
                                                })}
                                                size="large"
                                                color="primary"
                                                onClick={onCancel}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                label={intl.formatMessage({
                                                    id: `${isCreateForm ? `organizations_createButton` : `addOrganization_saveButtonLabel`}`,
                                                })}
                                                type="submit"
                                                size="large"
                                                color="primary"
                                                disabled={!isValid}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </form>
    );
}
