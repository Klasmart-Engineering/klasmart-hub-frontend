import AgeRangeForm from "./Form";
import {
    useDeleteAgeRange,
    useEditAgeRange,
} from "@/api/age_ranges";
import { currentMembershipVar } from "@/cache";
import { AgeRange } from "@/types/graphQL";
import {
    buildAgeRangeLabel,
    buildEmptyAgeRange,
} from "@/utils/ageRanges";
import { useValidations } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
import {
    createStyles,
    DialogContentText,
    makeStyles,
} from "@material-ui/core";
import {
    Dialog,
    usePrompt,
    useSnackbar,
} from "kidsloop-px";
import React, {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
    value?: AgeRange;
    open: boolean;
    onClose: (updatedAgeRange?: AgeRange) => void;
    refetch: () => void;
}

export default function (props: Props) {
    const {
        open,
        onClose,
        value,
        refetch,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const { required, equals } = useValidations();
    const { enqueueSnackbar } = useSnackbar();
    const [ editAgeRange ] = useEditAgeRange();
    const [ deleteAgeRange ] = useDeleteAgeRange();
    const [ updatedAgeRange, setUpdatedAgeRange ] = useState(value ?? buildEmptyAgeRange());
    const { organization_id } = useReactiveVar(currentMembershipVar);
    const [ valid, setValid ] = useState(true);

    useEffect(() => {
        setUpdatedAgeRange(value ?? buildEmptyAgeRange());
    }, [ open ]);

    const handleSave = async () => {
        try {
            onClose(updatedAgeRange);
            await editAgeRange({
                variables: {
                    organization_id: organization_id,
                    id: updatedAgeRange.id,
                    name: `${updatedAgeRange.low_value}-${updatedAgeRange.high_value}`,
                    low_value: updatedAgeRange.low_value,
                    low_value_unit: updatedAgeRange.low_value_unit,
                    high_value: updatedAgeRange.high_value,
                    high_value_unit: updatedAgeRange.high_value_unit,
                },
            });

            refetch();

            enqueueSnackbar(`Age range successfully saved`, {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    const handleDelete = async () => {
        const ageRangeName = value ? buildAgeRangeLabel(value) : ``;
        try {
            if (!await prompt({
                variant: `error`,
                title: `Delete Age Range`,
                okLabel: `Delete`,
                content: <>
                    <DialogContentText>Are you sure you want to delete {`"${ageRangeName}"`}?</DialogContentText>
                    <DialogContentText>Type <strong>{ageRangeName}</strong> to confirm deletion.</DialogContentText>
                </>,
                validations: [ required(), equals(ageRangeName) ],
            })) return;

            await deleteAgeRange({
                variables: {
                    id: updatedAgeRange.id,
                },
            });
            onClose(updatedAgeRange);
            refetch();
            enqueueSnackbar(`Age range successfully deleted`, {
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
                title="Edit Age Range"
                open={open}
                actions={[
                    {
                        label: `Delete`,
                        color: `error`,
                        align: `left`,
                        onClick: handleDelete,
                    },
                    {
                        label: `Cancel`,
                        color: `primary`,
                        align: `right`,
                        onClick: () => onClose(),
                    },
                    {
                        label: `Save`,
                        color: `primary`,
                        align: `right`,
                        onClick: handleSave,
                        disabled: !valid,
                    },
                ]}
                onClose={() => onClose()}
            >
                <AgeRangeForm
                    value={updatedAgeRange}
                    onChange={setUpdatedAgeRange}
                    onValidation={setValid}
                />
            </Dialog>
        </>
    );
}
