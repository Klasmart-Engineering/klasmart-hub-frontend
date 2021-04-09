import ClassDialogForm from "./Form";
import {
    useCreateClass,
    useEditClassAgeRanges,
    useEditClassGrades,
    useEditClassPrograms,
    useEditClassSubjects,
} from "@/api/classes";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Class } from "@/types/graphQL";
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
    onClose: (value?: Class) => void;
}

export default function CreateClassDialog (props: Props) {
    const { open, onClose } = props;
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const currentOrganization = useCurrentOrganization();
    const [ valid, setValid ] = useState(true);
    const [ newClass, setNewClass ] = useState(buildEmptyClass());
    const [ createClass ] = useCreateClass();
    const [ createPrograms ] = useEditClassPrograms();
    const [ createSubjects ] = useEditClassSubjects();
    const [ createGrades ] = useEditClassGrades();
    const [ createAgeRanges ] = useEditClassAgeRanges();

    useEffect(() => {
        if (!open) return;
        setNewClass(buildEmptyClass());
    }, [ open ]);

    const handleCreate = async () => {
        try {
            const {
                class_name,
                schools,
                programs,
                subjects,
                grades,
                age_ranges,
            } = newClass;

            const variables = {
                organization_id: currentOrganization?.organization_id ?? ``,
                class_name: class_name ?? ``,
                school_ids: schools?.map((school) => school.school_id) ?? [],
            };

            const response = await createClass({
                variables,
            });

            const classId = response?.data?.organization?.createClass?.class_id;

            if (!classId) {
                throw Error();
            }

            await createPrograms({
                variables: {
                    class_id: classId,
                    program_ids: programs?.map((program) => program.id ?? ``) ?? [],
                },
            });

            await createSubjects({
                variables: {
                    class_id: classId,
                    subject_ids: subjects?.map((subject) => subject.id ?? ``) ?? [],
                },
            });

            await createGrades({
                variables: {
                    class_id: classId,
                    grade_ids: grades?.map((grade) => grade.id ?? ``) ?? [],
                },
            });

            await createAgeRanges({
                variables: {
                    class_id: classId,
                    age_range_ids: age_ranges?.map((ageRange) => ageRange.id ?? ``) ?? [],
                },
            });

            onClose(newClass);
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
