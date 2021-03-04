import AgeRangeForm from "./Form";
import { AgeRange } from "@/types/graphQL";
import { buildEmptyAgeRange } from "@/utils/ageRanges";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import {
    Dialog,
    useSnackbar,
} from "kidsloop-px";
import React, {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
    open: boolean;
    onClose: (newAgeRange?: AgeRange) => void;
}

export default function (props: Props) {
    const { open, onClose } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ newAgeRange, setNewAgeRange ] = useState(buildEmptyAgeRange());
    const [ valid, setValid ] = useState(true);

    useEffect(() => {
        setNewAgeRange(buildEmptyAgeRange());
    }, [ open ]);

    const handleCreate = async () => {
        try {
            onClose(newAgeRange);
            enqueueSnackbar(`Age range successfully created`, {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    return (
        <>
            <Dialog
                title="Create Age Range"
                open={open}
                actions={[
                    {
                        label: `Cancel`,
                        color: `primary`,
                        onClick: () => onClose(),
                    },
                    {
                        label: `Create`,
                        color: `primary`,
                        onClick: handleCreate,
                        disabled: !valid,
                    },
                ]}
                onClose={() => onClose()}
            >
                <AgeRangeForm
                    value={newAgeRange}
                    onChange={setNewAgeRange}
                    onValidation={setValid}
                />
            </Dialog>
        </>
    );
}
