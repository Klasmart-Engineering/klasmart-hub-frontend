import React,
{
    useEffect,
    useState,
} from "react";
import {
    createStyles,
    makeStyles,
    TextField,
    Theme,
} from "@material-ui/core";
import { Class } from "@/types/graphQL";
import { useGetSchools } from "@/api/schools";
import { useReactiveVar } from "@apollo/client";
import { currentMembershipVar } from "@/cache";
import { alphanumeric } from "@/utils/validations";
import { MultiSelect } from "kidsloop-px";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            "& > *": {
                marginBottom: theme.spacing(2),
            },
        },
    }),
);

const getClassNameHelperText = (name: string) => {
    if (!name.length) return `Class name can't be empty`;
    if (alphanumeric(name)) return `Only alphanumeric characters are valid`;
    return ``;
};

interface Props {
    value: Class;
    onChange: (value: Class) => void;
    onValidation: (valid: boolean) => void;
}

export default function ClassDialogForm(props: Props) {
    const {
        value,
        onChange,
        onValidation,
    } = props;
    const classes = useStyles();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const { data } = useGetSchools({
        variables: {
            organization_id,
        },
    });
    const allSchools = data?.organization?.schools?.filter((s) => s.status === `active`) ?? [];
    const [ className, setClassName ] = useState(value.class_name ?? ``);
    const [ schoolIds, setSchoolIds ] = useState<string[]>(value.schools?.map((s) => s.school_id) ?? []);
    const [ status, setStatus ] = useState(value.status ?? ``);

    useEffect(() => {
        onValidation(!getClassNameHelperText(className));
    }, [ className ]);

    useEffect(() => {
        const updatedClass: Class = {
            class_id: value.class_id,
            class_name: className,
            schools: allSchools.filter((s) => schoolIds.includes(s.school_id)),
            status,
        };
        onChange(updatedClass);
    }, [
        className,
        schoolIds,
        status,
    ]);

    return (
        <div className={classes.root}>
            <TextField
                fullWidth
                error={!!getClassNameHelperText(className)}
                helperText={getClassNameHelperText(className) + ` `}
                value={className}
                label="Class name"
                variant="outlined"
                type="text"
                autoFocus={!value.class_id}
                onChange={(e) => setClassName(e.currentTarget.value)}
            />
            <MultiSelect
                label="Schools (optional)"
                items={allSchools}
                value={schoolIds}
                itemText={(school) => school.school_name ?? ``}
                itemValue={(school) => school.school_id}
                onChange={(values) => setSchoolIds(values)}
            />
            <TextField
                disabled
                fullWidth
                value={status}
                variant="outlined"
                label="Status"
                type="text"
                helperText=" "
                onChange={(e) => setStatus(e.currentTarget.value)}
            />
        </div>
    );
}
