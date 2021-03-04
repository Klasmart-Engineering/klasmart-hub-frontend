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
import { School } from "@/types/graphQL";
import { alphanumeric } from "@/utils/validations";
import { useGetSchools } from "@/api/schools";
import { useReactiveVar } from "@apollo/client";
import { currentMembershipVar } from "@/cache";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const getSchoolNameHelperText = (name: string | undefined, schools: School[]) => {
    if (!name?.length) return <FormattedMessage id="schools_required" />;
    if (alphanumeric(name)) return <FormattedMessage id="schools_alphanumeric" />;
    if (schools.find((s) => s.school_name === name)) return <FormattedMessage id="schools_unique" />;
};

interface Props {
    value: School;
    acceptableSchoolName?: string | null;
    onChange: (value: School) => void;
    onValidation: (valid: boolean) => void;
}

export default function SchoolDialogForm(props: Props) {
    const {
        value,
        acceptableSchoolName,
        onChange,
        onValidation,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const { data } = useGetSchools({
        variables: {
            organization_id,
        },
    });
    const [ schoolName, setSchoolName ] = useState(value.school_name ?? ``);

    const schools = data?.organization.schools?.filter((s) => s.school_name !== acceptableSchoolName) ?? [];

    useEffect(() => {
        onValidation(!getSchoolNameHelperText(schoolName, schools));
    }, [ schoolName, data ]);

    useEffect(() => {
        const updatedSchool: School = {
            school_id: value.school_id,
            school_name: schoolName.trim(),
        };
        onChange(updatedSchool);
    }, [ schoolName ]);

    return (
        <>
            <TextField
                fullWidth
                helperText={getSchoolNameHelperText(schoolName, schools) ?? ` `}
                error={!!getSchoolNameHelperText(schoolName, schools)}
                value={schoolName}
                label={intl.formatMessage({ id: `schools_nameLabel` })}
                variant="outlined"
                type="text"
                autoFocus={!value?.school_id}
                onChange={(e) => setSchoolName(e.currentTarget.value)}
            />
        </>
    );
}
