import { getTableLocalization } from "@/utils/table";
import {
    createStyles,
    makeStyles,
    Paper,
} from "@material-ui/core";
import {
    FullScreenDialog,
    PageTable,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
import React from "react";
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

export default function SchoolRoster (props: Props) {
    const { open, onClose } = props;

    const classes = useStyles();
    const intl = useIntl();

    const rows = [
        {
            id: `3`,
            username: `User 03`,
            role: `Student`,
            address: `Address 3`,
            email: `user03@03.com`,
            phoneNumber: `+82 (0)  2-514-6403`,
        },
        {
            id: `4`,
            username: `User 04`,
            role: `Teacher`,
            address: `Address 4`,
            email: `user04@04.com`,
            phoneNumber: `+82 (0)  2-514-9904`,
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

    return (
        <FullScreenDialog
            open={open}
            title="Add User"
            action={{
                label: `Add`,
                onClick: () => console.log(`clicked`),
            }
            }
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
                    showCheckboxes={true}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: `School Roster`,
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
                    onSelected={(rows) => console.log(rows)}
                />
            </Paper>
        </FullScreenDialog>
    );
}
