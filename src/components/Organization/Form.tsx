import OrganizationInfo from "./Forms/OrganizationInfo";
import Personalization from "./Forms/Personalization";
import {
    Organization,
    OrganizationTab,
} from "@/types/graphQL";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(() =>
    createStyles({
        hideForm: {
            display: `none`,
        },
        showForm: {
            display: `block`,
        },
    }));

interface Props {
    value: Organization;
    currentTab: OrganizationTab;
    onChange: (value: Organization) => void;
    onValidation: (valid: boolean) => void;
}

export default function OrganizationForm (props: Props) {
    const {
        value,
        currentTab,
        onChange,
        onValidation,
    } = props;
    const classes = useStyles();

    return (
        <>
            <div className={currentTab === `organizationInfo` ? classes.showForm : classes.hideForm}>
                <OrganizationInfo
                    value={value}
                    onChange={onChange}
                    onValidation={onValidation}
                />
            </div>
            <div className={currentTab === `personalization` ? classes.showForm : classes.hideForm}>
                <Personalization
                    value={value}
                    onChange={onChange}
                    onValidation={onValidation}
                />
            </div>
        </>
    );
}
