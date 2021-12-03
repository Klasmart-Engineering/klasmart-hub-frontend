import {
    ProgramNode,
    useGetProgramNode,
} from "@/api/programs";
import { isActive } from "@/types/graphQL";
import { buildAgeRangeEdgeLabel } from "@/utils/ageRanges";
import { buildEmptyProgram } from "@/utils/programs";
import {
    Box,
    Chip,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import { Drawer } from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    chip: {
        margin: theme.spacing(0.5),
    },
    accordionDetailsIcon: {
        transition: `.3s cubic-bezier(.25,.8,.5,1)`,
        "&.active": {
            transform: `rotate(180deg)`,
        },
    },
    accordionDetailsIconOpen: {
        transform: `rotate(180deg)`,
    },
}));

interface Props {
    programId?: string;
    open: boolean;
    onClose: () => void;
}

export default function ViewProgramDetailsDrawer (props: Props) {
    const {
        programId,
        open,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { data: programData } = useGetProgramNode({
        variables: {
            id: programId ?? ``,
        },
        fetchPolicy: `cache-and-network`,
        skip: !open || !programId,
    });
    const [ program, setProgram ] = useState<ProgramNode>(buildEmptyProgram());

    useEffect(() => {
        if (!open) {
            setProgram(buildEmptyProgram());
            return;
        }
        setProgram(programData?.programNode ?? buildEmptyProgram());
    }, [ open, programData ]);

    return (
        <Drawer
            open={open}
            title={program.name ?? ``}
            sections={[
                {
                    header: intl.formatMessage({
                        id: `programs_ageRanges`,
                    }),
                    content: (
                        <Box px={1.5}>{program?.ageRanges?.filter(isActive).map((ageRange) => (
                            <Chip
                                key={ageRange.id}
                                className={classes.chip}
                                label={buildAgeRangeEdgeLabel(ageRange)}
                            />
                        ))}</Box>
                    ),
                },
                {
                    header: intl.formatMessage({
                        id: `programs_grades`,
                    }),
                    content: (
                        <Box px={1.5}>{program?.grades?.filter(isActive).map((grade) => (
                            <Chip
                                key={grade.id}
                                className={classes.chip}
                                label={grade.name}
                            />
                        ))}</Box>
                    ),
                },
                {
                    header: intl.formatMessage({
                        id: `programs_subjectsList`,
                    }),
                    content: (
                        <Box px={1.5}>{program?.subjects?.filter(isActive).map((subject) => (
                            <Chip
                                key={subject.id}
                                className={classes.chip}
                                label={subject.name}
                            />
                        ))}</Box>
                    ),
                },
            ]}
            onClose={() => onClose()}
        />
    );
}
