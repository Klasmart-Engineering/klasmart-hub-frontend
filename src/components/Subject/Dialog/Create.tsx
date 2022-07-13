import SubjectDialogForm from "./Form";
import {
    useGetAllCategories,
    useUpdateCategories,
} from "@/api/categories";
import { useCreateOrUpdateSubjects } from "@/api/subjects";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    isCustomValue,
    isNonSpecified,
    isSystemValue,
    Subject,
} from "@/types/graphQL";
import { buildEmptyCategory } from "@/utils/categories";
import { buildEmptySubject } from "@/utils/subjects";
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
    onClose: (value?: Subject) => void;
}

export default function CreateSubjectDialog (props: Props) {
    const {
        open,
        onClose,
    } = props;
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const currentOrganization = useCurrentOrganization();
    const [ valid, setValid ] = useState(true);
    const [ newSubject, setNewSubject ] = useState(buildEmptySubject({
        categories: [ buildEmptyCategory() ],
    }));
    const [ updateCategories ] = useUpdateCategories();
    const [ createOrUpdateSubjects ] = useCreateOrUpdateSubjects();
    const organizationId = currentOrganization?.id ?? ``;
    const { data: categoriesData } = useGetAllCategories({
        variables: {
            organization_id: organizationId,
        },
        skip: !organizationId,
    });

    useEffect(() => {
        if (!open) return;
        const noneSpecifiedCategory = categoriesData?.organization.categories.find(isNonSpecified);
        setNewSubject(buildEmptySubject({
            categories: [ noneSpecifiedCategory ?? buildEmptyCategory() ],
        }));
    }, [ open ]);

    const handleCreateOrUpdate = async () => {
        try {
            const {
                id,
                name,
                categories,
            } = newSubject;
            const updatedCategories = categories?.map(category => buildEmptyCategory(category)) ?? [];
            const customCategories = updatedCategories.filter(isCustomValue);
            const systemCategories = updatedCategories.filter(isSystemValue);
            const updatedCategoriesResp = await updateCategories({
                variables: {
                    input: customCategories.map((category) => ({
                        id: category.id ?? ``,
                        subcategoryIds: category.subcategories?.map((subcategory) => subcategory.id)
                            .filter((id): id is string => !!id) ?? [],
                    })),
                },
            });

            await createOrUpdateSubjects({
                variables: {
                    organization_id: organizationId,
                    subjects: [
                        {
                            id,
                            name: name ?? ``,
                            categories: [ ...systemCategories, ...(updatedCategoriesResp.data?.updateCategories.categories ?? []) ].map((category) => category.id)
                                .filter((id): id is string => !!id),
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
