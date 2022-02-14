import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React from "react";
import { PieChart as MinimalPieChart } from "react-minimal-pie-chart";
import { DataEntry } from "react-minimal-pie-chart/types/commonTypes";

const useStyles = makeStyles((theme) => createStyles({
    label: {
        fontFamily: `Circular Std, sans-serif`,
        fontSize: `0.45em`,
        background: `white`,
        padding: 5,
    },
}));

interface Props {
    data: DataEntry[];
}

export default function PieChart (props: Props) {
    const { data } = props;
    const classes = useStyles();
    return (
        <MinimalPieChart
            rounded
            data={data}
            lineWidth={20}
            paddingAngle={18}
            label={({ dataEntry }) => `${dataEntry.value} ${dataEntry.title}`}
            className={classes.label}
            labelStyle={() => ({})}
            labelPosition={75}
        />
    );
}
