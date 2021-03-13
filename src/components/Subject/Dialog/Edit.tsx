import SubjectDialogForm from "./Form";
import { useCreateOrUpdateCategories } from "@/api/categories";
import { useCreateOrUpdateSubcategories } from "@/api/subcategories";
import {
    useCreateOrUpdateSubjects,
    useDeleteSubject,
} from "@/api/subjects";
import { currentMembershipVar } from "@/cache";
import {
    isCustomValue,
    isSystemValue,
    Subject,
} from "@/types/graphQL";
import { buildEmptyCategory } from "@/utils/categories";
import { usePermission } from "@/utils/checkAllowed";
import { buildEmptySubject } from "@/utils/subjects";
import { useValidations } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
import { DialogContentText } from "@material-ui/core";
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

interface Props {
    value?: Subject;
    open: boolean;
    onClose: (value?: Subject) => void;
}

export default function CreateSubjectDialog (props: Props) {
    const {
        value,
        open,
        onClose,
    } = props;
    const intl = useIntl();
    const prompt = usePrompt();
    const { required, equals } = useValidations();
    const { enqueueSnackbar } = useSnackbar();
    const canDelete = usePermission(`delete_subjects_20447`);
    const { organization_id } = useReactiveVar(currentMembershipVar);
    const [ valid, setValid ] = useState(true);
    const [ updatedSubject, setUpdatedSubject ] = useState(value ?? buildEmptySubject());
    const [ createOrUpdateSubcategories ] = useCreateOrUpdateSubcategories();
    const [ createOrUpdateCategories ] = useCreateOrUpdateCategories();
    const [ createOrUpdateSubjects ] = useCreateOrUpdateSubjects();
    const [ deleteSubject ] = useDeleteSubject();

    useEffect(() => {
        if (!open) return;
        setUpdatedSubject(value ?? buildEmptySubject());
    }, [ open ]);

    const handleSave = async () => {
        try {
            const {
                id,
                name,
                categories,
            } = updatedSubject;

            const updatedCategories = await Promise.all((categories ?? []).map(async (category) => {
                const customSubcategories = category?.subcategories?.filter(isCustomValue) ?? [];
                const systemSubcategories = category?.subcategories?.filter(isSystemValue) ?? [];
                const subcategoriesResp = await createOrUpdateSubcategories({
                    variables: {
                        organization_id,
                        subcategories: customSubcategories.map((subcategory) => ({
                            id: subcategory.id,
                            name: subcategory.name ?? ``,
                        })) ?? [],
                    },
                });
                return buildEmptyCategory({
                    ...category,
                    subcategories: [ ...systemSubcategories, ...subcategoriesResp.data?.organization.createOrUpdateSubcategories ?? [] ],
                });
            }));

            const customCategories = updatedCategories.filter(isCustomValue);
            const systemCategories = updatedCategories.filter(isSystemValue);
            const updatedCategoriesResp = await createOrUpdateCategories({
                variables: {
                    organization_id,
                    categories: customCategories.map((category) => ({
                        id: category.id,
                        name: category.name ?? ``,
                        subcategories: category.subcategories?.map((subcategory) => subcategory.id).filter((id): id is string => !!id) ?? [],
                    })),
                },
            });

            await createOrUpdateSubjects({
                variables: {
                    organization_id,
                    subjects: [
                        {
                            id,
                            name: name ?? ``,
                            categories: [ ...systemCategories, ...updatedCategoriesResp.data?.organization.createOrUpdateCategories ?? [] ].map((category) => category.id).filter((id): id is string => !!id),
                        },
                    ],
                },
            });

            onClose(updatedSubject);
            enqueueSnackbar(intl.formatMessage({
                id: `subjects_subjectSavedMessage`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `subjects_subjectSaveError`,
            }), {
                variant: `error`,
            });
        }
    };

    const handleDelete = async () => {
        try {
            if (!await prompt({
                variant: `error`,
                title: `Delete Subject`,
                okLabel: `Delete`,
                content: <>
                    <DialogContentText>Are you sure you want to delete {`"${value?.name}"`}?</DialogContentText>
                    <DialogContentText>Type <strong>{value?.name}</strong> to confirm deletion.</DialogContentText>
                </>,
                validations: [ required(), equals(value?.name) ],
            })) return;
            await deleteSubject({
                variables: {
                    id: value?.id ?? ``,
                },
            });
            onClose(updatedSubject);
            enqueueSnackbar(`Subject successfully deleted`, {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    return (
        <Dialog
            open={open}
            title="Edit Subject"
            actions={[
                {
                    label: `Delete`,
                    color: `error`,
                    align: `left`,
                    disabled: !canDelete,
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
                    disabled: !valid,
                    onClick: handleSave,
                },
            ]}
            onClose={() => onClose()}
        >
            <SubjectDialogForm
                value={updatedSubject}
                onChange={setUpdatedSubject}
                onValidation={setValid}
            />
        </Dialog>
    );
}
