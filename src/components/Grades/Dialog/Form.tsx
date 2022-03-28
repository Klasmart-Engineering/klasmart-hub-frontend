import { useGetAllGrades } from "@/api/grades";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    Grade,
    isActive,
    isCustomValue,
    isNonSpecified,
    isOtherSystemValue,
} from "@/types/graphQL";
import { useValidations } from "@/utils/validations";
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
import { useIntl } from "react-intl";

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
    value: Grade;
    onChange: (value: Grade) => void;
    onValidation: (valid: boolean) => void;
    loading?: boolean;
}

export default function GradeDialogForm (props: Props) {
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
        min,
        max,
    } = useValidations();
    const [ gradeName, setGradeName ] = useState(value.name ?? ``);
    const [ gradeNameValid, setGradeNameValid ] = useState(true);
    const [ progressFromId, setProgressFromId ] = useState(value.progress_from_grade?.id ?? ``);
    const [ progressFromIdValid, setProgressFromIdValid ] = useState(true);
    const [ progressToId, setProgressToId ] = useState(value.progress_to_grade?.id ?? ``);
    const [ progressToIdValid, setProgressToIdValid ] = useState(true);
    const currentOrganization = useCurrentOrganization();

    const { data: gradesData, loading: gradesDataLoading } = useGetAllGrades({
        variables: {
            organization_id: currentOrganization?.id ?? ``,
        },
        skip: !currentOrganization?.id,
    });

    const allGrades = gradesData?.organization.grades.filter(isActive) ?? [];
    const nonSpecifiedGrade = allGrades.find(isNonSpecified);
    const systemGrades = allGrades.filter(isOtherSystemValue);
    const customGrades = allGrades.filter(isCustomValue);

    useEffect(() => {
        onValidation([
            gradeNameValid,
            progressFromIdValid,
            progressToIdValid,
        ].every((value) => value));
    }, [
        gradeNameValid,
        progressFromIdValid,
        progressToIdValid,
    ]);

    useEffect(() => {
        const updatedGrade: Grade = {
            id: value.id,
            name: gradeName,
            progress_from_grade: {
                id: progressFromId,
            },
            progress_to_grade: {
                id: progressToId,
            },
        };
        onChange(updatedGrade);
    }, [
        gradeName,
        progressFromId,
        progressToId,
    ]);

    return (
        <div className={classes.root}>
            <TextField
                fullWidth
                autoFocus={!value.id}
                label={intl.formatMessage({
                    id: `grades_gradeNameLabel`,
                })}
                value={gradeName}
                validations={[
                    required(),
                    letternumeric(intl.formatMessage({
                        id: `gradeNameValidations_letternumeric`,
                    })),
                    min(3, `Min length 3 of characters.`),
                    max(15, `Max length 15 of characters.`),
                ]}
                id="gradeNameInput"
                loading={ loading || gradesDataLoading}
                disabled={ loading || gradesDataLoading}
                onChange={setGradeName}
                onValidate={setGradeNameValid}
            />
            <Select
                fullWidth
                label={intl.formatMessage({
                    id: `grades_progressFromLabel`,
                })}
                value={progressFromId}
                sections={[
                    {
                        items: [ nonSpecifiedGrade ],
                    },
                    {
                        header: `System Values`,
                        items: systemGrades,
                    },
                ]}
                items={customGrades}
                itemValue={(grade) => grade?.id ?? ``}
                itemText={(grade) => `${grade?.name} (${grade?.id?.split(`-`)[0]})`}
                validations={[ required() ]}
                id="progressFromSelect"
                loading={ loading || gradesDataLoading}
                disabled={ loading || gradesDataLoading}
                onChange={setProgressFromId}
                onValidate={setProgressFromIdValid}
            />
            <Select
                fullWidth
                label={intl.formatMessage({
                    id: `grades_progressToLabel`,
                })}
                value={progressToId}
                sections={[
                    {
                        items: [ nonSpecifiedGrade ],
                    },
                    {
                        header: `System Values`,
                        items: systemGrades,
                    },
                ]}
                items={customGrades}
                itemValue={(grade) => grade?.id ?? ``}
                itemText={(grade) => `${grade?.name} (${grade?.id?.split(`-`)[0]})`}
                validations={[ required() ]}
                id="progressToSelect"
                loading={ loading || gradesDataLoading}
                disabled={ loading || gradesDataLoading}
                onChange={setProgressToId}
                onValidate={setProgressToIdValid}
            />
        </div>
    );
}
