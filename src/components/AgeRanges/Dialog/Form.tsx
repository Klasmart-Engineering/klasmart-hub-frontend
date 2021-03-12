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
    const [ from, setFrom ] = useState(value.low_value ?? 0);
    const [ fromValid, setFromValid ] = useState(true);
    const [ fromUnit, setFromUnit ] = useState(value.low_value_unit ?? `year`);
    const [ fromUnitValid, setFromUnitValid ] = useState(true);
    const [ to, setTo ] = useState(value.high_value ?? 1);
    const [ toValid, setToValid ] = useState(true);
    const [ toUnit, setToUnit ] = useState(value.high_value_unit ?? `year`);
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
            id: value.id,
            low_value: from,
            low_value_unit: fromUnit,
            high_value: to,
            high_value_unit: toUnit,
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
                        autoFocus={!value.id}
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
