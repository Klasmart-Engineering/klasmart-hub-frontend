import { useDeleteClass, useGetAllClasses } from "@/api/classes";
import EditClassDialog from "@/components/Class/Dialog/Edit";
import CreateClassDialog from "@/components/Class/Dialog/Create";
import { Class } from "@/types/graphQL";
import { getTableLocalization } from "@/utils/table";
import { useReactiveVar } from "@apollo/client";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from "@material-ui/icons";
import clsx from "clsx";
import { BaseTable, useSnackbar } from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Base/Table/Head";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { currentMembershipVar } from "@/cache";
import { getPermissionState } from "@/utils/checkAllowed";

const useStyles = makeStyles((theme) => createStyles({
    containerTable: {
        width: "100%",
        "& table": {
            overflowY: "auto",
        },
    },
    activeColor: {
        color: "#2BA600",
        fontWeight: "bold"
    },
    inactiveColor: {
        color: "#FF0000",
        fontWeight: "bold"
    },
    statusText: {
        fontWeight: "bold",
        textTransform: "capitalize",
    }
}));

interface ClassRow {
    id: string
    name: string
    schoolNames: string[]
    status: string
}

interface Props {
}

/**
 * Returns function to show Classes Table in "Classes" section
 * @param  props {Object} intl - The object has a function (formatMessage) that support multiple languages
 */
export default function ClasessTable (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const canCreate = getPermissionState(organization_id, "create_class_20224");
    const canEdit = getPermissionState(organization_id, "edit_class_20334");
    const canDelete = getPermissionState(organization_id, "delete_class_20444");
    const [ editDialogOpen, setEditDialogOpen ] = useState(false);
    const [ createDialogOpen, setCreateDialogOpen ] = useState(false);
    const [ selectedClass, setSelectedClass ] = useState<Class>();
    const [ rows, setRows ] = useState<ClassRow[]>([]);
    const {
        data,
        refetch,
        loading,
        error,
    } = useGetAllClasses(organization_id);
    const [ deleteClass ] = useDeleteClass();

    const schoolClasses = data?.me?.membership?.organization?.classes;

    useEffect(() => {        
        if (!schoolClasses?.length) {
            setRows([]);
            return;
        }
        const rows: ClassRow[] = schoolClasses.map((c) => ({
            id: c.class_id,
            name: c.class_name ?? "",
            schoolNames: c.schools?.map((s) => s.school_name ?? "") ?? [],
            status: c.status ?? "",
        }));
        setRows(rows);
    }, [schoolClasses]);

    const findClass = (row: ClassRow) => schoolClasses?.find((c) => c.class_id === row.id);

    const editSelectedRow = (row: ClassRow) => {
        const selectedClass = findClass(row);
        if (!selectedClass) return;
        setSelectedClass(selectedClass);
        setEditDialogOpen(true);
    };

    const deleteSelectedRow = async (row: ClassRow) => {
        const selectedClass = findClass(row);
        if (!selectedClass) return;
        if (!confirm(`Are you sure you want to delete "${selectedClass.class_name}"?`)) return;
        try {
            await deleteClass(selectedClass.class_id);
            refetch();
            enqueueSnackbar(intl.formatMessage({ id: "classes_classDeletedMessage" }), { variant: "success" })
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({ id: "classes_classDeletedError" }), { variant: "error" })
        }
    };

    const columns: TableColumn<ClassRow>[] = [
        {
            id: "id",
            label: "Id",
            hidden: true,
        },
        {
            id: "name",
            label: intl.formatMessage({ id: "classes_classTitle" }),
            searchable: true,
            persistent: true,
            render: (row) => <Link href={`/#/admin/classRoster/${row.id}`}>{row.name}</Link>
        },
        {
            id: "schoolNames",
            label: intl.formatMessage({ id: "classes_schoolTitle" }),
            searchable: true,
            disableSort: true,
            render: (row) => row.schoolNames.map((s, i) => <div key={`school-${i}`}>{s}</div>)
        },
        {
            id: "status",
            label: intl.formatMessage({ id: "classes_statusTitle" }),
            render: (row) =>
                <span
                    className={clsx(classes.statusText, {
                        [classes.activeColor]: row.status === "active",
                        [classes.inactiveColor]: row.status === "inactive",
                    })}
                >
                    {row.status}
                </span>
        }
    ];

    return (
        <>
            <BaseTable
                columns={columns}
                rows={rows}
                loading={loading}
                idField="id"
                orderBy="name"
                primaryAction={{
                    label: "Create Class",
                    icon: AddIcon,
                    disabled: !canCreate,
                    onClick: (data) => setCreateDialogOpen(true),
                }}
                selectActions={[
                    {
                        label: intl.formatMessage({ id: "classes_actionsDeleteTooltip" }),
                        icon: DeleteIcon,
                        disabled: !canDelete,
                        onClick: (data) => alert(`You want to delete ${data.rows.length} rows`)
                    }
                ]}
                rowActions={(row) => [
                    {
                        label: "Edit",
                        icon: EditIcon,
                        disabled: !(row.status === "active" && canEdit),
                        onClick: editSelectedRow,
                    },
                    {
                        label: "Delete",
                        icon: DeleteIcon,
                        disabled: !(row.status === "active" && canDelete),
                        onClick: deleteSelectedRow,
                    },
                ]}
                localization={getTableLocalization(intl, {
                    toolbar: {
                        title: "Classes",
                    },
                    search: {
                        placeholder: intl.formatMessage({ id: "classes_searchPlaceholder" }),
                    },
                    body: {
                        noData: intl.formatMessage({ id: "classes_noRecords" })
                    },
                })}
            />
            <EditClassDialog
                open={editDialogOpen}
                value={selectedClass}
                onClose={(value) => {
                    setSelectedClass(undefined);
                    setEditDialogOpen(false);
                    if (value) refetch();
                }}
            />
            <CreateClassDialog
                open={createDialogOpen}
                onClose={(value) => {
                    setCreateDialogOpen(false);
                    if (value) refetch();
                }}
            />
        </>
    );
}
