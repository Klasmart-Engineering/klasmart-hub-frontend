import { AgeRange } from "@/types/graphQL";
import { useValidations } from "@/utils/validations";
import {
    Box,
    createStyles,
    makeStyles,
    Typography,
} from "@material-ui/core";
import {
    Select,
    TextField,
} from "kidsloop-px";
import React, {
    useEffect,
    useState,
} from "react";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        "& > *": {
            marginBottom: theme.spacing(2),
        },
    },
    unitSelect: {
        minWidth: 120,
        marginLeft: theme.spacing(2),
    },
}));

const convertValue = (value: number, fromUnit: string, toUnit: string) => {
    if (fromUnit === toUnit) return value;
    switch (toUnit) {
    case `month`:
        return value * 12;
    case `year`:
        return Math.ceil(value / 12);
    }
    return value;
};

interface Props {
    value: AgeRange;
    onChange: (value: AgeRange) => void;
    onValidation: (valid: boolean) => void;
}

export default function ClassDialogForm (props: Props) {
    const {
        value,
        onChange,
        onValidation,
    } = props;
    const classes = useStyles();
    const {
        required,
        min,
        max,
    } = useValidations();
    const [ from, setFrom ] = useState(value.from ?? 0);
    const [ fromValid, setFromValid ] = useState(true);
    const [ fromUnit, setFromUnit ] = useState(value.fromUnit ?? `year`);
    const [ fromUnitValid, setFromUnitValid ] = useState(true);
    const [ to, setTo ] = useState(value.to ?? 1);
    const [ toValid, setToValid ] = useState(true);
    const [ toUnit, setToUnit ] = useState(value.toUnit ?? `year`);
    const [ toUnitValid, setToUnitValid ] = useState(true);

    const units = [
        {
            value: `month`,
            text: `Month(s)`,
        },
        {
            value: `year`,
            text: `Year(s)`,
        },
    ];

    useEffect(() => {
        onValidation([
            fromValid,
            fromUnitValid,
            toValid,
            toUnitValid,
        ].every((value) => value));
    }, [
        fromValid,
        fromUnitValid,
        toValid,
        toUnitValid,
    ]);

    useEffect(() => {
        const updatedAgeRange: AgeRange = {
            age_range_id: value.age_range_id,
            from,
            fromUnit,
            to,
            toUnit,
        };
        onChange(updatedAgeRange);
    }, [
        from,
        fromUnit,
        to,
        toUnit,
    ]);

    return (
        <div className={classes.root}>
            <Box>
                <Box mb={1}>
                    <Typography
                        variant="caption"
                        color="textSecondary"
                    >
                        Age Range
                    </Typography>
                </Box>
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="flex-start"
                >
                    <TextField
                        fullWidth
                        value={from}
                        label="From"
                        type="number"
                        autoFocus={!value.age_range_id}
                        validations={[
                            required(),
                            min(0, `Min 0`),
                            max(99, `Max 99`),
                        ]}
                        onChange={setFrom}
                        onValidate={setFromValid}
                    />
                    <Select
                        value={fromUnit}
                        label="From Unit"
                        className={classes.unitSelect}
                        items={units}
                        validations={[ required() ]}
                        itemText={({ text }) => text}
                        itemValue={({ value }) => value}
                        onChange={setFromUnit}
                        onValidate={setFromUnitValid}
                    />
                    <Box flex="0 0 64px"/>
                    <TextField
                        fullWidth
                        value={to}
                        label="To"
                        type="number"
                        validations={[
                            required(),
                            min(1, `Min 1`),
                            max(99, `Max 99`),
                        ]}
                        onChange={setTo}
                        onValidate={setToValid}
                    />
                    <Select
                        value={toUnit}
                        label="To Unit"
                        items={units}
                        className={classes.unitSelect}
                        validations={[ required() ]}
                        itemText={({ text }) => text}
                        itemValue={({ value }) => value}
                        onChange={setToUnit}
                        onValidate={setToUnitValid}
                    />
                </Box>
            </Box>
        </div>
    );
}
