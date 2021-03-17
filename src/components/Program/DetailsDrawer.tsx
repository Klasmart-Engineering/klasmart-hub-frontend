import {
    isActive,
    Program,
} from "@/types/graphQL";
import { buildAgeRangeLabel } from "@/utils/ageRanges";
import {
    Box,
    Chip,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import { Drawer } from "kidsloop-px";
import React from "react";
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
    value?: Program;
    open: boolean;
    onClose: () => void;
}

export default function ViewProgramDetailsDrawer (props: Props) {
    const {
        value,
        open,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();

    return (
        <Drawer
            open={open}
            title={value?.name ?? ``}
            sections={[
                {
                    header: `Age Ranges`,
                    content: (
                        <Box px={1.5}>{value?.age_ranges?.filter(isActive).map((ageRange) => (
                            <Chip
                                key={ageRange.id}
                                className={classes.chip}
                                label={buildAgeRangeLabel(ageRange)}
                            />
                        ))}</Box>
                    ),
                },
                {
                    header: `Grades`,
                    content: (
                        <Box px={1.5}>{value?.grades?.filter(isActive).map((grade) => (
                            <Chip
                                key={grade.id}
                                className={classes.chip}
                                label={grade.name}
                            />
                        ))}</Box>
                    ),
                },
                {
                    header: `Subjects`,
                    content: (
                        <Box px={1.5}>{value?.subjects?.filter(isActive).map((subject) => (
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
