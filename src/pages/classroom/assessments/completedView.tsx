import Grid from "@material-ui/core/Grid";
import React, { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { AssessmentResponse } from "../../../api/restapi";
import CompletedTable, { TableRow } from "./completedTable";
import { TableColumns }from "../../../types/objectTypes";

const TABLE_COLUMN_MOBILE = [
    {
        title: "Title",
        field: "title",
        headerStyle: { maxWidth: "300px" }, // If not set maxWidth, overflowed on mobile
    }
];

const TABLE_COLUMN = [
    {
        title: "Title",
        field: "title",
    },
    {
        title: "Completed on",
        field: "completedDate",
        headerStyle: { textAlign: "right" },
        cellStyle: { textAlign: "right" },
    }
];

interface Props {
    data: AssessmentResponse[];
}

export default function AssessmentsCompletedView(props: Props) {
    const { data } = props;

    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const [columns, setColumns] = useState<TableColumns>(TABLE_COLUMN);
    const [rows, setRows] = useState<TableRow[]>([]);

    useEffect(() => {
        const completedAssessments = data.filter(ass => ass.state === 3 && ass.published);
        const tmpRows: TableRow[] = [];
        for (const assessment of completedAssessments) {
            tmpRows.push({
                assId: assessment.assId,
                title: assessment.name.length < 80 ? assessment.name : assessment.name.slice(0, 40) + "...",
                completedDate: new Date(assessment.updatedDate).toLocaleString()
            });
        }
        setRows(tmpRows);
    }, []);

    useEffect(() => {
        if (isSmDown) {
            setColumns(TABLE_COLUMN_MOBILE);
        } else {
            setColumns(TABLE_COLUMN);
        }
    }, [isSmDown]);

    return (
        <Grid container>
            <Grid item xs={12}>
                <CompletedTable
                    columns={columns}
                    data={rows.map(data => Object.assign({}, data))}
                />
            </Grid>
        </Grid>
    );
}
