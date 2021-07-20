import { useGetAllAgeRanges } from "@/api/age_ranges";
import { useGetAllGrades } from "@/api/grades";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    AgeRange,
    Grade,
    isActive,
    isCustomValue,
    isNonSpecified,
    isOtherSystemValue,
    Program,
    sortEntitiesByName,
    useHandleUpdateNonSpecified,
} from "@/types/graphQL";
import { buildAgeRangeLabel } from "@/utils/ageRanges";
import { EntityStepContent } from "@/utils/entitySteps";
import { useValidations } from "@/utils/validations";
import {
    createStyles,
    makeStyles,
    Paper,
} from "@material-ui/core";
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

export default function ProgramInfoStep (props: EntityStepContent<Program>) {
    const {
        value,
        disabled,
        onChange,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const {
        required,
        letternumeric,
        max,
    } = useValidations();
    const currentOrganization = useCurrentOrganization();
    const [ programName, setProgramName ] = useState(value.name ?? ``);
    const [ gradeIds, setGradeIds ] = useState(value.grades?.filter(isActive).map((grade) => grade.id ?? ``) ?? []);
    const [ ageRanges, setAgeRanges ] = useState(value.age_ranges?.filter(isActive).map((ageRange) => ageRange.id ?? ``) ?? []);
    const { data: ageRangesData, loading: ageRangesLoading } = useGetAllAgeRanges({
        variables: {
            organization_id: currentOrganization?.organization_id ?? ``,
        },
    });
    const { data: gradesData, loading: gradesLoading } = useGetAllGrades({
        variables: {
            organization_id: currentOrganization?.organization_id ?? ``,
        },
    });

    const [ loaded, setLoaded ] = useState<boolean>(false);
    const allAgeRanges = ageRangesData?.organization.ageRanges.filter(isActive) ?? [];
    const nonSpecifiedAgeRange = allAgeRanges.find(isNonSpecified);
    const systemAgeRanges = allAgeRanges.filter(isOtherSystemValue);
    const customAgeRanges = allAgeRanges.filter(isCustomValue);

    const allGrades = gradesData?.organization.grades.filter(isActive) ?? [];
    const nonSpecifiedGrade = allGrades.find(isNonSpecified);
    const systemGrades = allGrades.filter(isOtherSystemValue);
    const customGrades = allGrades.filter(isCustomValue);

    useEffect(() => {
        // Removing this check will make the select values dance when updated (unstable)
        if (ageRangesLoading || gradesLoading || loaded) return;

        const {
            name,
            grades,
            age_ranges,
        } = value;
        setProgramName(name ?? ``);
        setGradeIds(grades?.filter(isActive).map((grade) => grade.id ?? ``) ?? []);
        setAgeRanges(age_ranges?.filter(isActive).map((ageRange) => ageRange.id ?? ``) ?? []);
        setLoaded(true);
    }, [
        value,
        ageRangesLoading,
        gradesLoading,
    ]);

    useEffect(() => {
        const updatedValue = {
            ...value,
            name: programName,
            grades: gradeIds.map((id) => allGrades.find((grade) => grade.id === id)).filter((grade): grade is Grade => !!grade),
            age_ranges: ageRanges.map((id) => allAgeRanges.find((ageRange) => ageRange.id === id)).filter((ageRange): ageRange is AgeRange => !!ageRange),
        };
        if (isEqual(value, updatedValue)) return;
        onChange?.(updatedValue);
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
                    validations={[
                        required(`The program name is required.`),
                        letternumeric(intl.formatMessage({
                            id: `programNameValidations_letternumeric`,
                        })),
                        max(35, `The program name has a max length of 35 characters.`),
                    ]}
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
                            header: intl.formatMessage({
                                id: `programs_systemValuesLabel`,
                            }),
                            items: systemGrades.sort((sortEntitiesByName)),
                        },
                    ]}
                    itemText={(grade) => grade.name ?? ``}
                    itemValue={(grade) => grade.id ?? ``}
                    disabled={disabled}
                    hideHelperText={disabled}
                    validations={[ required(`The Grade is required.`) ]}
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
                            header: intl.formatMessage({
                                id: `programs_systemValuesLabel`,
                            }),
                            items: systemAgeRanges,
                        },
                    ]}
                    itemText={(ageRange) => buildAgeRangeLabel(ageRange)}
                    itemValue={(ageRange) => ageRange.id ?? ``}
                    disabled={disabled}
                    hideHelperText={disabled}
                    validations={[ required(`The Age Range is required.`) ]}
                    onChange={setAgeRanges}
                />
            </Paper>
        </>
    );
}
