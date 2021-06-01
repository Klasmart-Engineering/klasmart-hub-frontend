import { useGetUserSchoolMemberships } from "@/api/classes";
import { useGetSchools } from "@/api/schools";
import { userIdVar } from "@/cache";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    AgeRange,
    Class,
    Grade,
    Program,
    Status,
    Subject,
} from "@/types/graphQL";
import { buildAgeRangeLabel } from "@/utils/ageRanges";
import { usePermission } from "@/utils/checkAllowed";
import { schoolAdminRole } from "@/utils/permissions/schoolAdmin";
import { useValidations } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
import {
    createStyles,
    makeStyles,
    Theme,
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            "& > *": {
                marginBottom: theme.spacing(2),
            },
        },
    }));

interface Props {
    value: Class;
    onChange: (value: Class) => void;
    onValidation: (valid: boolean) => void;
}

export default function ClassDialogForm (props: Props) {
    const {
        value,
        onChange,
        onValidation,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const {
        required,
        letternumeric,
        max,
    } = useValidations();
    const canEditSchool = usePermission(`edit_school_20330`);
    const currentOrganization = useCurrentOrganization();
    const { data } = useGetSchools({
        variables: {
            organization_id: currentOrganization?.organization_id ?? ``,
        },
    });
    const userId = useReactiveVar(userIdVar);
    const [ isSchoolAdmin, setIsSchoolAdmin ] = useState(false);
    const { data: user } = useGetUserSchoolMemberships({
        fetchPolicy: `network-only`,
        variables: {
            organization_id: currentOrganization?.organization_id ?? ``,
            user_id: userId,
        },
    });

    const schoolMemberships = user?.user.membership?.schoolMemberships?.map((schoolMembership) => schoolMembership?.school?.school_name) ?? [];

    useEffect(() => {
        if (!user) return;
        const isUserSchoolAdmin = !!user?.user.membership?.roles?.find(role => role.role_name === schoolAdminRole.role_name && role.system_role);
        setIsSchoolAdmin(isUserSchoolAdmin);
    }, [ user ]);

    const allSchools = data?.organization?.schools?.filter((s) => {
        if (isSchoolAdmin) {
            return s.status === Status.ACTIVE && schoolMemberships.includes(s.school_name);
        }

        return s.status === Status.ACTIVE;
    }) ?? [];
    const [ allPrograms, setAllPrograms ] = useState<Program[]>([]);
    const [ programsIds, setProgramsIds ] = useState<string[]>(value.programs?.map((program) => program.id ?? ``) ?? []);
    const [ allGrades, setAllGrades ] = useState<Grade[]>([]);
    const [ gradesIds, setGradesIds ] = useState<string[]>(value.grades?.map((grade) => grade.id ?? ``) ?? []);
    const [ allSubjects, setAllSubjects ] = useState<Subject[]>([]);
    const [ subjectsIds, setSubjectsIds ] = useState<string[]>(value.subjects?.map((subject) => subject.id ?? ``) ?? []);
    const [ allAgeRanges, setAllAgeRanges ] = useState<AgeRange[]>([]);
    const [ ageRangesIds, setAgeRangesIds ] = useState<string[]>(value.age_ranges?.map((ageRange) => ageRange.id ?? ``) ?? []);
    const [ className, setClassName ] = useState(value.class_name ?? ``);
    const [ schoolIds, setSchoolIds ] = useState<string[]>(value.schools?.map((school) => school.school_id) ?? []);
    const [ classNameValid, setClassNameValid ] = useState(true);

    const programsHandler = () => {
        const programs: Program[] = [];

        allSchools.forEach((school) => {
            if (schoolIds.includes(school.school_id)) {
                school?.programs?.forEach((program) => {
                    if (!programs.find((selectedProgram) => selectedProgram.id === program.id)) {
                        programs.push(program);
                    }
                });
            }
        });

        setAllPrograms(programs);
        const updateProgramsIds = programsIds?.filter((value: string) => programs.find((program) => program.id === value));
        setProgramsIds(updateProgramsIds);
    };

    const gradesSubjectsAgeRangesHandler = () => {
        const grades: Grade[] = [];
        const subjects: Subject[] = [];
        const ageRanges: AgeRange[] = [];

        allSchools.forEach((school) => {
            if (schoolIds.includes(school.school_id)) {
                school?.programs?.forEach((program) => {
                    if (programsIds.includes(program.id ?? ``)) {
                        program?.grades?.forEach((grade) => {
                            if (!grades.find((selectedGrade) => selectedGrade.id === grade.id)) {
                                grades.push(grade);
                            }
                        });
                        program?.subjects?.forEach((subject) => {
                            if (!subjects.find((selectedSubject) => selectedSubject.id === subject.id)) {
                                subjects.push(subject);
                            }
                        });
                        program?.age_ranges?.forEach((ageRange) => {
                            if (!ageRanges.find((selectedAgeRange) => selectedAgeRange.id === ageRange.id)) {
                                ageRanges.push(ageRange);
                            }
                        });
                    }
                });
            }
        });

        setAllGrades(grades);
        const updateGradesIds = gradesIds?.filter((value: string) => grades.find((grade) => grade.id === value));
        setGradesIds(updateGradesIds);

        setAllSubjects(subjects);
        const updateSubjectsIds = subjectsIds?.filter((value: string) =>
            subjects.find((grade) => grade.id === value));
        setSubjectsIds(updateSubjectsIds);

        setAllAgeRanges(ageRanges);
        const updateAgeRangeIds = ageRangesIds?.filter((value: string) =>
            ageRanges.find((grade) => grade.id === value));
        setAgeRangesIds(updateAgeRangeIds);
    };

    useEffect(() => {
        programsHandler();
    }, [ schoolIds ]);

    useEffect(() => {
        gradesSubjectsAgeRangesHandler();
    }, [ programsIds ]);

    useEffect(() => {
        const updatedClass: Class = {
            class_id: value.class_id,
            class_name: className,
            schools: allSchools.filter((school) => schoolIds.includes(school.school_id)),
            programs: allPrograms.filter((program) => programsIds.includes(program.id ?? ``)),
            grades: allGrades.filter((grades) => gradesIds.includes(grades.id ?? ``)),
            subjects: allSubjects.filter((subject) => subjectsIds.includes(subject.id ?? ``)),
            age_ranges: allAgeRanges.filter((ageRange) => ageRangesIds.includes(ageRange.id ?? ``)),
        };

        onChange(updatedClass);
    }, [
        className,
        schoolIds,
        allPrograms,
        programsIds,
        allGrades,
        gradesIds,
        allSubjects,
        subjectsIds,
        allAgeRanges,
        ageRangesIds,
    ]);

    useEffect(() => {
        onValidation([ classNameValid ].every((value) => value));
    }, [ classNameValid ]);

    return (
        <div className={classes.root}>
            <TextField
                fullWidth
                value={className}
                label={intl.formatMessage({
                    id: `class_classNameLabel`,
                })}
                variant="outlined"
                type="text"
                autoFocus={!value.class_id}
                validations={[
                    required(intl.formatMessage({
                        id: `class_nameRequiredValidation`,
                    })),
                    letternumeric(intl.formatMessage({
                        id: `classNameValidations_letternumeric`,
                    })),
                    max(35, intl.formatMessage({
                        id: `class_maxCharValidation`,
                    })),
                ]}
                onChange={(value) => setClassName(value)}
                onValidate={setClassNameValid}
            />
            <Select
                fullWidth
                multiple
                label={intl.formatMessage({
                    id: `class_schoolsLabel`,
                })}
                items={allSchools}
                value={schoolIds}
                disabled={!canEditSchool}
                itemText={(school) => school.school_name ?? ``}
                itemValue={(school) => school.school_id}
                onChange={(values) => {
                    setSchoolIds(values);
                }}
            />
            <Select
                fullWidth
                multiple={schoolIds.length > 0}
                label={intl.formatMessage({
                    id: `class_programLabel`,
                })}
                items={allPrograms}
                value={programsIds}
                itemText={(program) => program.name ?? ``}
                itemValue={(program) => program.id ?? ``}
                onChange={(values) => setProgramsIds(values)}
            />
            <Select
                fullWidth
                multiple={programsIds.length > 0}
                label={intl.formatMessage({
                    id: `class_gradeLabel`,
                })}
                items={allGrades}
                value={gradesIds}
                itemText={(grade) => grade.name ?? ``}
                itemValue={(grade) => grade.id ?? ``}
                onChange={(values) => setGradesIds(values)}
            />
            <Select
                fullWidth
                multiple={programsIds.length > 0}
                label={intl.formatMessage({
                    id: `class_ageRangeLabel`,
                })}
                items={allAgeRanges}
                value={ageRangesIds}
                itemText={(ageRange) => buildAgeRangeLabel(ageRange)}
                itemValue={(ageRange) => ageRange.id ?? ``}
                onChange={(values) => setAgeRangesIds(values)}
            />
            <Select
                fullWidth
                multiple={programsIds.length > 0}
                label={intl.formatMessage({
                    id: `class_subjectsLabel`,
                })}
                items={allSubjects}
                value={subjectsIds}
                itemText={(subject) => subject.name ?? ``}
                itemValue={(subject) => subject.id ?? ``}
                onChange={(values) => setSubjectsIds(values)}
            />
        </div>
    );
}
