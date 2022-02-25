import { ProgramForm } from "@/api/programs";
import {
    sortEntitiesByLabel,
    useHandleUpdateNonSpecified,
} from "@/types/graphQL";
import { EntityStepContent } from "@/utils/entitySteps";
import { useGetProgramFormDropdowns } from "@/utils/programFormDropdownValues";
import { useValidations } from "@/utils/validations";
import { Paper } from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import {
    Select,
    TextField,
} from "kidsloop-px";
import { isEqual } from "lodash";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    paper: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}));

export default function ProgramInfoStep (props: EntityStepContent<ProgramForm>) {
    const {
        value,
        disabled,
        onChange,
        loading,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const {
        required,
        letternumeric,
        max,
    } = useValidations();
    const [ programName, setProgramName ] = useState(value.name ?? ``);
    const [ gradeIds, setGradeIds ] = useState(value.grades ?? []);
    const [ ageRanges, setAgeRanges ] = useState(value.ageRanges ?? []);
    const {
        ageRangesLoading,
        gradesLoading,
        customAgeRanges,
        systemAgeRanges,
        nonSpecifiedAgeRange,
        customGrades,
        systemGrades,
        nonSpecifiedGrade,
    } = useGetProgramFormDropdowns();

    useEffect(() => {
        const updatedValue = {
            ...value,
            name: programName,
            grades: gradeIds,
            ageRanges: ageRanges,
        };
        if (isEqual(value, updatedValue)) return;
        onChange?.(updatedValue);
    }, [
        programName,
        gradeIds,
        ageRanges,
    ]);

    useHandleUpdateNonSpecified(gradeIds, setGradeIds, nonSpecifiedGrade?.value);
    useHandleUpdateNonSpecified(ageRanges, setAgeRanges, nonSpecifiedAgeRange?.value);

    return <>
        <Paper className={classes.paper}>
            <TextField
                fullWidth
                label={intl.formatMessage({
                    id: `programs_programNameLabel`,
                })}
                value={value.name}
                disabled={disabled || loading}
                hideHelperText={disabled}
                autoFocus={!value.id}
                validations={[
                    required(`The program name is required.`),
                    letternumeric(intl.formatMessage({
                        id: `programNameValidations_letternumeric`,
                    })),
                    max(35, `The program name has a max length of 35 characters.`),
                ]}
                loading={loading}
                onChange={setProgramName}
            />
        </Paper>
        <Paper className={classes.paper}>
            <Select
                multiple
                fullWidth
                label={intl.formatMessage({
                    id: `programs_grades`,
                })}
                value={value.grades}
                items={customGrades.sort((sortEntitiesByLabel))}
                sections={[
                    ...(nonSpecifiedGrade ? [
                        {
                            items: [ nonSpecifiedGrade ],
                            ignoreSelectAll: true,
                        },
                    ] : []),
                    {
                        header: intl.formatMessage({
                            id: `programs_systemValuesLabel`,
                        }),
                        items: systemGrades.sort((sortEntitiesByLabel)),
                    },
                ]}
                itemText={(grade) => grade.label ?? ``}
                itemValue={(grade) => grade.value ?? ``}
                disabled={disabled || loading || gradesLoading}
                hideHelperText={disabled}
                validations={[ required(`The Grade is required.`) ]}
                loading={loading || gradesLoading}
                onChange={setGradeIds}
            />
        </Paper>
        <Paper className={classes.paper}>
            <Select
                multiple
                fullWidth
                label={intl.formatMessage({
                    id: `programs_ageRanges`,
                })}
                value={value.ageRanges}
                items={customAgeRanges}
                sections={[
                    ...(nonSpecifiedAgeRange ? [
                        {
                            items: [ nonSpecifiedAgeRange ],
                            ignoreSelectAll: true,
                        },
                    ] : []),
                    {
                        header: intl.formatMessage({
                            id: `programs_systemValuesLabel`,
                        }),
                        items: systemAgeRanges,
                    },
                ]}
                itemText={(ageRange) => ageRange.label}
                itemValue={(ageRange) => ageRange.value ?? ``}
                disabled={disabled || loading || ageRangesLoading}
                hideHelperText={disabled}
                validations={[ required(`The Age Range is required.`) ]}
                loading={loading || ageRangesLoading}
                onChange={setAgeRanges}
            />
        </Paper>
    </>;
}
