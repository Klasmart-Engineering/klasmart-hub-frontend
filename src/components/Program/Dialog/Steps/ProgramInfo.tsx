import { TabContent } from "./shared";
import { useGetAllAgeRanges } from "@/api/age_ranges";
import { useGetAllGrades } from "@/api/grades";
import { currentMembershipVar } from "@/cache";
import {
    AgeRange,
    Grade,
    isCustomValue,
    isNonSpecified,
    isOtherSystemValue,
    sortEntitiesByName,
    useHandleUpdateNonSpecified,
} from "@/types/graphQL";
import { buildAgeRangeLabel } from "@/utils/ageRanges";
import { useValidations } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
import {
    createStyles,
    makeStyles,
    Paper,
} from "@material-ui/core";
import {
    Select,
    TextField,
} from "kidsloop-px";
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

export default function ProgramInfoStep (props: TabContent) {
    const {
        value,
        disabled,
        onChange,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { required, alphanumeric } = useValidations();
    const { organization_id } = useReactiveVar(currentMembershipVar);
    const [ programName, setProgramName ] = useState(value.name ?? ``);
    const [ grades, setGrades ] = useState<Grade[]>(value.grades ?? []);
    const [ ageRanges, setAgeRanges ] = useState<AgeRange[]>(value.age_ranges ?? []);
    const { data: ageRangesData } = useGetAllAgeRanges({
        variables: {
            organization_id,
        },
    });
    const { data: gradesData } = useGetAllGrades({
        variables: {
            organization_id,
        },
    });

    const allAgeRanges = ageRangesData?.organization.ageRanges ?? [];
    const nonSpecifiedAgeRange = allAgeRanges.find(isNonSpecified);
    const systemAgeRanges = allAgeRanges.filter(isOtherSystemValue);
    const customAgeRanges = allAgeRanges.filter(isCustomValue);

    const allGrades = gradesData?.organization.grades ?? [];
    const nonSpecifiedGrade = allGrades.find(isNonSpecified);
    const systemGrades = allGrades.filter(isOtherSystemValue);
    const customGrades = allGrades.filter(isCustomValue);

    useEffect(() => {
        const {
            name,
            grades,
            age_ranges,
        } = value;
        setProgramName(name ?? ``);
        setGrades(grades ?? []);
        setAgeRanges(age_ranges ?? []);
    }, [ value ]);

    useEffect(() => {
        onChange?.({
            ...value,
            name: programName,
            grades: grades,
            age_ranges: ageRanges,
        });
    }, [
        programName,
        grades,
        ageRanges,
    ]);

    useHandleUpdateNonSpecified(grades, setGrades);
    useHandleUpdateNonSpecified(ageRanges, setAgeRanges);

    return (
        <>
            <Paper className={classes.paper}>
                <TextField
                    fullWidth
                    label={intl.formatMessage({
                        id: `programs_programNameLabel`,
                    })}
                    value={programName}
                    disabled={disabled}
                    hideHelperText={disabled}
                    autoFocus={!value.id}
                    validations={[ required(), alphanumeric() ]}
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
                    value={grades}
                    items={customGrades.sort((sortEntitiesByName))}
                    sections={[
                        ...nonSpecifiedGrade ? [
                            {
                                items: [ nonSpecifiedGrade ],
                                ignoreSelectAll: true,
                            },
                        ] : [],
                        {
                            header: `System Values`,
                            items: systemGrades.sort((sortEntitiesByName)),
                        },
                    ]}
                    itemText={(grade) => grade.name ?? ``}
                    itemId={(grade) => grade.id ?? ``}
                    disabled={disabled}
                    hideHelperText={disabled}
                    validations={[ required() ]}
                    onChange={setGrades}
                />
            </Paper>
            <Paper className={classes.paper}>
                <Select
                    multiple
                    fullWidth
                    label={intl.formatMessage({
                        id: `programs_ageRanges`,
                    })}
                    value={ageRanges}
                    items={customAgeRanges}
                    sections={[
                        ...nonSpecifiedAgeRange ? [
                            {
                                items: [ nonSpecifiedAgeRange ],
                                ignoreSelectAll: true,
                            },
                        ] : [],
                        {
                            header: `System Values`,
                            items: systemAgeRanges,
                        },
                    ]}
                    itemText={(ageRange) => buildAgeRangeLabel(ageRange)}
                    itemId={(ageRange) => ageRange.id}
                    disabled={disabled}
                    hideHelperText={disabled}
                    validations={[ required() ]}
                    onChange={setAgeRanges}
                />
            </Paper>
        </>
    );
}
