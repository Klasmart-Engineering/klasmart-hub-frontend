import SchoolRoster from "@/components/Class/SchoolRoster/Table";
import { User } from "@/types/graphQL";
import { getTableLocalization } from "@/utils/table";
import { useValidations } from "@/utils/validations";
import {
    createStyles,
    DialogContentText,
    makeStyles,
    Paper,
} from "@material-ui/core";
import {
    Delete as DeleteIcon,
    PersonAdd as PersonAddIcon,
} from "@material-ui/icons";
import {
    FullScreenDialog,
    PageTable,
    usePrompt,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
import React,
{ useState } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: `100%`,
        },
    }));

interface ClassRosterRow {
    id: string;
    username: string;
    role: string;
    address: string;
    email: string;
    phoneNumber: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function ClassRoster (props: Props) {
    const { open, onClose } = props;

    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const [ schoolRosterDialogOpen, setSchoolRosterDialogOpen ] = useState(false);
    const [ selectedUser, setSelectedUser ] = useState<User>();
    const { required, equals } = useValidations();

    const rows = [
        {
            id: `1`,
            user_id: `1`,
            username: `User 01`,
            role: `Student`,
            address: `Address 1`,
            email: `user01@01.com`,
            phoneNumber: `+82 (0)  2-514-6421`,
        },
        {
            id: `2`,
            user_id: `2`,
            username: `User 02`,
            role: `Teacher`,
            address: `Address 2`,
            email: `user02@02.com`,
            phoneNumber: `+82 (0)  2-514-9999`,
        },
    ];

    const roles = [ `Student`, `Teacher` ];

    const columns: TableColumn<ClassRosterRow>[] = [
        {
            id: `id`,
            label: `Id`,
            hidden: true,
        },
        {
            id: `username`,
            label: `User name`,
            persistent: true,
        },
        {
            id: `role`,
            label: `Role`,
            groups: roles.map((role) => ({
                text: role,
            })),
        },
        {
            id: `address`,
            label: `Address`,
        },
        {
            id: `email`,
            label: `Email`,
            disableSort: true,
        },
        {
            id: `phoneNumber`,
            label: `Phone number`,
        },
    ];

    const findClass = (row: ClassRosterRow) => rows.find((user) => user.user_id === row.id);

    const handleRemoveUser = async (row: ClassRosterRow) => {
        const selectedUser = findClass(row);
        if (!selectedUser) return;

        setSelectedUser(selectedUser);

        const { username } = selectedUser;

        if (
            !(await prompt({
                variant: `error`,
                title: `Remove User`,
                okLabel: `Remove`,
                content: (
                    <>
                        <DialogContentText>
                            Are you sure you want to remove {`"${username}"`} from the class?
                        </DialogContentText>
                        <DialogContentText>
                            Type <strong>{username}</strong> to confirm removing.
                        </DialogContentText>
                    </>
                ),
                validations: [ required(), equals(username) ],
            }))
        )
            return;
    };

    return (
        <FullScreenDialog
            open={open}
            title="Class Roster"
            onClose={() => {
                onClose();
            }}
        >
            <Paper className={classes.root}>
                <PageTable
                    columns={columns}
                    rows={rows}
                    idField="id"
                    groupBy="role"
                    primaryAction={{
                        label: `Add User`,
                        icon: PersonAddIcon,
                        // disabled: !canCreate,
                        onClick: () => setSchoolRosterDialogOpen(true),
                    }}
                    rowActions={(row) => [
                        {
                            label: `Remove User`,
                            icon: DeleteIcon,
                            onClick: () => handleRemoveUser(row),
                        },
                    ]}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: `Actual Class Name`,
                        },
                        search: {
                            placeholder: `Search for students by their  names,  address, email and phone number`,
                        },
                        body: {
                            noData: intl.formatMessage({
                                id: `classes_noRecords`,
                            }),
                        },
                    })}
                />
            </Paper>

            <SchoolRoster
                open={schoolRosterDialogOpen}
                onClose={() => {
                    setSchoolRosterDialogOpen(false);
                }}
            />
        </FullScreenDialog>
    );
}
