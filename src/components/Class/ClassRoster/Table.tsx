import {
    ClassUserRow,
    useGetClassNodeRoster,
    useRemoveClassStudent,
    useRemoveClassTeacher,
} from "@/api/classRoster";
import { UserNode } from "@/api/users";
import SchoolRoster from "@/components/Class/SchoolRoster/Table";
import { buildClassNodeUserSearchFilter } from "@/operations/queries/getClassNodeRoster";
import {
    DEFAULT_ROWS_PER_PAGE,
    getTableLocalization,
    pageChangeToDirection,
    ServerCursorPagination,
    tableToServerOrder,
} from "@/utils/table";
import { getCustomRoleName } from "@/utils/userRoles";
import { useValidations } from "@/utils/validations";
import {
    Delete as DeleteIcon,
    PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import {
    Box,
    DialogContentText,
    Paper,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import {
    CursorTable,
    FullScreenDialog,
    usePrompt,
    UserAvatar,
} from "kidsloop-px";
import {
    Order,
    TableColumn,
} from "kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "kidsloop-px/dist/types/components/Table/Cursor/Table";
import React,
{ useState } from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `100%`,
    },
    userName: {
        marginLeft: theme.spacing(2),
    },
}));

interface Props {
    open: boolean;
    onClose: () => void;
    classId?: string;
    className?: string;
    organizationId: string;
}

const mapUserRow = (edge: { node: UserNode }, role: string): ClassUserRow => ({
    givenName: edge.node.givenName ?? ``,
    familyName: edge.node.familyName ?? ``,
    role,
    id: `${edge.node.id}-${role}`,
    organizationRoles: edge.node.roles?.map((role) => (
        role.name ?? ``
    )) ?? [],
    dateOfBirth: edge.node.dateOfBirth ?? null,
    contactInfo: edge.node.contactInfo?.email || edge.node.contactInfo?.phone || ``,
});

