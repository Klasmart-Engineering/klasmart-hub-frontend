import AgeRangeForm from "./Form";
import { useCreateAgeRange } from "@/api/ageRanges";
import { useCurrentOrganization } from "@/state/organizationMemberships";
import { buildEmptyAgeRange } from "@/utils/ageRanges";
import {
    Dialog,
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import React, {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CreateAgeRangeDialog (props: Props) {
    const {
        open,
        onClose,
    } = props;
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ newAgeRange, setNewAgeRange ] = useState(buildEmptyAgeRange());
    const [ valid, setValid ] = useState(true);
    const [ addAgeRange ] = useCreateAgeRange();
    const currentOrganization = useCurrentOrganization();

    useEffect(() => {
        setNewAgeRange(buildEmptyAgeRange());
    }, [ open ]);

    const handleCreate = async () => {
        try {

            await addAgeRange({
                variables: {
                    organization_id: currentOrganization?.id ?? ``,
                    name: `${newAgeRange.low_value}-${newAgeRange.high_value}`,
                    low_value: newAgeRange.low_value,
                    low_value_unit: newAgeRange.low_value_unit,
                    high_value: newAgeRange.high_value,
                    high_value_unit: newAgeRange.high_value_unit,
                },
            });
            onClose();

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
