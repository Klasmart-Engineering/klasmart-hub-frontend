import ClassDialogForm,
{ ClassForm } from "./Form";
import {
    useAddClassToSchools,
    useCreateClass,
    useEditClassAcademicTerm,
    useEditClassAgeRanges,
    useEditClassGrades,
    useEditClassPrograms,
    useEditClassSubjects,
} from "@/api/classes";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { buildEmptyClassForm } from "@/utils/classes";
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
    onClose: (value?: ClassForm) => void;
}

export default function CreateClassDialog (props: Props) {
    const { open, onClose } = props;
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const currentOrganization = useCurrentOrganization();
    const [ valid, setValid ] = useState(true);
    const [ newClass, setNewClass ] = useState(buildEmptyClassForm());
    const [ createClass ] = useCreateClass();
    const [ addClassToSchools ] = useAddClassToSchools();
    const [ createPrograms ] = useEditClassPrograms();
    const [ createSubjects ] = useEditClassSubjects();
    const [ createGrades ] = useEditClassGrades();
    const [ createAgeRanges ] = useEditClassAgeRanges();
    const [ createAcademicTerm ] = useEditClassAcademicTerm();

    useEffect(() => {
        if (!open) return;
        setNewClass(buildEmptyClassForm());
    }, [ open ]);

    const handleCreate = async () => {
        try {
            const {
                name,
                schools,
                programs,
                subjects,
                grades,
                ageRanges,
                academicTerm,
            } = newClass;

            const variables = {
                organizationId: currentOrganization?.id ?? ``,
                name: name ?? ``,
            };

            const response = await createClass({
                variables,
            });

            const classId = response?.data?.createClasses.classes[0]?.id;

            if (!classId) {
                throw Error();
            }

            const schoolsInput = schools?.map(id => ({
                schoolId: id,
                classIds: [ classId ],
            }));

            if (schoolsInput && schoolsInput.length) {
                await addClassToSchools({
                    variables: {
                        input: schoolsInput,
                    },
                });
            }

            await createPrograms({
                variables: {
                    class_id: classId,
                    program_ids: programs ?? [],
                },
            });

            await createSubjects({
                variables: {
                    class_id: classId,
                    subject_ids: subjects ?? [],
                },
            });

            await createGrades({
                variables: {
                    class_id: classId,
                    grade_ids: grades ?? [],
                },
            });

            await createAgeRanges({
                variables: {
                    class_id: classId,
                    age_range_ids: ageRanges ?? [],
                },
            });

            if (academicTerm && schools?.length === 1) {
                await createAcademicTerm({
                    variables: {
                        input: [
                            {
                                classId: classId,
                                academicTermId: academicTerm,
                            },
                        ],
                    },
                });
            }

            onClose(newClass);
            enqueueSnackbar(intl.formatMessage({
                id: `classes_classSavedMessage`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            const ERR_DUPLICATE_CHILD_ENTITY = `ERR_DUPLICATE_CHILD_ENTITY_ATTRIBUTE`;
            let errorId = `classes_classSaveError`;

            if (error instanceof ApolloError && error.message === `ERR_API_BAD_INPUT`) {
                const errors = error?.graphQLErrors?.filter((graphqlError)=> graphqlError?.extensions?.code === `ERR_API_BAD_INPUT`)
                    ?.map(graphQLError => graphQLError.extensions?.exception?.errors)
                    ?.flatMap(graphQLErrors=> graphQLErrors);

                errorId = errors?.filter(specificError=> specificError.code === ERR_DUPLICATE_CHILD_ENTITY)?.length ? `validation.error.class.name.duplicate` : errorId;
            }

            enqueueSnackbar(intl.formatMessage({
                id: errorId,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <Dialog
            open={open}
            title={intl.formatMessage({
                id: `class_createClassTitle`,
            })}
            actions={[
                {
                    label: intl.formatMessage({
                        id: `class_cancelLabel`,
                    }),
                    color: `primary`,
                    onClick: () => onClose(),
                },
                {
                    label: intl.formatMessage({
                        id: `class_createLabel`,
                    }),
                    color: `primary`,
                    disabled: !valid,
                    onClick: handleCreate,
                },
            ]}
            onClose={() => onClose()}
        >
            <ClassDialogForm
                value={newClass}
                onChange={(value) => setNewClass(value)}
                onValidation={setValid}
            />
        </Dialog>
    );
}
