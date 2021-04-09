import AgeRangeForm from "./Form";
import {
    useDeleteAgeRange,
    useEditAgeRange,
} from "@/api/age_ranges";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { AgeRange } from "@/types/graphQL";
import {
    buildAgeRangeLabel,
    buildEmptyAgeRange,
} from "@/utils/ageRanges";
import { useValidations } from "@/utils/validations";
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
    const [ valid, setValid ] = useState(true);
    const currentOrganization = useCurrentOrganization();

    useEffect(() => {
        setUpdatedAgeRange(value ?? buildEmptyAgeRange());
    }, [ open ]);

    const handleSave = async () => {
        try {
            onClose(updatedAgeRange);
            await editAgeRange({
                variables: {
                    organization_id: currentOrganization?.organization_id ?? ``,
                    id: updatedAgeRange.id,
                    name: `${updatedAgeRange.low_value}-${updatedAgeRange.high_value}`,
                    low_value: updatedAgeRange.low_value,
                    low_value_unit: updatedAgeRange.low_value_unit,
                    high_value: updatedAgeRange.high_value,
                    high_value_unit: updatedAgeRange.high_value_unit,
                },
            });

            refetch();

            enqueueSnackbar(intl.formatMessage({
                id: `ageRanges_editSuccess`,
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

    const handleDelete = async () => {
        const ageRangeName = value ? buildAgeRangeLabel(value) : ``;
        try {
            if (!await prompt({
                variant: `error`,
                title: intl.formatMessage({
                    id: `ageRanges_deleteAgeRangeTitle`,
                }),
                okLabel: `Delete`,
                content: <>
                    <DialogContentText>{intl.formatMessage({
                        id: `ageRanges_confirmDelete`,
                    }, {
                        ageRangeName,
                    })}</DialogContentText>
                    <DialogContentText>{intl.formatMessage({
                        id: `ageRanges_typeText`,
                    }, {
                        ageRangeName,
                    })} <strong>{ageRangeName}</strong> {intl.formatMessage({
                        id: `ageRanges_typeEndText`,
                    })}</DialogContentText>
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
            enqueueSnackbar(intl.formatMessage({
                id: `ageRanges_deleteSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `ageRanges_deleteError`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <>
            <Dialog
                title={intl.formatMessage({
                    id: `ageRanges_formEditTitle`,
                })}
                open={open}
                actions={[
                    {
                        label: intl.formatMessage({
                            id: `ageRanges_deleteLabel`,
                        }),
                        color: `error`,
                        align: `left`,
                        onClick: handleDelete,
                    },
                    {
                        label: intl.formatMessage({
                            id: `ageRanges_cancelButton`,
                        }),
                        color: `primary`,
                        align: `right`,
                        onClick: () => onClose(),
                    },
                    {
                        label: intl.formatMessage({
                            id: `ageRanges_saveButton`,
                        }),
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
