import { useDeleteOrganizationMembership } from "@/api/organizationMemberships";
import CreateUserDialog from "@/components/User/Dialog/Create";
import UploadUserCsvDialog from "@/components/User/Dialog/CsvUpload";
import EditUserDialog from "@/components/User/Dialog/Edit";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Status } from "@/types/graphQL";
import { useDeleteEntityPrompt } from "@/utils/common";
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
    AssignmentReturned as AssignmentReturnedIcon,
    CloudUpload as CloudUploadIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    PersonAdd as PersonAddIcon,
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
import {
    CursorTable,
    UserAvatar,
    useSnackbar,
} from "kidsloop-px";
import { TableFilter } from "kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
import { escapeRegExp } from "lodash";
import React,
{ useState } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `100%`,
    },
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
    status: string;
    joinDate: Date;
}

interface Props extends TableProps<UserRow> {
}

export default function UserTable (props: Props) {
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
    const [ uploadCsvDialogOpen, setUploadCsvDialogOpen ] = useState(false);
    const intl = useIntl();
    const deletePrompt = useDeleteEntityPrompt();
    const { enqueueSnackbar } = useSnackbar();
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;
    const { required } = useValidations();
    const [ createDialogOpen, setCreateDialogOpen ] = useState(false);
    const [ editDialogOpen, setEditDialogOpen ] = useState(false);
    const [ selectedUserId, setSelectedUserId ] = useState<string>();
    const createUsersPermissions = usePermission(`create_users_40220`);
    const createMySchoolsUsersPermissions = usePermission(`create_my_school_users_40221`);
    const canEdit = usePermission(`edit_users_40330`);
    const canDelete = usePermission(`delete_users_40440`);
    const [ deleteOrganizationMembership ] = useDeleteOrganizationMembership();
    const {
        schoolsFilterValueOptions,
        userRolesFilterValueOptions,
    } = useGetTableFilters(currentOrganization?.organization_id ?? ``, {
        querySchools: true,
        queryUserRoles: true,
    });

    const userCsvTemplateHeaders = [
        `organization_name`,
        `user_given_name`,
        `user_family_name`,
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

    const deleteSelectedRow = async (row: UserRow) => {
        const userName = `${row.givenName} ${row.familyName}`.trim();
        if (!(await deletePrompt({
            title: intl.formatMessage({
                id: `users_deleteTitle`,
            }),
            entityName: userName,
        }))) return;
        try {
            await deleteOrganizationMembership({
                variables: {
                    organization_id: organizationId,
                    user_id: row.id,
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
                const values = Array.isArray(row) ? row : [ row ];
                const regexp = new RegExp(escapeRegExp(searchValue.trim()), `gi`);
                return values.some((value) => {
                    const result = getCustomRoleName(intl, value).match(regexp);
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
            render: (row) => row.schoolNames?.map((schoolName, i) =>
                <Typography
                    key={`school-${i}`}
                    noWrap
                    variant="body2"
                >
                    {schoolName}
                </Typography>),
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
                const values = Array.isArray(row) ? row : [ row ];
                const regexp = new RegExp(escapeRegExp(searchValue.trim()), `gi`);
                return values.some((value) => {
                    const result = getCustomStatus(intl, value).match(regexp);
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
                    validations: [ required() ],
                    options: userRolesFilterValueOptions,
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersEqualsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
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
                    validations: [ required() ],
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
                    validations: [ required() ],
                    options: schoolsFilterValueOptions,
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersEqualsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
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
                    validations: [ required() ],
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersContainsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
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
                    validations: [ required() ],
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersContainsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                },
            ],
        },
    ];

    return (
        <>
            <Paper className={classes.root}>
                <CursorTable
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
                    primaryAction={{
                        label: intl.formatMessage({
                            id: `users_createUser`,
                        }),
                        icon: PersonAddIcon,
                        disabled: !(createUsersPermissions || createMySchoolsUsersPermissions),
                        onClick: () => setCreateDialogOpen(true),
                    }}
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
                        {
                            label: intl.formatMessage({
                                id: `users_deleteButton`,
                            }),
                            icon: DeleteIcon,
                            disabled: row.status === Status.INACTIVE || !canDelete,
                            onClick: deleteSelectedRow,
                        },
                    ]}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: intl.formatMessage({
                                id: `navMenu_usersTitle`,
                            }),
                        },
                        search: {
                            placeholder: intl.formatMessage({
                                id: `classes_searchPlaceholder`,
                            }),
                        },
                    })}
                    onPageChange={onPageChange}
                    onChange={onTableChange}
                />
            </Paper>
            <EditUserDialog
                open={editDialogOpen}
                userId={selectedUserId}
                onClose={() => {
                    setSelectedUserId(undefined);
                    setEditDialogOpen(false);
                }}
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
