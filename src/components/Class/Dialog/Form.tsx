import { useGetAllPaginatedPrograms } from "@/api/programs";
import { useGetPaginatedSchools } from "@/api/schools";
import { buildSchoolIdFilter } from "@/operations/queries/getPaginatedOrganizationPrograms";
import {
    Program,
    School,
    Status,
} from "@/types/graphQL";
import { useGetClassFormValues } from "@/utils/classFormDropdownValues";
import { usePermission } from "@/utils/permissions";
import { mapSchoolNodeToSchool } from "@/utils/schools";
import { useValidations } from "@/utils/validations";
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

export interface ClassForm {
    id: string;
    name?: string | null;
    schools?: School[] | null;
    programs?: Program[] | null;
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
    const {
        data,
        loading: schoolDataLoading,
    } = useGetPaginatedSchools({
        fetchPolicy: `cache-first`,
        variables: {
            direction: `FORWARD`,
            count: 50,
            filter: {
                status: {
                    operator: `eq`,
                    value: Status.ACTIVE,
                },
            },
        },
    });

    const [ allSchools, setAllSchools ] = useState<School[]>([]);
    const [ allPrograms, setAllPrograms ] = useState<Program[]>([]);
    const [ programsIds, setProgramsIds ] = useState<string[]>(value?.programs?.map(program => program.id as string) ?? []);
    const [ gradesIds, setGradesIds ] = useState<string[]>(value?.grades ?? []);
    const [ subjectsIds, setSubjectsIds ] = useState<string[]>(value.subjects ?? []);
    const [ ageRangesIds, setAgeRangesIds ] = useState<string[]>(value.ageRanges ?? []);
    const [ className, setClassName ] = useState(value.name ?? ``);
    const [ schoolIds, setSchoolIds ] = useState<string[]>(value?.schools?.map(school => school.school_id) ?? []);
    const [ classNameValid, setClassNameValid ] = useState(true);

    const {
        data: programsData,
        refetch: refetchPrograms,
        loading: programsLoading,
    } = useGetAllPaginatedPrograms({
        variables: {
            direction: `FORWARD`,
            count: 50,
            order: `ASC`,
            orderBy: `name`,
            filter: buildSchoolIdFilter(schoolIds),
        },
        skip: !schoolIds.length,
        notifyOnNetworkStatusChange: true,
        fetchPolicy: `no-cache`,
    });

    const {
        gradeValueOptions,
        subjectValueOptions,
        ageRangesValueOptions,
        gradesLoading,
        subjectsLoading,
        ageRangesLoading,
    } = useGetClassFormValues(programsIds);

    useEffect(() => {
        const updatedClass: ClassForm = {
            id: value.id,
            name: className,
            schools: allSchools.filter((school) => schoolIds.includes(school.school_id)),
            programs: allPrograms.filter((program) => programsIds.includes(program.id ?? ``)),
            grades: gradesIds,
            subjects: subjectsIds,
            ageRanges: ageRangesIds,
        };

        onChange(updatedClass);
    }, [
        className,
        schoolIds,
        allPrograms,
        programsIds,
        gradesIds,
        subjectsIds,
        ageRangesIds,
    ]);

    const resetIds = () => {
        if (!gradesLoading) {
            const updateGradesIds = value.grades?.filter((value: string) => gradeValueOptions.find((grade) =>
                grade.value === value)) ?? [];
            setGradesIds(updateGradesIds);
        }

        if (!subjectsLoading) {
            const updateSubjectsIds = value.subjects?.filter((value: string) =>
                subjectValueOptions.find((subject) => subject.value === value)) ?? [];
            setSubjectsIds(updateSubjectsIds);
        }

        if (!ageRangesLoading) {
            const updateAgeRangeIds = value.ageRanges?.filter((value: string) =>
                ageRangesValueOptions.find((ageRange) => ageRange.value === value)) ?? [];
            setAgeRangesIds(updateAgeRangeIds);
        }
    };

    useEffect(() => {
        resetIds();
    }, [
        ageRangesValueOptions,
        subjectValueOptions,
        gradeValueOptions,
    ]);

    useEffect(() => {
        onValidation([ classNameValid ].every((value) => value));
    }, [ classNameValid ]);

    useEffect(() => {
        const schools = data?.schoolsConnection?.edges.map(edge => mapSchoolNodeToSchool(edge.node)) ?? [];
        setAllSchools(schools);
        setSchoolIds(value.schools?.map((school) => school.school_id) ?? []);
    }, [ data ]);

    useEffect(() => {
        const programs = programsData?.programsConnection.edges.map(edge => ({
            id: edge.node.id,
            name: edge.node.name,
        })) ?? [];
        setAllPrograms([ ...allPrograms, ...programs ]);
    }, [ programsData ]);

    const schoolOnChange = (values: string[]) => {
        setProgramsIds([]);
        setAllPrograms([]);
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
                    max(35, intl.formatMessage({
                        id: `class_maxCharValidation`,
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
                items={allSchools}
                value={schoolIds}
                disabled={!canEditSchool || loading || schoolDataLoading}
                itemText={(school) => school.school_name ?? ``}
                itemValue={(school) => school.school_id}
                loading={loading || schoolDataLoading}
                onChange={schoolOnChange}
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
                loading={loading || schoolDataLoading || programsLoading}
                disabled={loading || schoolDataLoading }
                onChange={(values) => setProgramsIds(values)}
            />
            <Select
                fullWidth
                multiple={programsIds.length > 0}
                label={intl.formatMessage({
                    id: `class_gradeLabel`,
                })}
                items={gradeValueOptions}
                value={gradesIds}
                itemText={(grade) => grade.label ?? ``}
                itemValue={(grade) => grade.value ?? ``}
                loading={loading || schoolDataLoading }
                onChange={(values) => setGradesIds(values)}
            />
            <Select
                fullWidth
                multiple={programsIds.length > 0}
                label={intl.formatMessage({
                    id: `class_ageRangeLabel`,
                })}
                items={ageRangesValueOptions}
                value={ageRangesIds}
                itemText={(ageRange) => ageRange.label}
                itemValue={(ageRange) => ageRange.value ?? ``}
                loading={loading || schoolDataLoading }
                disabled={loading || schoolDataLoading }
                onChange={(values) => setAgeRangesIds(values)}
            />
            <Select
                fullWidth
                multiple={programsIds.length > 0}
                label={intl.formatMessage({
                    id: `class_subjectsLabel`,
                })}
                items={subjectValueOptions}
                value={subjectsIds}
                itemText={(subject) => subject.label ?? ``}
                itemValue={(subject) => subject.value ?? ``}
                loading={loading || schoolDataLoading }
                disabled={loading || schoolDataLoading }
                onChange={(values) => setSubjectsIds(values)}
            />
        </div>
    );
}
