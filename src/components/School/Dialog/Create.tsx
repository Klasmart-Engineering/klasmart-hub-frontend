import React,
{
    useEffect,
    useState,
} from "react";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import { School } from "@/types/graphQL";
import SchoolDialogForm from "./Form";
import {
    Dialog,
    useSnackbar,
} from "kidsloop-px";
import { buildEmptySchool } from "@/utils/schools";
import { useCreateSchool } from "@/api/schools";
import { useReactiveVar } from "@apollo/client";
import { currentMembershipVar } from "@/cache";

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
    const { enqueueSnackbar } = useSnackbar();
    const [ valid, setValid ] = useState(true);
    const [ newSchool, setNewSchool ] = useState(buildEmptySchool());
    const [ createSchool, { loading: loadingCreate } ] = useCreateSchool();
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
            enqueueSnackbar(`School has been created succesfully`, {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    return (
        <Dialog
            open={open}
            title="Create school"
            actions={[
                {
                    label: `Cancel`,
                    color: `primary`,
                    onClick: () => onClose(),
                },
                {
                    label: `Create`,
                    color: `primary`,
                    disabled: !valid,
                    loading: loadingCreate,
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
