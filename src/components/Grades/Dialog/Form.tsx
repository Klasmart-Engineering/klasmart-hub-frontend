import { useGetAllGrades } from "@/api/grades";
import { currentMembershipVar } from "@/cache";
import { Grade } from "@/types/graphQL";
import { useValidations } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client/react";
import {
    createStyles,
    makeStyles,
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
    value: Grade;
    onChange: (value: Grade) => void;
    onValidation: (valid: boolean) => void;
}

export default function GradeDialogForm (props: Props) {
    const {
        value,
        onChange,
        onValidation,
    } = props;
    const classes = useStyles();
    const { required } = useValidations();
    const [ gradeName, setGradeName ] = useState(value.name ?? ``);
    const [ gradeNameValid, setGradeNameValid ] = useState(true);
    const [ progressFromId, setProgressFromId ] = useState(value.progress_from_grade?.id ?? ``);
    const [ progressFromIdValid, setProgressFromIdValid ] = useState(true);
    const [ progressToId, setProgressToId ] = useState(value.progress_to_grade?.id ?? ``);
    const [ progressToIdValid, setProgressToIdValid ] = useState(true);
    const [ gradeItems, setGradeItems ] = useState<Grade[]>([]);

    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;

    const {
        loading,
        data,
        refetch,
    } = useGetAllGrades({
        fetchPolicy: `network-only`,
        variables: {
            organization_id,
        },
    });

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
        if (data) {
            const rows = data.organization.grades.filter(grade => grade.status === `active`).map((grade) => ({
                id: grade.id ?? ``,
                name: grade.name ?? ``,
            })) ?? [];
            setGradeItems(rows);
        }
    }, [ data ]);

    useEffect(() => {
        const updatedGrade: Grade = {
            id: value.id,
            name: gradeName,
            progress_from_grade_id: progressFromId,
            progress_to_grade_id: progressToId,
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
                label="Grade Name"
                value={gradeName}
                validations={[ required() ]}
                onChange={setGradeName}
                onValidate={setGradeNameValid}
            />
            <Select
                fullWidth
                label="Progress From"
                value={progressFromId}
                items={gradeItems}
                itemValue={({ id }) => id ?? ``}
                itemText={({ id, name }) => `${name} (${id?.split(`-`)[0]})`}
                onChange={setProgressFromId}
                onValidate={setProgressFromIdValid}
            />
            <Select
                fullWidth
                label="Progress To"
                value={progressToId}
                items={gradeItems}
                itemValue={({ id }) => id ?? ``}
                itemText={({ id, name }) => `${name} (${id?.split(`-`)[0]})`}
                onChange={setProgressToId}
                onValidate={setProgressToIdValid}
            />
        </div>
    );
}
