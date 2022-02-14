import { CLASS_NAME_LENGTH_MAX } from "@/config/index";
import { buildSchoolIdFilter } from "@/operations/queries/getPaginatedOrganizationPrograms";
import { Status } from "@/types/graphQL";
import { useGetClassFormValues } from "@/utils/classFormDropdownValues";
import { usePermission } from "@/utils/permissions";
import { useValidations } from "@/utils/validations";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            "& > *": {
                marginBottom: theme.spacing(2),
            },
        },
    }));

export interface ClassForm {
    id: string;
    name?: string | null;
    schools?: string[];
    programs?: string[];
    ageRanges?: string[];
    subjects?: string[];
    grades?: string[];
    status?: Status;
}

interface Props {
    value: ClassForm;
    onChange: (value: ClassForm) => void;
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
        letternumeric,
        max,
    } = useValidations();
    const canEditSchool = usePermission(`edit_school_20330`);
    const [ schoolIds, setSchoolIds ] = useState<string[]>(value?.schools ?? []);
    const [ programIds, setProgramIds ] = useState<string[]>(value?.programs ?? []);
    const [ gradeIds, setGradeIds ] = useState<string[]>(value?.grades ?? []);
    const [ subjectIds, setSubjectIds ] = useState<string[]>(value.subjects ?? []);
    const [ ageRangeIds, setAgeRangeIds ] = useState<string[]>(value.ageRanges ?? []);
    const [ className, setClassName ] = useState(value.name ?? ``);
    const [ classNameValid, setClassNameValid ] = useState(true);

    const {
        gradeValueOptions,
        subjectValueOptions,
        ageRangeValueOptions,
        programValueOptions,
        schoolValueOptions,
        gradesLoading,
        subjectsLoading,
        ageRangesLoading,
        programsLoading,
        schoolsLoading,
        refetchPrograms,
    } = useGetClassFormValues(programIds, schoolIds);

    useEffect(() => {
        const updatedClass: ClassForm = {
            id: value.id,
            name: className,
            schools: schoolIds,
            programs: programIds,
            grades: gradeIds,
            subjects: subjectIds,
            ageRanges: ageRangeIds,
        };

        onChange(updatedClass);
    }, [
        className,
        schoolIds,
        programIds,
        gradeIds,
        subjectIds,
        ageRangeIds,
    ]);

    useEffect(() => {
        if (!gradesLoading) {
            const updateGradesIds = value.grades?.filter((value: string) =>
                gradeValueOptions.find((grade) => grade.value === value)) ?? [];
            setGradeIds(updateGradesIds);
        }
    }, [ gradeValueOptions ]);

    useEffect(() => {
        if (!subjectsLoading) {
            const updateSubjectsIds = value.subjects?.filter((value: string) =>
                subjectValueOptions.find((subject) => subject.value === value)) ?? [];

            setSubjectIds(updateSubjectsIds);
        }
    }, [ subjectValueOptions ]);

    useEffect(() => {
        if (!ageRangesLoading) {
            const updateAgeRangeIds = value.ageRanges?.filter((value: string) =>
                ageRangeValueOptions.find((ageRange) => ageRange.value === value)) ?? [];
            setAgeRangeIds(updateAgeRangeIds);
        }
    }, [ ageRangeValueOptions ]);

    useEffect(() => {
        if (!programsLoading) {
            const programIds = value.programs?.filter((value: string) =>
                programValueOptions.find((program) => program.value === value)) ?? [];
            setProgramIds(programIds);
        }
    }, [ programValueOptions ]);

    useEffect(() => {
        onValidation([ classNameValid ].every((value) => value));
    }, [ classNameValid ]);

    const schoolOnChange = (values: string[]) => {
        const programFilter = buildSchoolIdFilter(values);
        setSchoolIds(values);
        refetchPrograms({
            filter: programFilter,
        });
    };

    return (
        <div className={classes.root}>
            <TextField
                fullWidth
                id="class-dialog-name"
                value={className}
                label={intl.formatMessage({
                    id: `class_classNameLabel`,
                })}
                variant="outlined"
                type="text"
                autoFocus={!value.id}
                validations={[
                    required(intl.formatMessage({
                        id: `class_nameRequiredValidation`,
                    })),
                    letternumeric(intl.formatMessage({
                        id: `classNameValidations_letternumeric`,
                    })),
                    max(CLASS_NAME_LENGTH_MAX, intl.formatMessage({
                        id: `validation.error.class.name.maxLength`,
                    }, {
                        value: CLASS_NAME_LENGTH_MAX,
                    })),
                ]}
                loading={loading}
                disabled={loading}
                onChange={(value) => setClassName(value)}
                onValidate={setClassNameValid}
            />
            <Select
                fullWidth
                multiple
                id="class-dialog-school"
                label={intl.formatMessage({
                    id: `class_schoolsLabel`,
                })}
                items={schoolValueOptions}
                value={schoolIds}
                disabled={!canEditSchool || loading || schoolsLoading}
                itemText={(school) => school.label ?? ``}
                itemValue={(school) => school.value}
                loading={loading || schoolsLoading}
                onChange={schoolOnChange}
            />
            <Select
                fullWidth
                multiple={schoolIds.length > 0}
                label={intl.formatMessage({
                    id: `class_programLabel`,
                })}
                items={programValueOptions}
                value={programIds}
                itemText={(program) => program.label ?? ``}
                itemValue={(program) => program.value ?? ``}
                loading={loading || schoolsLoading || programsLoading}
                disabled={loading || schoolsLoading }
                onChange={(values) => setProgramIds(values)}
            />
            <Select
                fullWidth
                multiple={programIds.length > 0}
                label={intl.formatMessage({
                    id: `class_gradeLabel`,
                })}
                items={gradeValueOptions}
                value={gradeIds}
                itemText={(grade) => grade.label ?? ``}
                itemValue={(grade) => grade.value ?? ``}
                loading={loading || schoolsLoading }
                onChange={(values) => setGradeIds(values)}
            />
            <Select
                fullWidth
                multiple={programIds.length > 0}
                label={intl.formatMessage({
                    id: `class_ageRangeLabel`,
                })}
                items={ageRangeValueOptions}
                value={ageRangeIds}
                itemText={(ageRange) => ageRange.label}
                itemValue={(ageRange) => ageRange.value ?? ``}
                loading={loading || schoolsLoading }
                disabled={loading || schoolsLoading }
                onChange={(values) => setAgeRangeIds(values)}
            />
            <Select
                fullWidth
                multiple={programIds.length > 0}
                label={intl.formatMessage({
                    id: `class_subjectsLabel`,
                })}
                items={subjectValueOptions}
                value={subjectIds}
                itemText={(subject) => subject.label ?? ``}
                itemValue={(subject) => subject.value ?? ``}
                loading={loading || schoolsLoading }
                disabled={loading || schoolsLoading }
                onChange={(values) => setSubjectIds(values)}
            />
        </div>
    );
}
