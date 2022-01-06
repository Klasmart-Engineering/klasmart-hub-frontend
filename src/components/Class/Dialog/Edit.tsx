import ClassDialogForm,
{ ClassForm } from "./Form";
import {
    useDeleteClass,
    useEditClassAgeRanges,
    useEditClassGrades,
    useEditClassPrograms,
    useEditClassSchools,
    useEditClassSubjects,
    useGetClass,
    useUpdateClass,
} from "@/api/classes";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    buildEmptyClassForm,
    mapClassToForm,
} from "@/utils/classes";
import { useDeleteEntityPrompt } from "@/utils/common";
import { usePermission } from "@/utils/permissions";
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

interface Props {
    open: boolean;
    onClose: (value?: ClassForm) => void;
    classId?: string;
}

export default function EditClassDialog (props: Props) {
    const {
        open,
        onClose,
        classId,
    } = props;
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ editedClass, setEditedClass ] = useState(buildEmptyClassForm());
    const [ valid, setValid ] = useState(true);
    const [ updateClass ] = useUpdateClass();
    const [ deleteClass ] = useDeleteClass();
    const [ editSchools ] = useEditClassSchools();
    const [ editPrograms ] = useEditClassPrograms();
    const [ editSubjects ] = useEditClassSubjects();
    const [ editGrades ] = useEditClassGrades();
    const [ editAgeRanges ] = useEditClassAgeRanges();
    const currentOrganization = useCurrentOrganization();
    const canEditSchool = usePermission(`edit_school_20330`);
    const deletePrompt = useDeleteEntityPrompt();
    const [ initClass, setInitClass ] = useState<ClassForm>(buildEmptyClassForm());

    const {
        data,
        loading,
        refetch,
    } = useGetClass({
        variables: {
            id: classId ?? ``,
            organizationId: currentOrganization?.organization_id ?? ``,
        },
        fetchPolicy: `cache-and-network`,
        skip: !open || !classId || !currentOrganization?.organization_id,
    });

    useEffect(() => {
        if (!open || !data?.class) {
            setInitClass(buildEmptyClassForm());
            return;
        }

        setInitClass(data?.class ? mapClassToForm(data.class) : buildEmptyClassForm());
        setEditedClass(data?.class ? mapClassToForm(data.class) :  buildEmptyClassForm());
    }, [ open, data ]);

    const handleEdit = async () => {
        try {
            const {
                id,
                name,
                schools,
                programs,
                subjects,
                grades,
                ageRanges,
            } = editedClass;

            const response = await updateClass({
                variables: {
                    class_id: id,
                    class_name: name ?? ``,
                },
            });

            const classId = response?.data?.class?.class_id;

            if (!classId) {
                throw Error();
            }

            if (canEditSchool) {
                await editSchools({
                    variables: {
                        class_id: id,
                        school_ids: schools?.map((school) => school.school_id) ?? [],
                    },
                });
            }

            await editPrograms({
                variables: {
                    class_id: classId,
                    program_ids: programs?.map((program) => program.id ?? ``) ?? [],
                },
            });

            await editSubjects({
                variables: {
                    class_id: classId,
                    subject_ids: subjects ?? [],
                },
            });

            await editGrades({
                variables: {
                    class_id: classId,
                    grade_ids: grades ?? [],
                },
            });

            await editAgeRanges({
                variables: {
                    class_id: classId,
                    age_range_ids: ageRanges ?? [],
                },
            });

            // Update cache. Since multiple mutation queries may occur, refetch needs to be
            // called manually instead of calling if from updateCache method.
            refetch();
            onClose(editedClass);
            enqueueSnackbar(intl.formatMessage({
                id: `classes_editSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `classes_classSaveError`,
            }), {
                variant: `error`,
            });
        }
    };

    const handleDelete = async () => {
        if (!await deletePrompt({
            title: intl.formatMessage({
                id: `class_deleteClassTitle`,
            }),
            entityName: editedClass.name ?? ``,
        })) return;
        try {
            await deleteClass({
                variables: {
                    class_id: editedClass.id,
                },
            });
            onClose(editedClass);
            enqueueSnackbar(intl.formatMessage({
                id: `classes_classDeletedMessage`,
            }), {
                variant: `success`,
            });
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `classes_classDeletedError`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <Dialog
            open={open}
            title={intl.formatMessage({
                id: `class_editTitle`,
            })}
            actions={[
                {
                    label: intl.formatMessage({
                        id: `generic_deleteLabel`,
                    }),
                    color: `error`,
                    align: `left`,
                    onClick: handleDelete,
                },
                {
                    label: intl.formatMessage({
                        id: `generic_cancelLabel`,
                    }),
                    color: `primary`,
                    align: `right`,
                    onClick: () => onClose(),
                },
                {
                    label: intl.formatMessage({
                        id: `generic_saveLabel`,
                    }),
                    color: `primary`,
                    align: `right`,
                    disabled: !valid,
                    onClick: handleEdit,
                },
            ]}
            onClose={() => onClose()}
        >
            <ClassDialogForm
                key={initClass?.id}
                value={initClass}
                loading={loading}
                onChange={(value) => setEditedClass(value)}
                onValidation={setValid} />
        </Dialog>
    );
}
