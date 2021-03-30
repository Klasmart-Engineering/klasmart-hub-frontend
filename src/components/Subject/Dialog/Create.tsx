import SubjectDialogForm from "./Form";
import {
    useCreateOrUpdateCategories,
    useGetAllCategories,
} from "@/api/categories";
import {
    useCreateOrUpdateSubcategories,
    useGetAllSubcategories,
} from "@/api/subcategories";
import { useCreateOrUpdateSubjects } from "@/api/subjects";
import { currentMembershipVar } from "@/cache";
import {
    isCustomValue,
    isNonSpecified,
    isSystemValue,
    Subject,
} from "@/types/graphQL";
import { buildEmptyCategory } from "@/utils/categories";
import { buildEmptySubject } from "@/utils/subjects";
import { useReactiveVar } from "@apollo/client";
import {
    Dialog,
    useSnackbar,
} from "kidsloop-px";
import React, {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

interface Props {
    open: boolean;
    onClose: (value?: Subject) => void;
}

export default function CreateSubjectDialog (props: Props) {
    const {
        open,
        onClose,
    } = props;
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const { organization_id } = useReactiveVar(currentMembershipVar);
    const [ valid, setValid ] = useState(true);
    const [ newSubject, setNewSubject ] = useState(buildEmptySubject({
        categories: [ buildEmptyCategory() ],
    }));
    const [ createOrUpdateSubcategories ] = useCreateOrUpdateSubcategories();
    const [ createOrUpdateCategories ] = useCreateOrUpdateCategories();
    const [ createOrUpdateSubjects ] = useCreateOrUpdateSubjects();
    const { data: categoriesData } = useGetAllCategories({
        variables: {
            organization_id,
        },
    });

    useEffect(() => {
        if (!open) return;
        const noneSpecifiedCategory = categoriesData?.organization.categories.find(isNonSpecified);
        setNewSubject(buildEmptySubject({
            categories: [ noneSpecifiedCategory ?? buildEmptyCategory() ],
        }));
    }, [ open, categoriesData ]);

    const handleCreateOrUpdate = async () => {
        try {
            const {
                id,
                name,
                categories,
            } = newSubject;

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

            onClose(newSubject);
            enqueueSnackbar(intl.formatMessage({
                id: `subjects_subjectCreateMessage`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `subjects_subjectCreateError`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <Dialog
            open={open}
            title={intl.formatMessage({
                id: `subjects_createSubjectLabel`,
            })}
            actions={[
                {
                    label: intl.formatMessage({
                        id: `generic_cancelLabel`,
                    }),
                    color: `primary`,
                    onClick: () => onClose(),
                },
                {
                    label: intl.formatMessage({
                        id: `subjects_createLabel`,
                    }),
                    color: `primary`,
                    disabled: !valid,
                    onClick: handleCreateOrUpdate,
                },
            ]}
            onClose={() => onClose()}
        >
            <SubjectDialogForm
                value={newSubject}
                onChange={setNewSubject}
                onValidation={setValid}
            />
        </Dialog>
    );
}
