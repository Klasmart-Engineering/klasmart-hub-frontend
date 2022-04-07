import TransferClassDialog from "./Dialog/Transfer";
import {
    ClassUserRow,
    useGetClassNodeRoster,
    useRemoveClassStudent,
    useRemoveClassTeacher,
} from "@/api/classRoster";
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
import { mapUserRowPerRole } from "@/utils/users";
import { useValidations } from "@/utils/validations";
import {
    CursorTable,
    FullScreenDialog,
    usePrompt,
    UserAvatar,
} from "@kl-engineering/kidsloop-px";
import {
    Order,
    TableColumn,
} from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Cursor/Table";
import {
    Delete as DeleteIcon,
    PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import MoveDownIcon from '@mui/icons-material/MoveDown';
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
import React,
{
    useEffect,
    useState,
} from "react";
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
    goToClassRoster: (classId: string) => void;
    classId?: string;
    className?: string;
    organizationId: string;
}

export type ClassRosterSubgroup = `Teacher` | `Student`;

export default function ClassRoster (props: Props) {
    const {
        open,
        onClose,
        goToClassRoster,
        classId,
        organizationId,
    } = props;

    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const [ schoolRosterDialogOpen, setSchoolRosterDialogOpen ] = useState(false);
    const [ selectedUserIds, setSelectedUserIds ] = useState<string[]>([]);
    const { required, equals } = useValidations();
    const [ removeStudent ] = useRemoveClassStudent();
    const [ removeTeacher ] = useRemoveClassTeacher();
    const [ subgroupBy, setSubgroupBy ] = useState<ClassRosterSubgroup>(`Student`);
    const [ transferClassDialogOpen, setTransferClassDialogOpen ] = useState(false);
    const [ transerClassUserIds, setTranserClassUserIds ] = useState<string[]>([]);
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
        rosterData?.classNode?.studentsConnection?.edges.map((edge) => mapUserRowPerRole(edge, subgroupBy)) ?? [] :
        rosterData?.classNode?.teachersConnection?.edges.map((edge) => mapUserRowPerRole(edge, subgroupBy)) ?? [];
    const roles = [ `Student`, `Teacher` ];

    const enableClassRosterTransfer = rosterData?.classNode?.schools?.length === 1 ?? false;

    const columns: TableColumn<ClassUserRow>[] = [
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

    // // if users change tab, remove existing selection
    useEffect(() => {
        if (!selectedUserIds.length) return;
        setSelectedUserIds([]);
    }, [ subgroupBy ]);

    const handleClassTransferDialogOpen = (targetTableUserIds: string[]) => {
        const rawIds = targetTableUserIds.map((id) => id.replace(`-${subgroupBy}`, ``));
        setTranserClassUserIds(rawIds);
        setTransferClassDialogOpen(true);
    };

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
        setSubgroupBy(tableData?.subgroupBy as ClassRosterSubgroup ?? `Student`);
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
                setSelectedUserIds([]);
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
                    selectActions={
                        [
                            {
                                label: intl.formatMessage({
                                    id: `class_transferLabel`,
                                    defaultMessage: `Transfer`,
                                }),
                                disabled: !enableClassRosterTransfer,
                                icon: MoveDownIcon,
                                onClick: () => {
                                    handleClassTransferDialogOpen(selectedUserIds); },
                            },
                        ]
                    }
                    selectedRows={selectedUserIds}
                    subgroupBy={subgroupBy}
                    primaryAction={{
                        label: intl.formatMessage({
                            id: `class_addUserLabel`,
                        }),
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
                        {
                            label: intl.formatMessage({
                                id: `class_transferLabel`,
                                defaultMessage: `Transfer`,
                            }),
                            disabled: !enableClassRosterTransfer,
                            icon: MoveDownIcon,
                            onClick: () => handleClassTransferDialogOpen([ row.id ]),
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
                    onSelected={(ids: string[]) => {
                        setSelectedUserIds(ids);
                    }}
                    onChange={handleTableChange}
                    onPageChange={handlePageChange}
                />
            </Paper>

            {classId && (
                <>
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
                    <TransferClassDialog
                        open={transferClassDialogOpen}
                        userIds={transerClassUserIds}
                        currentClassId={classId}
                        subgroupBy={subgroupBy}
                        goToClassRoster={goToClassRoster}
                        onSuccess={() => {
                            setSelectedUserIds([]);
                            setTranserClassUserIds([]);
                            refetch();
                        }}
                        onClose={() => {
                            setTransferClassDialogOpen(false);
                            setTranserClassUserIds([]);
                        }}
                    />
                </>
            )
            }
        </FullScreenDialog>
    );
}