export default function ClassRoster (props: Props) {
    const {
        open,
        onClose,
        classId,
        organizationId,
    } = props;

    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const [ schoolRosterDialogOpen, setSchoolRosterDialogOpen ] = useState(false);
    const { required, equals } = useValidations();
    const [ removeStudent ] = useRemoveClassStudent();
    const [ removeTeacher ] = useRemoveClassTeacher();
    const [ subgroupBy, setSubgroupBy ] = useState(`Student`);
    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `familyName`,
    });

    const {
        data: rosterData,
        loading,
        refetch,
    } = useGetClassNodeRoster({
        fetchPolicy: `network-only`,
        variables: {
            id: classId ?? ``,
            count: serverPagination.rowsPerPage,
            orderBy: serverPagination.orderBy,
            order: serverPagination.order,
            direction: `FORWARD`,
            showStudents: true,
            showTeachers: false,
            filter: buildClassNodeUserSearchFilter(serverPagination.search),
        },
        skip: !classId,
    });

    const rows = subgroupBy === `Student` ?
        rosterData?.classNode?.studentsConnection?.edges.map((edge) => mapUserRow(edge, subgroupBy)) ?? [] :
        rosterData?.classNode?.teachersConnection?.edges.map((edge) => mapUserRow(edge, subgroupBy)) ?? [];
    const roles = [ `Student`, `Teacher` ];

    const columns: TableColumn<ClassUserRow>[] = [
        {
            id: `id`,
            label: intl.formatMessage({
                id: `generic_idLabel`,
            }),
            hidden: true,
        },
        {
            id: `givenName`,
            label: intl.formatMessage({
                id: `users_firstName`,
            }),
            persistent: true,
            render: (row) => (
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                >
                    <UserAvatar
                        name={`${row.givenName} ${row.familyName}`}
                        size="small"
                    />
                    <span className={classes.userName}>{row.givenName}</span>
                </Box>
            ),
        },
        {
            id: `familyName`,
            label: intl.formatMessage({
                id: `users_lastName`,
            }),
            persistent: true,
        },
        {
            id: `role`,
            label: intl.formatMessage({
                id: `class_roleLabel`,
            }),
            groups: roles.map((role) => ({
                text: role,
                value: role,
            })),
        },
        {
            id: `contactInfo`,
            label: intl.formatMessage({
                id: `users_contactInfo`,
            }),
            disableSort: true,
        },
        {
            id: `organizationRoles`,
            label: intl.formatMessage({
                id: `organization.roles`,
            }, {
                count: 2,
            }),
            render: (row) => row.organizationRoles.map((roleName, i) => (
                <Typography
                    key={`role-${i}`}
                    noWrap
                    variant="body2"
                >
                    {getCustomRoleName(intl, roleName)}
                </Typography>
            )),
        },
    ];

    const handleRemoveUser = async (row: ClassUserRow) => {
        const userName = `${row.givenName} ${row.familyName}`.trim();

        if (!(await prompt({
            variant: `error`,
            title: intl.formatMessage({
                id: `class_removeUserLabel`,
            }),
            okLabel: intl.formatMessage({
                id: `class_removeConfirm`,
            }),
            content: (
                <>
                    <DialogContentText>
                        {intl.formatMessage({
                            id: `classRoster_deletePrompt`,
                        }, {
                            value: userName,
                        })}
                    </DialogContentText>
                    <DialogContentText>
                        <FormattedMessage
                            id="generic_typeToRemovePrompt"
                            values={{
                                value: <strong>{userName}</strong>,
                            }}
                        />
                    </DialogContentText>
                </>
            ),
            validations: [ required(), equals(userName) ],
        }))) return;

        const removeProps = {
            variables: {
                class_id: classId ?? ``,
                user_id: row.id.replace(`-Student`, ``).replace(`-Teacher`, ``),
            },
        };

        if (subgroupBy === `Student`) {
            await removeStudent(removeProps);
        } else {
            await removeTeacher(removeProps);
        }

        refetch();
    };

    const handleTableChange = (tableData: CursorTableData<ClassUserRow>) => {
        setSubgroupBy(tableData?.subgroupBy ?? `Student`);
        setServerPagination({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            search: tableData.search,
            rowsPerPage: tableData.rowsPerPage,
        });
        refetch({
            showStudents: tableData?.subgroupBy === `Student`,
            showTeachers: tableData?.subgroupBy === `Teacher`,
        });
    };

    const handlePageChange = async (pageChange: PageChange, order: Order, cursor: string | undefined, count: number) => {
        const direction = pageChangeToDirection(pageChange);
        await refetch({
            count,
            cursor,
            direction,
        });
    };

    return (
        <FullScreenDialog
            open={open}
            title={rosterData?.classNode?.name ?? ``}
            onClose={() => {
                onClose();
            }}
        >
            <Paper className={classes.root}>
                <CursorTable
                    hideAllGroupTab
                    hasNextPage={subgroupBy === `Student` ?
                        rosterData?.classNode?.studentsConnection?.pageInfo.hasNextPage :
                        rosterData?.classNode?.teachersConnection?.pageInfo.hasNextPage
                    }
                    hasPreviousPage={subgroupBy === `Student` ?
                        rosterData?.classNode?.studentsConnection?.pageInfo.hasPreviousPage :
                        rosterData?.classNode?.teachersConnection?.pageInfo.hasPreviousPage
                    }
                    total={subgroupBy === `Student` ?
                        rosterData?.classNode?.studentsConnection?.totalCount :
                        rosterData?.classNode?.teachersConnection?.totalCount
                    }
                    startCursor={subgroupBy === `Student` ?
                        rosterData?.classNode?.studentsConnection?.pageInfo.startCursor :
                        rosterData?.classNode?.teachersConnection?.pageInfo.startCursor
                    }
                    endCursor={subgroupBy === `Student` ?
                        rosterData?.classNode?.studentsConnection?.pageInfo.endCursor :
                        rosterData?.classNode?.teachersConnection?.pageInfo.endCursor
                    }
                    loading={loading}
                    columns={columns}
                    rows={rows}
                    idField="id"
                    orderBy="givenName"
                    order="asc"
                    groupBy="role"
                    subgroupBy={subgroupBy}
                    primaryAction={{
                        label: `Add User`,
                        icon: PersonAddIcon,
                        // disabled: !canCreate,
                        onClick: () => setSchoolRosterDialogOpen(true),
                    }}
                    rowActions={(row) => [
                        {
                            label: intl.formatMessage({
                                id: `class_removeUserLabel`,
                            }),
                            icon: DeleteIcon,
                            onClick: () => handleRemoveUser(row),
                        },
                    ]}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: intl.formatMessage({
                                id: `class_classRosterLabel`,
                            }),
                        },
                        search: {
                            placeholder: intl.formatMessage({
                                id: `class_searchPlaceholder`,
                            }),
                        },
                    })}
                    onChange={handleTableChange}
                    onPageChange={handlePageChange}
                />
            </Paper>

            {classId &&
                <SchoolRoster
                    open={schoolRosterDialogOpen}
                    refetchClassRoster={refetch}
                    classId={classId}
                    organizationId={organizationId}
                    onClose={() => {
                        refetch();
                        setSchoolRosterDialogOpen(false);
                    }}
                />
            }
        </FullScreenDialog>
    );
}
