import EditBulkUserDialog from "./Dialog/EditBulkStatus";
import {
    useDeactivateUsersInOrganization,
    useDeleteUsersInOrganization,
    useReactivateUsersInOrganization,
} from "@/api/organizationMemberships";
import CreateUserDialog from "@/components/User/Dialog/Create";
import UploadUserCsvDialog from "@/components/User/Dialog/CsvUpload";
import EditUserDialog from "@/components/User/Dialog/Edit";
import { useCurrentOrganization, useCurrentOrganizationMembership } from "@/store/organizationMemberships";
import { Status, User } from "@/types/graphQL";
import {
    useDeleteEntityPrompt,
    useMarkInactiveEntityPrompt,
} from "@/utils/common";
import {
    buildCsvTemplateOptions,
    EMPTY_CSV_DATA,
} from "@/utils/csv";
import { useGetTableFilters } from "@/utils/filters";
import { usePermission } from "@/utils/permissions";
import { getCustomStatus } from "@/utils/status";
import {
    getTableLocalization,
    TableProps,
} from "@/utils/table";
import { getCustomRoleName } from "@/utils/userRoles";
import { useValidations } from "@/utils/validations";
import {
    CursorTable,
    UserAvatar,
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import { TableFilter } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Filter/Filters";
import { TableColumn } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Head";
import {
    AssignmentReturned as AssignmentReturnedIcon,
    CloudUpload as CloudUploadIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    PersonAdd as PersonAddIcon,
    Refresh as RefreshIcon,
    RemoveCircleOutline as InactiveIcon,
} from "@mui/icons-material";
import {
    Box,
    Paper,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import clsx from "clsx";
import { escapeRegExp } from "lodash";
import { useState } from "react";
import { useIntl } from "react-intl";
import is from "date-fns/esm/locale/is/index.js";
import { useQueryMyUser } from "@/api/myUser";

const useStyles = makeStyles((theme) => createStyles({
    avatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
        color: `white`,
        marginRight: 16,
        fontSize: 10,
    },
    activeColor: {
        color: theme.palette.success.main,
    },
    inactiveColor: {
        color: theme.palette.error.main,
    },
    statusText: {
        fontWeight: `bold`,
        textTransform: `capitalize`,
    },
}));

export interface UserRow {
    id: string;
    givenName: string;
    familyName: string;
    avatar: string;
    contactInfo?: string;
    email: string;
    phone: string;
    roleNames: string[];
    schoolNames: string[];
    classNames: string[];
    gradeNames: string[];
    status: string;
    joinDate: Date;
}

interface Props extends TableProps<UserRow> {
}

export default function UserTable(props: Props) {
    const {
        rows,
        loading,
        order,
        orderBy,
        rowsPerPage,
        search,
        cursor,
        refetch,
        total,
        hasNextPage,
        hasPreviousPage,
        startCursor,
        endCursor,
        onPageChange,
        onTableChange,
    } = props;
    const classes = useStyles();
    const [uploadCsvDialogOpen, setUploadCsvDialogOpen] = useState(false);
    const intl = useIntl();
    const deletePrompt = useDeleteEntityPrompt();
    const markInactivePrompt = useMarkInactiveEntityPrompt();
    const { enqueueSnackbar } = useSnackbar();
    const currentOrganization = useCurrentOrganization();
    const { data: userData } = useQueryMyUser();
    const organizationId = currentOrganization?.id ?? ``;
    const userId = userData?.myUser.node.id;
    const { required } = useValidations();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [showBulkUserDilog, setShowBulkUserDilog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string>();
    const [selectedUsers, setSelectedUsers] = useState<UserRow[]>([]);
    const [isMismatch, setIsMismatch] = useState(false);
    const createUsersPermissions = usePermission(`create_users_40220`);
    const createMySchoolsUsersPermissions = usePermission(`create_my_school_users_40221`);
    const canEdit = usePermission(`edit_users_40330`);
    const canDelete = usePermission(`delete_users_40440`);
    const canReactivateUserInOrg = usePermission(`reactivate_user_40884`);
    const canDeactivateUserInOrg = usePermission(`deactivate_user_40883`);
    const [deleteUserInOrganization] = useDeleteUsersInOrganization();
    const [reactivateUserInOrganization] = useReactivateUsersInOrganization();
    const [deactivateUserInOrganization] = useDeactivateUsersInOrganization();
    const {
        schoolsFilterValueOptions,
        userRolesFilterValueOptions,
        classFilterValueOptions,
        gradeFilterValueOptions,
    } = useGetTableFilters(organizationId, {
        queryClass: true,
        querySchools: true,
        queryGrades: true,
        queryUserRoles: true,
    });

    const userCsvTemplateHeaders = [
        `organization_name`,
        `user_given_name`,
        `user_family_name`,
        `user_username`,
        `user_shortcode`,
        `user_email`,
        `user_phone`,
        `user_date_of_birth`,
        `user_gender`,
        `organization_role_name`,
        `school_name`,
        `class_name`,
    ];

    const csvExporter = buildCsvTemplateOptions({
        filename: intl.formatMessage({
            id: `entity.user.importTemplate.filename`,
        }),
        headers: userCsvTemplateHeaders,
    });

    const editSelectedRow = (row: UserRow) => {
        setSelectedUserId(row.id);
        setEditDialogOpen(true);
    };

    const reactivateSelectedRow = async (row: UserRow) => {
        try {
            await reactivateUserInOrganization({
                variables: {
                    organizationId,
                    userIds: [row.id],
                },
            });

            enqueueSnackbar(intl.formatMessage({
                id: `user.reactivate.action.success`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `editDialog_deleteError`,
            }), {
                variant: `error`,
            });
        }
    };

    const markInactiveSelectedRow = async (row: UserRow) => {
        const userName = `${row.givenName} ${row.familyName}`.trim();
        if (!await markInactivePrompt({
            title: intl.formatMessage({
                id: `user.inactivate.title`,
            }),
            entityName: userName,
        })) return;
        try {
            await deactivateUserInOrganization({
                variables: {
                    organizationId,
                    userIds: [row.id],
                },
            });
            enqueueSnackbar(intl.formatMessage({
                id: `user.inactivate.action.success`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `editDialog_deleteError`,
            }), {
                variant: `error`,
            });
        }
    };

    const deleteSelectedRow = async (row: UserRow) => {
        const userName = `${row.givenName} ${row.familyName}`.trim();
        if (!(await deletePrompt({
            title: intl.formatMessage({
                id: `users_deleteTitle`,
            }),
            entityName: userName,
            isUser: true
           }))) return;
        try {
            await deleteUserInOrganization({
                variables: {
                    organizationId,
                    userIds: [row.id],
                },
            });
            enqueueSnackbar(intl.formatMessage({
                id: `editDialog_deleteSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `editDialog_deleteError`,
            }), {
                variant: `error`,
            });
        }
    };

    const columns: TableColumn<UserRow>[] = [
        {
            id: `id`,
            label: `ID`,
            disableSort: true,
            secret: true,
        },
        {
            id: `givenName`,
            persistent: true,
            label: intl.formatMessage({
                id: `users_firstName`,
            }),
            render: (row) => (
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                >
                    <UserAvatar
                        name={`${row.givenName} ${row.familyName}`}
                        size="small"
                        className={classes.avatar}
                    />
                    <span>{row.givenName}</span>
                </Box>
            ),
        },
        {
            id: `familyName`,
            persistent: true,
            label: intl.formatMessage({
                id: `users_lastName`,
            }),
        },
        {
            id: `roleNames`,
            disableSort: true,
            label: intl.formatMessage({
                id: `organization.roles`,
            }, {
                count: 2,
            }),
            search: (row: string[], searchValue: string) => {
                const values = Array.isArray(row) ? row : [row];
                const regexp = new RegExp(escapeRegExp(searchValue.trim()), `gi`);
                return values.some((value) => {
                    const result = getCustomRoleName(intl, value)
                        .match(regexp);
                    return !!result;
                });
            },
            render: (row) => row.roleNames.map((roleName, i) => (
                <Typography
                    key={`role-${i}`}
                    noWrap
                    variant="body2"
                >
                    {getCustomRoleName(intl, roleName)}
                </Typography>
            )),
        },
        {
            id: `schoolNames`,
            disableSort: true,
            label: intl.formatMessage({
                id: `users_school`,
            }),
            render: (row) => row.schoolNames?.map((schoolName, i) => (
                <Typography
                    key={`school-${i}`}
                    noWrap
                    variant="body2"
                >
                    {schoolName}
                </Typography>
            )),
        },
        {
            id: `classNames`,
            disableSort: true,
            hidden: true,
            label: `Class`,
            render: (row) => row.classNames?.map((className, i) => (
                <Typography
                    key={`class-${i}`}
                    noWrap
                    variant="body2"
                >
                    {className}
                </Typography>
            )),
        },
        {
            id: `gradeNames`,
            disableSort: true,
            hidden: true,
            label: `Grade`,
            render: (row) => row.gradeNames?.map((gradeName, i) => (
                <Typography
                    key={`class-${i}`}
                    noWrap
                    variant="body2"
                >
                    {gradeName}
                </Typography>
            )),
        },
        {
            id: `contactInfo`,
            disableSort: true,
            label: intl.formatMessage({
                id: `users_contactInfo`,
            }),
            render: (row) => (
                <span>
                    {row.email || row.phone}
                </span>
            ),
        },
        {
            id: `status`,
            disableSort: true,
            label: intl.formatMessage({
                id: `classes_statusTitle`,
            }),
            search: (row: string[], searchValue: string) => {
                const values = Array.isArray(row) ? row : [row];
                const regexp = new RegExp(escapeRegExp(searchValue.trim()), `gi`);
                return values.some((value) => {
                    const result = getCustomStatus(intl, value)
                        .match(regexp);
                    return !!result;
                });
            },
            render: (row) => (
                <span
                    className={clsx(classes.statusText, {
                        [classes.activeColor]: row.status === Status.ACTIVE,
                        [classes.inactiveColor]: row.status === Status.INACTIVE,
                    })}
                >
                    {intl.formatMessage({
                        id: `users_${row.status}Status`,
                    })}
                </span>
            ),
        },
        {
            id: `joinDate`,
            disableSort: true,
            label: intl.formatMessage({
                id: `users_joinDate`,
            }),
            render: (row) => <span>{intl.formatDate(row.joinDate)}</span>,
        },
    ];

    const filters: TableFilter<UserRow>[] = [
        {
            id: `roleNames`,
            label: intl.formatMessage({
                id: `organization.roles`,
            }, {
                count: 2,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersEqualsLabel`,
                    }),
                    value: `eq`,
                    multipleValues: true,
                    validations: [required()],
                    options: userRolesFilterValueOptions,
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersEqualsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                    valueComponent: `select`,
                },
            ],
        },
        {
            id: `status`,
            label: intl.formatMessage({
                id: `classes_statusTitle`,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersEqualsLabel`,
                    }),
                    value: `eq`,
                    validations: [required()],
                    options: [
                        {
                            value: Status.ACTIVE,
                            label: intl.formatMessage({
                                id: `users_activeStatus`,
                            }),
                        },
                        {
                            value: Status.INACTIVE,
                            label: intl.formatMessage({
                                id: `users_inactiveStatus`,
                            }),
                        },
                    ],
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersEqualsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                    valueComponent: `select`,
                },
            ],
        },
        {
            id: `schoolNames`,
            label: intl.formatMessage({
                id: `classes_schoolsNameLabel`,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersEqualsLabel`,
                    }),
                    value: `eq`,
                    multipleValues: true,
                    validations: [required()],
                    options: schoolsFilterValueOptions,
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersEqualsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                    valueComponent: `select`,
                },
            ],
        },
        {
            id: `classNames`,
            label: intl.formatMessage({
                id: `classes_classTitle`,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersEqualsLabel`,
                    }),
                    value: `eq`,
                    multipleValues: true,
                    validations: [required()],
                    options: classFilterValueOptions,
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersEqualsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                    valueComponent: `select`,
                },
            ],
        },
        {
            id: `gradeNames`,
            label: intl.formatMessage({
                id: `class_gradeLabel`,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersEqualsLabel`,
                    }),
                    value: `eq`,
                    multipleValues: true,
                    validations: [required()],
                    options: gradeFilterValueOptions,
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersEqualsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                    valueComponent: `select`,
                },
            ],
        },
        {
            id: `email`,
            label: intl.formatMessage({
                id: `common.email`,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersContainsLabel`,
                    }),
                    value: `contains`,
                    validations: [required()],
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersContainsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                    valueComponent: `text-field`,
                },
            ],
        },
        {
            id: `phone`,
            label: intl.formatMessage({
                id: `common.phone`,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersContainsLabel`,
                    }),
                    value: `contains`,
                    validations: [required()],
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersContainsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                    valueComponent: `text-field`,
                },
            ],
        },
    ];

    const onSelected = (ids: string[]) => {
        const updatedUsers = ids.reduce<any>((obj, id) =>
        ({
            ...obj, [id]: {
                id, ...[...selectedUsers, ...rows]
                    .find(row => row.id === id)
            }
        }),
            {}) || {};
        setSelectedUsers(Object.values(updatedUsers));
    };

    const resteSelected = () => {
        setSelectedUsers([]);
    }

    const verifyEdit = (selectedUsers: UserRow[]) => {
        const hasCurrectUser = !!selectedUsers.find(user => user.id === userId);
        if (hasCurrectUser) {
            enqueueSnackbar(intl.formatMessage({
                id: `entity.user.edit.self.error`,
            }), {
                variant: `error`,
            });
            return;
        }
        const hasActiveUser = !!selectedUsers.find(user => user.status === 'active');
        const hasInactiveUser = !!selectedUsers.find(user => user.status === 'inactive');
        setIsMismatch(hasActiveUser && hasInactiveUser);
        setShowBulkUserDilog(true);
    };

    return (
        <>
            <CursorTable
                showSelectables={canEdit}
                filters={filters}
                columns={columns}
                rows={rows}
                loading={loading}
                idField="id"
                orderBy={orderBy}
                order={order}
                rowsPerPage={rowsPerPage}
                search={search}
                cursor={cursor}
                hasNextPage={!loading ? hasNextPage : false}
                hasPreviousPage={!loading ? hasPreviousPage : false}
                startCursor={startCursor}
                endCursor={endCursor}
                total={total}
                onSelected={onSelected}
                selectedRows={selectedUsers.map(({ id }) => id)}
                primaryAction={{
                    label: intl.formatMessage({
                        id: `users_createUser`,
                    }),
                    icon: PersonAddIcon,
                    disabled: !(createUsersPermissions || createMySchoolsUsersPermissions),
                    onClick: () => setCreateDialogOpen(true),
                }}
                selectActions={canEdit ? [
                    {
                        label: intl.formatMessage({
                            id: `entity.user.template.edit.button`,
                        }),
                        icon: EditIcon,
                        onClick: () => verifyEdit(selectedUsers),
                    },
                ]: []}
                secondaryActions={[
                    {
                        label: intl.formatMessage({
                            id: `entity.user.template.download.button`,
                        }),
                        icon: AssignmentReturnedIcon,
                        disabled: !createUsersPermissions,
                        onClick: () => csvExporter.generateCsv(EMPTY_CSV_DATA),
                    },
                    {
                        label: intl.formatMessage({
                            id: `entity.user.bulkImport.button`,
                        }),
                        icon: CloudUploadIcon,
                        disabled: !createUsersPermissions,
                        onClick: () => setUploadCsvDialogOpen(true),
                    },
                ]}
                rowActions={(row) => [
                    {
                        label: intl.formatMessage({
                            id: `users_editButton`,
                        }),
                        icon: EditIcon,
                        disabled: row.status === Status.INACTIVE || !canEdit,
                        onClick: editSelectedRow,
                    },
                    ...(canReactivateUserInOrg && row.status === Status.INACTIVE) ?
                        [
                            {
                                label: intl.formatMessage({
                                    id: `common.action.reactivate`,
                                }),
                                icon: RefreshIcon,
                                disabled: false,
                                onClick: reactivateSelectedRow,
                            },
                        ] : [],
                    ...(canDeactivateUserInOrg && row.status === Status.ACTIVE) ?
                        [
                            {
                                label: intl.formatMessage({
                                    id: `common.action.inactive`,
                                }),
                                disabled: false,
                                icon: InactiveIcon,
                                onClick: markInactiveSelectedRow,
                            },
                        ] : [],
                    {
                        label: intl.formatMessage({
                            id: `users_deleteButton`,
                        }),
                        icon: DeleteIcon,
                        disabled: !canDelete,
                        onClick: deleteSelectedRow,
                    },
                ]}
                localization={getTableLocalization(intl, {
                    title: intl.formatMessage({
                        id: `navMenu_usersTitle`,
                    }),
                    placeholder: intl.formatMessage({
                        id: `classes_searchPlaceholder`,
                    }),
                })}
                onPageChange={onPageChange}
                onChange={onTableChange}
            />
            <EditUserDialog
                open={editDialogOpen}
                userId={selectedUserId}
                onClose={() => {
                    setSelectedUserId(undefined);
                    setEditDialogOpen(false);
                }}
            />
            <EditBulkUserDialog
                open={showBulkUserDilog}
                selectedUsers={selectedUsers}
                isMismatch={isMismatch}
                onClose={() => setShowBulkUserDilog(false)}
                handleReset={resteSelected}
            />
            <CreateUserDialog
                open={createDialogOpen}
                onClose={() => {
                    setCreateDialogOpen(false);
                }}
            />
            <UploadUserCsvDialog
                open={uploadCsvDialogOpen}
                onClose={(value) => {
                    setUploadCsvDialogOpen(false);
                    if (value) refetch?.();
                }}
            />
        </>
    );
}
