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
    const { required, letternumeric } = useValidations();
    const { organization_id } = useReactiveVar(currentMembershipVar);
    const [ programName, setProgramName ] = useState(value.name ?? ``);
    const [ gradeIds, setGradeIds ] = useState(value.grades?.map((grade) => grade.id ?? ``) ?? []);
    const [ ageRanges, setAgeRanges ] = useState(value.age_ranges?.map((ageRange) => ageRange.id ?? ``) ?? []);
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
        setGradeIds(grades?.map((grade) => grade.id ?? ``) ?? []);
        setAgeRanges(age_ranges?.map((ageRange) => ageRange.id ?? ``) ?? []);
    }, [ value ]);

    useEffect(() => {
        onChange?.({
            ...value,
            name: programName,
            grades: gradeIds.map((id) => allGrades.find((grade) => grade.id === id)).filter((grade): grade is Grade => !!grade),
            age_ranges: ageRanges.map((id) => allAgeRanges.find((ageRange) => ageRange.id === id)).filter((ageRange): ageRange is AgeRange => !!ageRange),
        });
    }, [
        programName,
        gradeIds,
        ageRanges,
    ]);

    useHandleUpdateNonSpecified(gradeIds, setGradeIds, allGrades);
    useHandleUpdateNonSpecified(ageRanges, setAgeRanges, allAgeRanges);

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
                    validations={[ required(), letternumeric() ]}
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
                    value={gradeIds}
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
                    itemValue={(grade) => grade.id ?? ``}
                    disabled={disabled}
                    hideHelperText={disabled}
                    validations={[ required() ]}
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
                    itemValue={(ageRange) => ageRange.id ?? ``}
                    disabled={disabled}
                    hideHelperText={disabled}
                    validations={[ required() ]}
                    onChange={setAgeRanges}
                />
            </Paper>
        </>
    );
}
