import AgeRangeForm from "./Form";
import { useCreateAgeRange } from "@/api/age_ranges";
import { currentMembershipVar } from "@/cache";
import { AgeRange } from "@/types/graphQL";
import { buildEmptyAgeRange } from "@/utils/ageRanges";
import { useReactiveVar } from "@apollo/client";
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
    refetch: () => void;
}

export default function (props: Props) {
    const {
        open,
        onClose,
        refetch,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ newAgeRange, setNewAgeRange ] = useState(buildEmptyAgeRange());
    const [ valid, setValid ] = useState(true);
    const [ addAgeRange ] = useCreateAgeRange();
    const { organization_id } = useReactiveVar(currentMembershipVar);

    useEffect(() => {
        setNewAgeRange(buildEmptyAgeRange());
    }, [ open ]);

    const handleCreate = async () => {
        try {
            onClose(newAgeRange);
            await addAgeRange({
                variables: {
                    organization_id: organization_id,
                    name: `${newAgeRange.low_value}-${newAgeRange.high_value}`,
                    low_value: newAgeRange.low_value,
                    low_value_unit: newAgeRange.low_value_unit,
                    high_value: newAgeRange.high_value,
                    high_value_unit: newAgeRange.high_value_unit,
                },
            });

            refetch();
            enqueueSnackbar(intl.formatMessage({
                id: `ageRanges_createSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `ageRanges_createError`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <>
            <Dialog
                title={intl.formatMessage({
                    id: `ageRanges_createAgeRangeLabel`,
                })}
                open={open}
                actions={[
                    {
                        label: intl.formatMessage({
                            id: `ageRanges_cancelButton`,
                        }),
                        color: `primary`,
                        onClick: () => onClose(),
                    },
                    {
                        label: intl.formatMessage({
                            id: `ageRanges_createButton`,
                        }),
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
