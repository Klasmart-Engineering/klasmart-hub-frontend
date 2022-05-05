
import { AcademicTermRow } from "../Table";
import AcademicTermDialogForm,
{ AcademicTermForm } from "./Form";
import { useCreateAcademicTerm } from "@/api/academicTerms";
import {
    buildEmptyAcademicTerm,
    buildEmptyAcademicTermForm,
} from "@/utils/academicTerms";
import { ApolloError } from "@apollo/client";
import {
    Dialog,
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

interface Props {
    open: boolean;
    schoolId: string;
    data: AcademicTermRow[];
    onClose: (value?: AcademicTermForm) => void;
}

export default function CreateAcademicTermDialog (props: Props) {
    const {
        open,
        schoolId,
        onClose,
        data,
    } = props;
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ valid, setValid ] = useState(true);
    const [ newAcademicTerm, setNewAcademicTerm ] = useState(buildEmptyAcademicTermForm());
    const [ createAcademicTerm ] = useCreateAcademicTerm();

    useEffect(() => {
        if (!open) return;
        setNewAcademicTerm(buildEmptyAcademicTerm());
    }, [ open ]);

    const handleCreate = async () => {
        try {

            const {
                name,
                startDate,
                endDate,
            } = newAcademicTerm;

            await createAcademicTerm({
                variables: {
                    schoolId,
                    name,
                    startDate,
                    endDate,
                },
            });

            onClose(newAcademicTerm);
            enqueueSnackbar(intl.formatMessage({
                id: `academicTerm.create.success`,
                defaultMessage: `Academic term has been created successfully`,

            }), {
                variant: `success`,
            });
        } catch (error) {

            let errorCode;

            const ERR_OVERLAPPING_DATE_RANGE = `ERR_OVERLAPPING_DATE_RANGE`;
            const ERR_DUPLICATE_CHILD_ENTITY = `ERR_DUPLICATE_CHILD_ENTITY`;

            if (error instanceof ApolloError && error.message === `ERR_API_BAD_INPUT`) {
                const errors = error?.graphQLErrors?.filter((graphqlError)=> graphqlError?.extensions?.code === `ERR_API_BAD_INPUT`)
                    ?.map(graphQLError => graphQLError.extensions?.exception?.errors)
                    ?.flatMap(graphQLErrors=> graphQLErrors);

                const overlappingDateErrors = errors?.filter(specificError=> specificError.code === ERR_OVERLAPPING_DATE_RANGE);
                const duplicateNameErrors = errors?.filter(specificError=> specificError.code === ERR_DUPLICATE_CHILD_ENTITY);

                errorCode = overlappingDateErrors.length > 0 ? ERR_OVERLAPPING_DATE_RANGE :
                    ( duplicateNameErrors.length > 0 ? ERR_DUPLICATE_CHILD_ENTITY : undefined);
            }

            switch(errorCode) {
            case ERR_OVERLAPPING_DATE_RANGE:
                enqueueSnackbar(intl.formatMessage({
                    id: `academicTerm.validationError.dateRangeConflict`,
                    defaultMessage: `Current date range conflicts with an existing academic term date range`,
                }), {
                    variant: `error`,
                });
                break;
            case ERR_DUPLICATE_CHILD_ENTITY:
                enqueueSnackbar(intl.formatMessage({
                    id: `academicTerm.validationError.duplicateName`,
                    defaultMessage: `Current academic term name conflicts with an existing academic term name`,
                }), {
                    variant: `error`,
                });
                break;
            default:
                enqueueSnackbar(intl.formatMessage({
                    id: `academicTerm.create.error.general`,
                    defaultMessage: `Academic term create has failed`,
                }), {
                    variant: `error`,
                });
                break;
            }
        }
    };

    return (
        <Dialog
            open={open}
            title={intl.formatMessage({
                id: `academicTerm.create.action`,
                defaultMessage: `Create Academic Term`,
            })}
            actions={[
                {
                    label: intl.formatMessage({
                        id: `common.action.cancel`,
                        defaultMessage: `Cancel`,
                    }),
                    color: `primary`,
                    onClick: () => onClose(),
                },
                {
                    label: intl.formatMessage({
                        id: `common.action.create`,
                        defaultMessage: `Create`,
                    }),
                    color: `primary`,
                    disabled: !valid,
                    onClick: handleCreate,
                },
            ]}
            onClose={() => onClose()}
        >
            <AcademicTermDialogForm
                value={newAcademicTerm}
                data={data}
                onChange={(value) => setNewAcademicTerm(value)}
                onValidation={setValid}
            />
        </Dialog>
    );
}
