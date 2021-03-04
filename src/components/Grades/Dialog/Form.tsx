import {
    AgeRange,
    Grade,
} from "@/types/graphQL";
import { buildAgeRangeLabel } from "@/utils/ageRanges";
import { useValidations } from "@/utils/validations";
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
    const [ gradeName, setGradeName ] = useState(value.grade_name ?? ``);
    const [ gradeNameValid, setGradeNameValid ] = useState(true);
    const [ ageRangeId, setAgeRangeId ] = useState(value.age_range?.age_range_id ?? ``);
    const [ ageRangeIdValid, setAgeRangeIdValid ] = useState(true);
    const [ progressFromId, setProgressFromId ] = useState(value.progress_from_grade?.grade_id ?? ``);
    const [ progressFromIdValid, setProgressFromIdValid ] = useState(true);
    const [ progressToId, setProgressToId ] = useState(value.progress_to_grade?.grade_id ?? ``);
    const [ progressToIdValid, setProgressToIdValid ] = useState(true);

    const ageRangesData: AgeRange[] = [];

    useEffect(() => {
        onValidation([
            gradeNameValid,
            ageRangeIdValid,
            progressFromIdValid,
            progressToIdValid,
        ].every((value) => value));
    }, [
        gradeNameValid,
        ageRangeIdValid,
        progressFromIdValid,
        progressToIdValid,
    ]);

    useEffect(() => {
        const updatedGrade: Grade = {
            grade_id: value.grade_id,
            progress_from_grade: {
                grade_id: progressFromId,
            },
            progress_to_grade: {
                grade_id: progressToId,
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
                autoFocus={!value.grade_id}
                label="Grade Name"
                value={gradeName}
                validations={[ required() ]}
                onChange={setGradeName}
                onValidate={setGradeNameValid}
            />
            <Select
                fullWidth
                label="Progress From"
                value={progressToId}
                items={[]}
                onChange={setProgressFromId}
                onValidate={setProgressFromIdValid}
            />
            <Select
                fullWidth
                label="Progress To"
                value={progressToId}
                items={[]}
                onChange={setProgressToId}
                onValidate={setProgressToIdValid}
            />
        </div>
    );
}
