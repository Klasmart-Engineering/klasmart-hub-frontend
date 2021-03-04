import SchoolDialogForm from "./Form";
import { useCreateSchool } from "@/api/schools";
import { currentMembershipVar } from "@/cache";
import { School } from "@/types/graphQL";
import { buildEmptySchool } from "@/utils/schools";
import { useReactiveVar } from "@apollo/client";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import {
    Dialog,
    useSnackbar,
} from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
    open: boolean;
    onClose: (value?: School) => void;
}

export default function CreateSchoolDialog (props: Props) {
    const {
        open,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ valid, setValid ] = useState(true);
    const [ newSchool, setNewSchool ] = useState(buildEmptySchool());
    const [ createSchool ] = useCreateSchool();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;

    useEffect(() => {
        if (!open) return;
        setNewSchool(buildEmptySchool());
    }, [ open ]);

    const handleCreate = async () => {
        const { school_name } = newSchool;
        try {
            await createSchool({
                variables: {
                    organization_id,
                    school_name: school_name ?? ``,
                },
            });
            onClose(newSchool);
            enqueueSnackbar(intl.formatMessage({ id: `schools_createdSuccess` }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({ id: `schools_createdError` }), {
                variant: `error`,
            });
        }
    };

    return (
        <Dialog
            open={open}
            title={intl.formatMessage({ id: `schools_createTitle` })}
            actions={[
                {
                    label: intl.formatMessage({ id: `schools_cancelLabel` }),
                    color: `primary`,
                    onClick: () => onClose(),
                },
                {
                    label: intl.formatMessage({ id: `schools_createLabel` }),
                    color: `primary`,
                    disabled: !valid,
                    onClick: handleCreate,
                },
            ]}
            onClose={() => onClose()}
        >
            <SchoolDialogForm
                value={newSchool}
                onValidation={setValid}
                onChange={(value) => setNewSchool(value)}
            />
        </Dialog>
    );
}
