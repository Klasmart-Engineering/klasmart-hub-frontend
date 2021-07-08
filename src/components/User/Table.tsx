import { useDeleteOrganizationMembership } from "@/api/organizationMemberships";
import CreateUserDialog from "@/components/User/Dialog/Create";
import UploadUserCsvDialog from "@/components/User/Dialog/CsvUpload";
import EditUserDialog from "@/components/User/Dialog/Edit";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Status } from "@/types/graphQL";
import { usePermission } from "@/utils/checkAllowed";
import { getCustomStatus } from "@/utils/status";
import { getTableLocalization } from "@/utils/table";
import { getCustomRoleName } from "@/utils/userRoles";
import { useValidations } from "@/utils/validations";
import {
    Box,
    createStyles,
    DialogContentText,
    makeStyles,
    Paper,
    Typography,
} from "@material-ui/core";
import {
    CloudUpload as CloudUploadIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    PersonAdd as PersonAddIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import {
    CursorTable,
    usePrompt,
    UserAvatar,
    useSnackbar,
} from "kidsloop-px";
import {
    Order,
    TableColumn,
} from "kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "kidsloop-px/dist/types/components/Table/Cursor/Table";
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

export interface UserItem {
    id: string;
    givenName: string;
    familyName: string;
    avatar: string;
    contactInfo: string;
    roleNames: string[];
    schoolNames: string[];
    status: string;
    joinDate: Date;
}

interface Props {
    items: UserItem[];
    loading: boolean;
    order?: string;
    orderBy?: string;
    rowsPerPage?: number;
    search?: string;
    cursor?: string;
    total?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    startCursor?: string;
    endCursor?: string;
    onPageChange: (pageChange: PageChange, order: Order, cursor: string | undefined, rowsPerPage: number) => Promise<void>;
    onTableChange: (tableData: CursorTableData<UserItem>) => Promise<void>;
    refetch: () => Promise<any> | void;
}

export default function UserTable (props: Props) {
    const {
        items,
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
    const prompt = usePrompt();
    const { enqueueSnackbar } = useSnackbar();
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;
    const { required, equals } = useValidations();
    const [ createDialogOpen, setCreateDialogOpen ] = useState(false);
    const [ editDialogOpen, setEditDialogOpen ] = useState(false);
    const [ selectedUserId, setSelectedUserId ] = useState<string>();
    const canCreate = usePermission(`create_users_40220`);
    const canEdit = usePermission(`edit_users_40330`);
    const canDelete = usePermission(`delete_users_40440`);
    const [ deleteOrganizationMembership ] = useDeleteOrganizationMembership();

    const editSelectedRow = (row: UserItem) => {
        setSelectedUserId(row.id);
        setEditDialogOpen(true);
    };

    const deleteSelectedRow = async (row: UserItem) => {
        const userName = `${row.givenName} ${row.familyName}`.trim();
        if (!await prompt({
            variant: `error`,
            title: intl.formatMessage({
                id: `users_deleteTitle`,
            }),
            content: (
                <>
                    <DialogContentText>{intl.formatMessage({
                        id: `generic_deleteText`,
                    }, {
                        value: userName,
                    })}</DialogContentText>
                    <DialogContentText>{intl.formatMessage({
                        id: `generic_typeToDeletePrompt`,
                    }, {
                        value: <strong>{userName}</strong>,
                    })}</DialogContentText>
                </>
            ),
            okLabel: intl.formatMessage({
                id: `generic_deleteLabel`,
            }),
            cancelLabel: intl.formatMessage({
                id: `generic_cancelLabel`,
            }),
            validations: [ required(), equals(userName) ],
        })) return;
        try {
            await deleteOrganizationMembership({
                variables: {
                    organization_id: organizationId,
                    user_id: row.id,
                },
            });
            await refetch();
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

    const columns: TableColumn<UserItem>[] = [
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
                id: `users_organizationRoles`,
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

    return (
        <>
            <Paper className={classes.root}>
                <CursorTable
                    columns={columns}
                    rows={items}
                    loading={loading}
                    idField="id"
                    orderBy={orderBy}
                    order={order}
                    rowsPerPage={rowsPerPage}
                    search={search}
                    cursor={cursor}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    startCursor={startCursor}
                    endCursor={endCursor}
                    total={total}
                    primaryAction={{
                        label: intl.formatMessage({
                            id: `users_createUser`,
                        }),
                        icon: PersonAddIcon,
                        disabled: !canCreate,
                        onClick: () => setCreateDialogOpen(true),
                    }}
                    secondaryActions={[
                        {
                            label: `Upload CSV`,
                            icon: CloudUploadIcon,
                            disabled: !canCreate,
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
                        body: {
                            noData: intl.formatMessage({
                                id: `classes_noRecords`,
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
                onClose={(value) => {
                    setSelectedUserId(undefined);
                    setEditDialogOpen(false);
                    if (value) refetch();
                }}
            />
            <CreateUserDialog
                open={createDialogOpen}
                onClose={(value) => {
                    setCreateDialogOpen(false);
                    if (value) refetch();
                }}
            />
            <UploadUserCsvDialog
                open={uploadCsvDialogOpen}
                onClose={(value) => {
                    setUploadCsvDialogOpen(false);
                    if (value) refetch();
                }}
            />
        </>
    );
}
