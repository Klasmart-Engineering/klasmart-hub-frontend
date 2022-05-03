import { ClassRosterSubgroup } from "../Table";
import TruncateChip from "./TruncateChip";
import { useGetClassNodeRoster } from "@/api/classRoster";
import { useGetSchoolNodeWithClassRelations } from "@/api/schools";
import { useCurrentOrganization } from "@/state/organizationMemberships";
import { FormErrors } from "@/types/form";
import { Status } from "@/types/graphQL";
import { mapClassNodeToClassRow } from "@/utils/classes";
import { mapUserRowPerRole } from "@/utils/users";
import { useValidations } from "@/utils/validations";
import { Select } from "@kl-engineering/kidsloop-px";
import {
    CircularProgress,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React,
{
    useEffect,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

export interface State {
    targetClassId: string;
}

export const defaultState: State = {
    targetClassId: ``,
};

export interface Errors extends FormErrors<State> {}

export interface Props {
    userIds: string[];
    currentClassId: string;
    initialState: State;
    subgroupBy: ClassRosterSubgroup;
    errors?: Errors;
    onChange: (value: State) => void;
    onValidation: (valid: boolean) => void;
}

const useStyles = makeStyles((theme) => {
    return createStyles({
        pageLoading: {
            textAlign: `center`,
            padding: theme.spacing(5),
        },
    });
});

export default function TransferForm (props: Props) {
    const {
        userIds,
        currentClassId,
        initialState,
        subgroupBy,
        errors = {},
        onChange,
        onValidation,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const [ targetClassId, setTargetClassId ] = useState(initialState.targetClassId);
    const [ targetClassIdValid, setTargetClassIdValid ] = useState(!errors?.targetClassId);
    const [ associatedSchoolId, setAssociatedSchoolId ] = useState(``);
    const { required } = useValidations();
    const currentOrganization = useCurrentOrganization();

    const { data: currentClassData, loading: loadingCurrentClassUserData } = useGetClassNodeRoster({
        variables: {
            id: currentClassId ?? ``,
            direction: `FORWARD`,
            count: userIds.length,
            order: `ASC`,
            orderBy: `givenName`,
            showStudents: subgroupBy === `Student`,
            showTeachers: subgroupBy === `Teacher`,
            filter: {
                OR: userIds.map((id) => ({
                    userId: {
                        operator: `eq`,
                        value: id,
                    },
                })) ?? [],
            },
        },
        fetchPolicy: `cache-first`,
        skip: !open || !userIds || !currentClassId,
    });

    const users = subgroupBy === `Student` ?
        currentClassData?.classNode?.studentsConnection?.edges.map((edge) => mapUserRowPerRole(edge, subgroupBy)) ?? [] :
        currentClassData?.classNode?.teachersConnection?.edges.map((edge) => mapUserRowPerRole(edge, subgroupBy)) ?? [];
    const userNames = users.map(item => `${item.givenName} ${item.familyName}`);

    const {
        data: schoolNodeData,
        refetch: refetchSchoolNode,
        loading: loadingSchoolData,
    } = useGetSchoolNodeWithClassRelations({
        variables: {
            id: associatedSchoolId,
        },
        fetchPolicy: `cache-and-network`,
        skip: !open || (associatedSchoolId === ``),
    });

    const allClasses = schoolNodeData?.schoolNode?.classesConnection?.edges.filter(({ node }) => {
        const match = node.id !== currentClassId &&
        node.status === Status.ACTIVE &&
        node.schoolsConnection?.totalCount === 1;
        return match;
    }).map(mapClassNodeToClassRow) ?? [];

    useEffect(() => {
        if (!currentClassData) return;
        const schoolId = currentClassData.classNode?.schools !== undefined ? currentClassData.classNode.schools[0].id : ``;
        setAssociatedSchoolId(schoolId);
    }, [ currentClassData, currentOrganization?.id ]);

    useEffect(() => {
        if (!currentClassData) return;
        refetchSchoolNode({
            id: associatedSchoolId,
        });
    }, [ associatedSchoolId ]);

    useEffect(() => {
        onValidation([ targetClassIdValid, Object.keys(errors).length === 0 ].every((valid) => valid));
    }, [
        targetClassIdValid,
        errors,
        onValidation,
    ]);

    useEffect(() => {
        const newState: State = {
            targetClassId: targetClassId,
        };
        onChange(newState);
    }, [ targetClassId ]);

    const loading = loadingCurrentClassUserData || loadingSchoolData;

    const attributes = {
        classes: intl.formatMessage({
            id: `classes_classTitle`,
        }, {
            count: 1,
        }),
    };

    if (loading) {
        return (
            <div className={classes.pageLoading}>
                <CircularProgress color="primary" />
            </div>
        );
    }

    return (
        <div>
            <Typography paddingBottom={2}>
                <FormattedMessage
                    id="classRoster_transferInfo"
                    defaultMessage="Transfer {users} from { class } to a new class"
                    values={{
                        users:
                            <TruncateChip
                                items={userNames}
                                maxItemsInTooltip={8}
                                pluralLabel={intl.formatMessage({
                                    id: `navbar_UsersTab`,
                                })}
                            />,
                        class: <b>{currentClassData?.classNode.name}</b>,
                    }}
                />
            </Typography>
            <Typography
                paddingBottom={2}
                fontWeight="bold"
            >
                <FormattedMessage
                    id="classRoster_selectClass"
                    defaultMessage="Please select a new class below"
                />
            </Typography>
            <Select
                fullWidth
                id={`classes`}
                label={intl.formatMessage({
                    id: `classes_classTitle`,
                })}
                loading={loading}
                items={allClasses}
                value={targetClassId}
                validations={[
                    required(intl.formatMessage({
                        id: `validation.error.attribute.required`,
                    }, {
                        attribute: attributes.classes,
                    })),
                ]}
                itemText={(classItem) => classItem.name ?? ``}
                itemValue={(classItem) => classItem.id}
                onChange={(value) => {
                    setTargetClassId(value);
                }}
                onValidate={setTargetClassIdValid}
            />
        </div>
    );
}
