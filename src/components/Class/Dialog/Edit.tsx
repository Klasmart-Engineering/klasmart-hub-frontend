import ClassDialogForm from "./Form";
import {
    useEditClassAgeRanges,
    useEditClassGrades,
    useEditClassPrograms,
    useEditClassSchools,
    useEditClassSubjects,
    useUpdateClass,
} from "@/api/classes";
import { Class } from "@/types/graphQL";
import { usePermission } from "@/utils/checkAllowed";
import { buildEmptyClass } from "@/utils/classes";
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
    value?: Class;
    onClose: (value?: Class) => void;
}

export default function EditClassDialog (props: Props) {
    const {
        open,
        value,
        onClose,
    } = props;
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ editedClass, setEditedClass ] = useState(buildEmptyClass());
    const [ valid, setValid ] = useState(true);
    const [ updateClass ] = useUpdateClass();
    const [ editSchools ] = useEditClassSchools();
    const [ editPrograms ] = useEditClassPrograms();
    const [ editSubjects ] = useEditClassSubjects();
    const [ editGrades ] = useEditClassGrades();
    const [ editAgeRanges ] = useEditClassAgeRanges();
    const canEditSchool = usePermission(`edit_school_20330`);

    useEffect(() => {
        setEditedClass(value ?? buildEmptyClass());
    }, [ value ]);

    const handleEdit = async () => {
        try {
            const {
                class_id,
                class_name,
                schools,
                programs,
                subjects,
                grades,
                age_ranges,
            } = editedClass;

            const response = await updateClass({
                variables: {
                    class_id,
                    class_name: class_name ?? ``,
                },
            });

            const classId = response?.data?.class?.class_id;

            if (!classId) {
                throw Error();
            }

            if (canEditSchool) {
                await editSchools({
                    variables: {
                        class_id,
                        school_ids: schools?.map((school) => school.school_id) ?? [],
                    },
                });
            }

            await editPrograms({
                variables: {
                    class_id: classId,
                    program_ids: programs?.map((program) => program.id) ?? [],
                },
            });

            await editSubjects({
                variables: {
                    class_id: classId,
                    subject_ids: subjects?.map((subject) => subject.id ?? ``) ?? [],
                },
            });

            await editGrades({
                variables: {
                    class_id: classId,
                    grade_ids: grades?.map((grade) => grade.id ?? ``) ?? [],
                },
            });

            await editAgeRanges({
                variables: {
                    class_id: classId,
                    age_range_ids: age_ranges?.map((ageRange) => ageRange.id) ?? [],
                },
            });

            onClose(editedClass);
            enqueueSnackbar(intl.formatMessage({
                id: `classes_classSavedMessage`,
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

    return (
        <Dialog
            open={open}
            title="Edit class"
            actions={[
                {
                    label: `Cancel`,
                    color: `primary`,
                    align: `right`,
                    onClick: () => onClose(),
                },
                {
                    label: `Edit`,
                    color: `primary`,
                    align: `right`,
                    disabled: !valid,
                    onClick: handleEdit,
                },
            ]}
            onClose={() => onClose()}
        >
            <ClassDialogForm
                value={editedClass}
                onChange={(value) => setEditedClass(value)}
                onValidation={setValid} />
        </Dialog>
    );
}
