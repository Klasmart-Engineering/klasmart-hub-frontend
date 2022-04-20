
import AcademicTermDialogForm,
{ AcademicTermForm } from "./Form";
import { useCreateAcademicTerm } from "@/api/academicTerms";
import { buildEmptyAcademicTerm, buildEmptyAcademicTermForm } from "@/utils/academicTerms";
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
    onClose: (value?: AcademicTermForm) => void;
}

export default function CreateAcademicTermDialog (props: Props) {
    const { open, schoolId, onClose } = props;
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
                termName: name,
                startDate,
                endDate,
            } = newAcademicTerm;
            
            await createAcademicTerm({
                variables: {
                    schoolId,
                    name,
                    startDate,
                    endDate,
                }
            })

            onClose(newAcademicTerm);
            enqueueSnackbar(intl.formatMessage({
                id: `academicTerm.todo`,
                defaultMessage: `Academic term has been created successfully`,

            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `academicTerm.todo`,
                defaultMessage: `Sorry, something went wrong, please try again`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <Dialog
            open={open}
            title={intl.formatMessage({
                id: `academicTerm.todo`,
                defaultMessage: `Create Academic Term`,
            })}
            actions={[
                {
                    label: intl.formatMessage({
                        id: `academicTerm.todo`,
                        defaultMessage: `Cancel`,
                    }),
                    color: `primary`,
                    onClick: () => onClose(),
                },
                {
                    label: intl.formatMessage({
                        id: `academicTerm.todo`,
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
                onChange={(value) => setNewAcademicTerm(value)}
                onValidation={setValid}
            />
        </Dialog>
    );
}
