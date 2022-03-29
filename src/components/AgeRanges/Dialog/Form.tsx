import { AgeRange } from "@/types/graphQL";
import { useValidations } from "@/utils/validations";
import {
    Box,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import {
    Select,
    TextField,
} from "@kl-engineering/kidsloop-px";
import React, {
    useEffect,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

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
    loading?: boolean;
}

export default function ClassDialogForm (props: Props) {
    const {
        value,
        onChange,
        onValidation,
        loading,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
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
            text: intl.formatMessage({
                id: `ageRanges_formMonths`,
            }),
        },
        {
            value: `year`,
            text: intl.formatMessage({
                id: `ageRanges_formYears`,
            }),
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
                        <FormattedMessage id="ageRanges_ageRangeLabel"></FormattedMessage>
                    </Typography>
                </Box>
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="flex-start"
                >
                    <TextField
                        fullWidth
                        id="age-range-from"
                        value={from}
                        label={intl.formatMessage({
                            id: `ageRanges_formFrom`,
                        })}
                        type="number"
                        autoFocus={!value.id}
                        validations={[
                            required(),
                            min(0, `Min 0`),
                            max(99, `Max 99`),
                        ]}
                        loading={loading}
                        disabled={loading}
                        onChange={setFrom}
                        onValidate={setFromValid}
                    />
                    <Select
                        value={fromUnit}
                        label={intl.formatMessage({
                            id: `ageRanges_formFromUnit`,
                        })}
                        className={classes.unitSelect}
                        items={units}
                        validations={[ required() ]}
                        itemText={({ text }) => text}
                        itemValue={({ value }) => value}
                        loading={loading}
                        disabled={loading}
                        onChange={setFromUnit}
                        onValidate={setFromUnitValid}
                    />
                    <Box flex="0 0 64px"/>
                    <TextField
                        fullWidth
                        id="age-range-to"
                        value={to}
                        label={intl.formatMessage({
                            id: `ageRanges_formTo`,
                        })}
                        type="number"
                        validations={[
                            required(),
                            min(1, `Min 1`),
                            max(99, `Max 99`),
                        ]}
                        loading={loading}
                        disabled={loading}
                        onChange={setTo}
                        onValidate={setToValid}
                    />
                    <Select
                        value={toUnit}
                        label={intl.formatMessage({
                            id: `ageRanges_formToUnit`,
                        })}
                        items={units}
                        className={classes.unitSelect}
                        validations={[ required() ]}
                        itemText={({ text }) => text}
                        itemValue={({ value }) => value}
                        loading={loading}
                        disabled={loading}
                        onChange={setToUnit}
                        onValidate={setToUnitValid}
                    />
                </Box>
            </Box>
        </div>
    );
}
