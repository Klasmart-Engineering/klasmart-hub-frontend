import { useGetSchools } from "@/api/schools";
import { currentMembershipVar } from "@/cache";
import { Class } from "@/types/graphQL";
import { usePermission } from "@/utils/checkAllowed";
import { alphanumeric } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
import {
    createStyles,
    makeStyles,
    TextField,
    Theme,
} from "@material-ui/core";
import { MultiSelect } from "kidsloop-px";
import React, {
    useEffect,
    useState,
} from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            "& > *": {
                marginBottom: theme.spacing(2),
            },
        },
    }),
);

const getClassNameHelperText = (
    name: string,
    classes: Class[] | null | undefined,
    currentClassName: string,
) => {
    if (!name.length) return `Class name can't be empty`;
    if (alphanumeric(name)) return `Only alphanumeric characters are valid`;
    if (
        classes &&
        classes
            .filter(
                (schoolClass) => schoolClass.class_name !== currentClassName,
            )
            .find((schoolClass) => schoolClass.class_name === name)
    )
        return `Class names must be unique`;
    return ``;
};

interface Props {
    value: Class;
    onChange: (value: Class) => void;
    onValidation: (valid: boolean) => void;
    schoolClasses?: Class[] | null;
}

export default function ClassDialogForm(props: Props) {
    const {
        value,
        onChange,
        onValidation,
        schoolClasses,
    } = props;
    const classes = useStyles();
    const organization = useReactiveVar(currentMembershipVar);
    const canEditSchool = usePermission(`edit_school_20330`);
    const { organization_id } = organization;
    const { data } = useGetSchools({
        variables: {
            organization_id,
        },
    });
    const allSchools =
        data?.organization?.schools?.filter((s) => s.status === `active`) ?? [];
    const [ className, setClassName ] = useState(value.class_name ?? ``);
    const [ schoolIds, setSchoolIds ] = useState<string[]>(
        value.schools?.map((school) => school.school_id) ?? [],
    );
    const [ currentClassName ] = useState(value.class_name ?? ``);

    useEffect(() => {
        onValidation(
            !getClassNameHelperText(
                className,
                schoolClasses,
                currentClassName,
            ),
        );
    }, [ className ]);

    useEffect(() => {
        const updatedClass: Class = {
            class_id: value.class_id,
            class_name: className,
            schools: allSchools.filter((school) =>
                schoolIds.includes(school.school_id),
            ),
        };
        onChange(updatedClass);
    }, [ className, schoolIds ]);

    return (
        <div className={classes.root}>
            <TextField
                fullWidth
                error={
                    !!getClassNameHelperText(
                        className,
                        schoolClasses,
                        currentClassName,
                    )
                }
                helperText={getClassNameHelperText(
                    className,
                    schoolClasses,
                    currentClassName,
                )}
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
                disabled={!canEditSchool}
                itemText={(school) => school.school_name ?? ``}
                itemValue={(school) => school.school_id}
                onChange={(values) => setSchoolIds(values)}
            />
        </div>
    );
}
